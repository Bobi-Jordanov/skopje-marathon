// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#650F6D",   // deep purple
    },
    secondary: {
      main: "#CD2B86",   // magenta/pink
    },
  },

  typography: {
    fontFamily: '"Microsoft Sans Serif", Arial, sans-serif',
  }
  
});

export default theme;