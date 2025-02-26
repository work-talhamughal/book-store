import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5",
      light: "#818cf8",
      dark: "#3730a3",
    },
    secondary: {
      main: "#9333ea",
      light: "#a855f7",
      dark: "#7e22ce",
    },
    background: {
      default: "#f3f4f6",
      paper: "#ffffff",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});
