import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { Book, BookFormData } from "./types";
import { Box, Container, Grid } from "@mui/material";
import { useBooks } from "./hooks/useBooks";
import { BookList } from "./components/BookList";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { Header } from "./components/Header";
import { BookFormSection } from "./components/BookFormSection";
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    isbn: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);

  const {
    books,
    totalPages,
    isError,
    isLoading,
    error,
    addBookMutation,
    updateBookMutation,
    deleteBookMutation,
  } = useBooks(currentPage, searchTerm);
  const queryClient = useQueryClient();
  const booksPerPage = 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedBook?.id) {
      updateBookMutation.mutate({ id: selectedBook.id, book: formData });
    } else {
      addBookMutation.mutate(formData);
    }
    resetForm();
  };

  const handleDelete = (id: number) => {
    setBookToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (bookToDelete) {
      deleteBookMutation.mutate(bookToDelete);
    }
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ title: "", author: "", isbn: "" });
    setIsEditing(false);
    setSelectedBook(null);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (isError) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={() => queryClient.invalidateQueries({ queryKey: ["books"] })}
      />
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Header
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <BookFormSection
              formData={formData}
              isEditing={isEditing}
              isLoading={
                addBookMutation.isPending || updateBookMutation.isPending
              }
              onSubmit={handleSubmit}
              onChange={(field, value) =>
                setFormData({ ...formData, [field]: value })
              }
              onCancel={resetForm}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <BookList
              books={books}
              isLoading={isLoading}
              currentPage={currentPage}
              totalPages={totalPages}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPageChange={setCurrentPage}
              isDeleting={deleteBookMutation.isPending}
            />
          </Grid>
        </Grid>
      </Container>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <Toaster position="top-right" />
    </Box>
  );
}

export default App;
