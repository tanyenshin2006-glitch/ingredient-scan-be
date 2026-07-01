import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { ScanHistory } from './entities/ScanHistory';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'Friday5!',
  database: 'ingredient_scan',
  synchronize: true,
  logging: true,
  entities: [User, ScanHistory],
});