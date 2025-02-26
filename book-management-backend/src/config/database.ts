import { DataSource } from "typeorm";
import { Book } from "../models/book";
import path from "path";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: path.join(__dirname, "database.sqlite"),
  entities: [Book],
  synchronize: true,
  logging: true,
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database has been initialized!");
  } catch (error) {
    console.error("Error during database initialization:", error);
    throw error;
  }
};
