"use client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

export default function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = createTheme({
    palette: { mode: "dark" },
    typography: { fontFamily: "var(--font-geist-sans), system-ui, -apple-system" },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}


