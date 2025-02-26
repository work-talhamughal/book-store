import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Book, BookFormData } from "../types";
import { booksApi } from "../api/books";

export function useBooks(page: number, search: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["books", page, search],
    queryFn: () => booksApi.getBooks(page, search),
    keepPreviousData: true,
  });

  const showErrorToast = (error: unknown) => {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    toast.error(message, {
      style: { background: "#EF4444", color: "#fff" },
      duration: 4000,
    });
  };

  const addBookMutation = useMutation({
    mutationFn: booksApi.addBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book added successfully", {
        icon: "📚",
        style: { background: "#10B981", color: "#fff" },
      });
    },
    onError: showErrorToast,
  });

  const updateBookMutation = useMutation({
    mutationFn: ({ id, book }: { id: number; book: BookFormData }) =>
      booksApi.updateBook(id, book),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book updated successfully", {
        icon: "✨",
        style: { background: "#3B82F6", color: "#fff" },
      });
    },
    onError: showErrorToast,
  });

  const deleteBookMutation = useMutation({
    mutationFn: booksApi.deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book deleted successfully", {
        icon: "🗑️",
        style: { background: "#EF4444", color: "#fff" },
      });
    },
    onError: showErrorToast,
  });

  return {
    books: data?.books || [],
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    total: data?.total || 0,
    isLoading,
    isError,
    error,
    addBookMutation,
    updateBookMutation,
    deleteBookMutation,
  };
}
