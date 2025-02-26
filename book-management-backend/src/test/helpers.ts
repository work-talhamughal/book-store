import { Book } from "../models/book";
import { AppDataSource } from "../config/database";

export const createTestBook = async (overrides = {}) => {
  const book = AppDataSource.getRepository(Book).create({
    title: "Test Book",
    author: "Test Author",
    isbn: "978-0123456789",
    ...overrides,
  });
  return await AppDataSource.getRepository(Book).save(book);
};
