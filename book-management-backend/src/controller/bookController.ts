import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Book } from "../models/book";
import { AppError } from "../middleware/errorHandler";
import { validate } from "class-validator";

export class BookController {
  private bookRepository = AppDataSource.getRepository(Book);

  create = async (req: Request, res: Response) => {
    try {
      const { title, author, isbn } = req.body;

      const existingBook = await this.bookRepository.findOne({
        where: { isbn },
      });

      if (existingBook) {
        throw new AppError(400, "Book with this ISBN already exists");
      }

      const book = this.bookRepository.create({ title, author, isbn });

      const errors = await validate(book);
      if (errors.length > 0) {
        const validationErrors = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints || {})[0],
        }));
        throw new AppError(400, "Validation failed", validationErrors);
      }

      await this.bookRepository.save(book);
      return res.status(201).json(book);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, "Failed to create book");
    }
  };

  getAll = async (req: Request, res: Response) => {
    const { page = 1, limit = 5, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const queryBuilder = this.bookRepository.createQueryBuilder("book");

    if (search) {
      queryBuilder.where(
        "(LOWER(book.title) LIKE LOWER(:search) OR LOWER(book.author) LIKE LOWER(:search) OR LOWER(book.isbn) LIKE LOWER(:search))",
        { search: `%${search}%` }
      );
    }

    const [books, total] = await queryBuilder
      .orderBy("book.createdAt", "DESC")
      .skip(skip)
      .take(Number(limit))
      .getManyAndCount();

    return res.json({
      books,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  };

  getOne = async (req: Request, res: Response) => {
    const book = await this.bookRepository.findOne({
      where: { id: Number(req.params.id) },
    });

    if (!book) {
      throw new AppError(404, "Book not found");
    }

    return res.json(book);
  };

  update = async (req: Request, res: Response) => {
    try {
      const book = await this.bookRepository.findOne({
        where: { id: Number(req.params.id) },
      });

      if (!book) {
        throw new AppError(404, "Book not found");
      }

      const { title, author, isbn } = req.body;
      Object.assign(book, { title, author, isbn });

      const errors = await validate(book);
      if (errors.length > 0) {
        const validationErrors = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints || {})[0],
        }));
        throw new AppError(400, "Validation failed", validationErrors);
      }

      await this.bookRepository.save(book);
      return res.json(book);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, "Failed to update book");
    }
  };

  delete = async (req: Request, res: Response) => {
    const result = await this.bookRepository.delete(req.params.id);
    if (result.affected === 0) {
      throw new AppError(404, "Book not found");
    }
    return res.status(200).json({ message: "Book deleted successfully" });
  };
}
