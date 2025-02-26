import { BookFormData } from "../types";
import { BookOpen, User, Barcode, Loader2 } from "lucide-react";
import { Box, Button, Stack } from "@mui/material";
import { Input } from "./Input";

interface BookFormProps {
  formData: BookFormData;
  isEditing: boolean;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof BookFormData, value: string) => void;
  onCancel: () => void;
}

export function BookForm({
  formData,
  isEditing,
  isLoading,
  onSubmit,
  onChange,
  onCancel,
}: BookFormProps) {
  return (
    <Box component="form" onSubmit={onSubmit}>
      <Input
        label="Title"
        icon={BookOpen}
        value={formData.title}
        onChange={(value) => onChange("title", value)}
      />
      <Input
        label="Author"
        icon={User}
        value={formData.author}
        onChange={(value) => onChange("author", value)}
      />
      <Input
        label="ISBN"
        icon={Barcode}
        value={formData.isbn}
        onChange={(value) => onChange("isbn", value)}
      />
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
          startIcon={isLoading && <Loader2 className="animate-spin" />}
        >
          {isEditing ? "Update Book" : "Add Book"}
        </Button>
        {isEditing && (
          <Button type="button" variant="outlined" onClick={onCancel} fullWidth>
            Cancel
          </Button>
        )}
      </Stack>
    </Box>
  );
}
