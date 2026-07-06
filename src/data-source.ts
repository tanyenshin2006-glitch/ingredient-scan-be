import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User.js';
import { ScanHistory } from './entities/ScanHistory.js';
import { Ingredient } from './entities/Ingredient.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'Friday5!',
  database: 'ingredient_scan',
  synchronize: true,
  logging: false,
  entities: [User, ScanHistory, Ingredient],
});