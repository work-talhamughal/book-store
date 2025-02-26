import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search, Library } from "lucide-react";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function Header({ searchTerm, onSearchChange }: HeaderProps) {
  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      alignItems={{ md: "center" }}
      justifyContent="space-between"
      gap={2}
      mb={4}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Paper
          elevation={2}
          sx={{
            p: 1.5,
            borderRadius: 2,
            animation: "float 3s ease-in-out infinite",
          }}
        >
          <Library color="#4f46e5" size={32} />
        </Paper>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(to right, #4f46e5, #9333ea)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Book Management System
        </Typography>
      </Box>
      <TextField
        size="small"
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={20} />
            </InputAdornment>
          ),
        }}
        sx={{ width: { xs: "100%", md: 250 } }}
      />
    </Box>
  );
}
