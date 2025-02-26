import { AlertCircle, Loader2 } from "lucide-react";
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

interface ErrorDisplayProps {
  error: unknown;
  onRetry: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const errorMessage =
    error instanceof Error ? error.message : "Unknown error occurred";
  const isConnectionError =
    errorMessage.includes("Network Error") ||
    errorMessage.includes("ECONNREFUSED");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Box display="flex" justifyContent="center" mb={2}>
          <AlertCircle color="#ef4444" size={48} />
        </Box>
        <Typography variant="h5" color="error" textAlign="center" gutterBottom>
          Error Loading Books
        </Typography>
        <Box sx={{ mb: 3 }}>
          {isConnectionError ? (
            <>
              <Typography textAlign="center" color="text.secondary">
                Cannot connect to the server at{" "}
                <Box
                  component="code"
                  sx={{ bgcolor: "grey.100", px: 1, py: 0.5, borderRadius: 1 }}
                >
                  http://localhost:3001
                </Box>
              </Typography>
              <Typography mt={2} mb={1}>
                Please ensure:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="The backend server is running on port 3001" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="The API endpoint is accessible" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="There are no CORS issues" />
                </ListItem>
              </List>
            </>
          ) : (
            <Typography color="text.secondary" textAlign="center">
              {errorMessage}
            </Typography>
          )}
        </Box>
        <Button
          fullWidth
          variant="contained"
          onClick={onRetry}
          startIcon={<Loader2 className="animate-spin" />}
        >
          Retry Connection
        </Button>
      </Paper>
    </Box>
  );
}
