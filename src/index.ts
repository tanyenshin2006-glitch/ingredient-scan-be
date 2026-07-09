import express from 'express';
import 'dotenv/config';
import 'reflect-metadata';
import { AppDataSource } from './data-source.js';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/analyse-ingredients', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/api/analyse-ingredients`, 
      { text },
      {headers: { 'x-api-key': process.env.INTERNAL_API_KEY}}
    );
    res.json(response.data);
  } catch (error: unknown) {
    console.error('AI service call failed', error);
    res.status(500).json({error: 'Failed to analyse ingredients'})
  }
});


//For seed.ts script
app.post('/api/ingredients', async (req, res) => {
  const { name, description, safety_notes, is_common_allergen, category, severity, embedding } = req.body;

  try {
    await AppDataSource.query(
      `INSERT INTO ingredient (name, description, safety_notes, is_common_allergen, category, severity, embedding)
       VALUES ($1, $2, $3, $4, $5, $6, $7::vector)
       ON CONFLICT (name) DO UPDATE
       SET description = EXCLUDED.description,
        safety_notes = EXCLUDED.safety_notes,
        is_common_allergen = EXCLUDED.is_common_allergen,
        category = EXCLUDED.category,
        severity = EXCLUDED.severity,
        embedding = EXCLUDED.embedding`,
      [name, description, safety_notes, is_common_allergen, category, severity, JSON.stringify(embedding)]
    );
    res.json({ success: true });
  } catch (error: unknown) {
    console.error('Failed to save ingredient:', error);
    res.status(500).json({ error: 'Failed to save ingredient' });
  }
});

app.post('/api/ingredients/search', async (req, res) => {
  const { embedding, limit = 5, maxDistance = 0.9 } = req.body;
  try{
    const results= await AppDataSource.query(
      `SELECT name, description, safety_notes, is_common_allergen, embedding <-> $1::vector AS distance
      FROM ingredient
      WHERE embedding <-> $1::vector < $3
      ORDER BY embedding <-> $1::vector
      LIMIT $2`,
      [JSON.stringify(embedding), limit, maxDistance]
    );
    res.json(results);
    console.log(results)
  }catch (error:unknown) {
    console.error('Vector search failed:', error);
    res.status(500).json({ error: 'Vector search failed' })
  }
})

AppDataSource.initialize()
  .then(async () => {
    console.log('Database connected');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error: unknown) => {
    console.error('Database connection failed:', error);
  });