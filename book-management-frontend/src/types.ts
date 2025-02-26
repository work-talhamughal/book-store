export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
}

export interface BooksResponse {
  books: Book[];
  total: number;
  currentPage: number;
  totalPages: number;
}
