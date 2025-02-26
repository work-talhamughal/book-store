import request from "supertest";
import app from "../../app";
import { createTestBook } from "../test/helpers";
import { AppDataSource } from "../config/database";
import { Book } from "../models/book";

describe("BookController", () => {
  describe("POST /api/books", () => {
    it("should create a new book", async () => {
      const newBook = {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "978-0743273565",
      };

      const response = await request(app).post("/api/books").send(newBook);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe("The Great Gatsby");
    });

    it("should prevent duplicate ISBN", async () => {
      const book = await createTestBook();
      const response = await request(app).post("/api/books").send({
        title: "Different Title",
        author: "Different Author",
        isbn: book.isbn,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Book with this ISBN already exists");
    });
  });

  describe("GET /api/books", () => {
    beforeEach(async () => {
      await createTestBook({ title: "Book 1", isbn: "978-1234567890" });
      await createTestBook({ title: "Book 2", isbn: "978-0987654321" });
    });

    it("should return all books with pagination", async () => {
      const response = await request(app)
        .get("/api/books")
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.books).toHaveLength(2);
      expect(response.body.total).toBe(2);
    });

    it("should filter books by search term", async () => {
      const response = await request(app)
        .get("/api/books")
        .query({ search: "Book 1" });

      expect(response.status).toBe(200);
      expect(response.body.books).toHaveLength(1);
      expect(response.body.books[0].title).toBe("Book 1");
    });

    it("should handle search with no results", async () => {
      const response = await request(app)
        .get("/api/books")
        .query({ search: "NonexistentBook" });

      expect(response.status).toBe(200);
      expect(response.body.books).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    it("should return correct page information", async () => {
      const response = await request(app)
        .get("/api/books")
        .query({ page: 1, limit: 1 });

      expect(response.status).toBe(200);
      expect(response.body.currentPage).toBe(1);
      expect(response.body.totalPages).toBe(2);
      expect(response.body.books).toHaveLength(1);
    });
  });

  describe("GET /api/books/:id", () => {
    it("should return a book by id", async () => {
      const book = await createTestBook();
      const response = await request(app).get(`/api/books/${book.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(book.id);
    });

    it("should return 404 for non-existent book", async () => {
      const response = await request(app).get("/api/books/999");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Book not found");
    });
  });

  describe("PUT /api/books/:id", () => {
    it("should update a book", async () => {
      const book = await createTestBook();
      const response = await request(app).put(`/api/books/${book.id}`).send({
        title: "Updated Title",
        author: "Updated Author",
        isbn: "978-0743273565",
      });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Updated Title");
    });

    it("should return validation error for invalid update", async () => {
      const book = await createTestBook();
      const response = await request(app).put(`/api/books/${book.id}`).send({
        title: "",
        author: "Updated Author",
        isbn: "978-0743273565",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });
  });
});

describe("DELETE /api/books/:id", () => {
  it("should delete a book", async () => {
    const book = await createTestBook();
    const response = await request(app).delete(`/api/books/${book.id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Book deleted successfully");

    const deletedBook = await AppDataSource.getRepository(Book).findOne({
      where: { id: book.id },
    });
    expect(deletedBook).toBeNull();
  });
});
