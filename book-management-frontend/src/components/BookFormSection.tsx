import { Box, Paper, Typography } from "@mui/material";
import { Plus } from "lucide-react";
import { BookForm } from "./BookForm";
import { BookFormData } from "../types";

interface BookFormSectionProps {
  formData: BookFormData;
  isEditing: boolean;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof BookFormData, value: string) => void;
  onCancel: () => void;
}

export function BookFormSection({
  formData,
  isEditing,
  isLoading,
  onSubmit,
  onChange,
  onCancel,
}: BookFormSectionProps) {
  return (
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Box
          sx={{
            bgcolor: "primary.light",
            p: 1,
            borderRadius: 1,
            display: "flex",
          }}
        >
          <Plus color="#4f46e5" size={20} />
        </Box>
        <Typography variant="h6">
          {isEditing ? "Edit Book" : "Add New Book"}
        </Typography>
      </Box>

      <BookForm
        formData={formData}
        isEditing={isEditing}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onChange={onChange}
        onCancel={onCancel}
      />
    </Paper>
  );
}
