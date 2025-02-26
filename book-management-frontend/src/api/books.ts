import axios from "axios";
import { Book, BookFormData } from "../types";

const API_URL = import.meta.env.VITE_API_URL;
const Books_API_URL = API_URL + "/books/";

interface BooksResponse {
  books: Book[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data;
    if (apiError?.details?.length) {
      return new Error(
        apiError.details.map((d: any) => `${d.field}: ${d.message}`).join(", ")
      );
    }
    return new Error(apiError?.message || error.message);
  }
  return new Error("An unexpected error occurred");
};

export const booksApi = {
  getBooks: async (
    page: number = 1,
    search: string = ""
  ): Promise<BooksResponse> => {
    try {
      const response = await axios.get(Books_API_URL, {
        params: {
          page,
          search: search || undefined,
        },
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  addBook: async (book: BookFormData): Promise<Book> => {
    try {
      const response = await axios.post(Books_API_URL, book);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  updateBook: async (id: number, book: BookFormData): Promise<Book> => {
    try {
      const response = await axios.put(`${Books_API_URL}${id}`, book);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  deleteBook: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${Books_API_URL}${id}`);
    } catch (error) {
      throw handleError(error);
    }
  },
};
