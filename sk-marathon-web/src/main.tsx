import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, CssBaseline } from "@mui/material";import App from './App.tsx'
import theme from './theme/theme.ts'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <StrictMode>
      <CssBaseline />
      <App />
    </StrictMode>
  </ThemeProvider>
)
