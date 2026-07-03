import express from 'express';
import 'dotenv/config';
import 'reflect-metadata';
import { AppDataSource } from './data-source.js';
import axios from 'axios';
import { Ingredient } from './entities/Ingredient.js';

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

app.post('/api/ingredients', async (req, res) => {
  const { name, description, safety_notes, is_common_allergen, embedding } = req.body;

  try {
    const repo = AppDataSource.getRepository(Ingredient);
    await repo.upsert(
      { name, description, safety_notes, is_common_allergen, embedding },
      { conflictPaths: ['name'], skipUpdateIfNoValuesChanged: true }
    );
    res.json({ success: true });
  } catch (error: unknown) {
    console.error('Failed to save ingredient:', error);
    res.status(500).json({ error: 'Failed to save ingredient' });
  }
});

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