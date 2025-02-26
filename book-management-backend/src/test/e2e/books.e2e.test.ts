import request from "supertest";
import app from "../../../app";
import { AppDataSource } from "../../config/database";
import { createTestBook } from "../helpers";
import { Book } from "../../models/book";

describe("Books API E2E Tests", () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  beforeEach(async () => {
    if (AppDataSource.isInitialized) {
      const entities = AppDataSource.entityMetadatas;
      for (const entity of entities) {
        const repository = AppDataSource.getRepository(entity.name);
        await repository.clear();
      }
    }
  });

  describe("Complete Book Lifecycle", () => {
    it("should perform CRUD operations in sequence", async () => {
      const newBook = {
        title: "Test Book",
        author: "Test Author",
        isbn: "978-0-7475-3269-9",
      };

      const createResponse = await request(app)
        .post("/api/books")
        .send(newBook);

      expect(createResponse.status).toBe(201);
      const bookId = createResponse.body.id;

      const getResponse = await request(app).get(`/api/books/${bookId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.title).toBe(newBook.title);

      const updateData = {
        title: "Updated Book",
        author: "Updated Author",
        isbn: "978-0-7475-3270-5",
      };

      const updateResponse = await request(app)
        .put(`/api/books/${bookId}`)
        .send(updateData);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.title).toBe(updateData.title);

      const listResponse = await request(app)
        .get("/api/books")
        .query({ search: "Updated Book" });

      expect(listResponse.status).toBe(200);
      expect(listResponse.body.books[0].title).toBe(updateData.title);

      const deleteResponse = await request(app).delete(`/api/books/${bookId}`);

      expect(deleteResponse.status).toBe(200);

      const verifyDeleteResponse = await request(app).get(
        `/api/books/${bookId}`
      );

      expect(verifyDeleteResponse.status).toBe(404);
    });
  });

  describe("Error Scenarios", () => {
    it("should handle concurrent operations", async () => {
      const book = await createTestBook();

      const duplicateResponse = await request(app).post("/api/books").send({
        title: "Another Book",
        author: "Another Author",
        isbn: book.isbn,
      });

      expect(duplicateResponse.status).toBe(400);

      const updateResponse = await request(app).put("/api/books/999999").send({
        title: "Updated Title",
        author: "Updated Author",
        isbn: "978-1111111111",
      });

      expect(updateResponse.status).toBe(404);

      const deleteResponse = await request(app).delete("/api/books/999999");

      expect(deleteResponse.status).toBe(404);
    });

    it("should handle invalid data", async () => {
      const invalidIsbnResponse = await request(app).post("/api/books").send({
        title: "Valid Title",
        author: "Valid Author",
        isbn: "invalid-isbn",
      });

      expect(invalidIsbnResponse.status).toBe(400);

      const emptyFieldsResponse = await request(app).post("/api/books").send({
        title: "",
        author: "",
        isbn: "",
      });

      expect(emptyFieldsResponse.status).toBe(400);
    });
  });
});
