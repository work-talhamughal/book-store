import { Book } from "../types";
import {
  Edit2,
  Trash2,
  Loader2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Stack,
  CircularProgress,
  Pagination,
} from "@mui/material";

interface BookListProps {
  books: Book[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
  isDeleting: boolean;
}

export function BookList({
  books,
  isLoading,
  currentPage,
  totalPages,
  onEdit,
  onDelete,
  onPageChange,
  isDeleting,
}: BookListProps) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Book List
      </Typography>
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2}>
          {books.map((book) => (
            <Paper
              key={book.id}
              variant="outlined"
              sx={{
                p: 2,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {book.author}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ISBN: {book.isbn}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(book)}
                    color="primary"
                  >
                    <Edit2 size={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => book.id && onDelete(book.id)}
                    disabled={isDeleting}
                    color="error"
                  >
                    {isDeleting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </IconButton>
                </Stack>
              </Box>
            </Paper>
          ))}
          {books.length === 0 && (
            <Box textAlign="center" py={4}>
              <BookOpen size={48} style={{ margin: "0 auto", opacity: 0.5 }} />
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                No books found
              </Typography>
            </Box>
          )}
        </Stack>
      )}

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
          />
        </Box>
      )}
    </Paper>
  );
}
