'use client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useState, useEffect, createContext, useContext } from 'react';

// 主题上下文
const ThemeContext = createContext<{
  mode: 'light' | 'dark';
  toggleMode: () => void;
}>({
  mode: 'dark',
  toggleMode: () => {},
});

// 自定义 Hook
export const useTheme = () => useContext(ThemeContext);

export default function ClientThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  // 从 localStorage 读取主题偏好
  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark' | null;
    if (savedMode) {
      setMode(savedMode);
    } else {
      // 检测系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // 切换主题模式
  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  // 创建主题
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#90caf9' : '#1976d2',
        light: mode === 'dark' ? '#e3f2fd' : '#42a5f5',
        dark: mode === 'dark' ? '#1565c0' : '#1565c0',
        contrastText: mode === 'dark' ? '#000' : '#fff',
      },
      secondary: {
        main: mode === 'dark' ? '#f48fb1' : '#dc004e',
        light: mode === 'dark' ? '#fce4ec' : '#ff5983',
        dark: mode === 'dark' ? '#c2185b' : '#9a0036',
      },
      background: {
        default: mode === 'dark' ? '#0a0a0a' : '#ffffff',
        paper: mode === 'dark' ? '#121212' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#ededed' : '#171717',
        secondary: mode === 'dark' ? '#b0b0b0' : '#666666',
      },
      divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      action: {
        hover: mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
        selected: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      },
    },
    typography: {
      fontFamily:
        'var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.43,
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
              boxShadow:
                mode === 'dark'
                  ? '0px 2px 4px rgba(0, 0, 0, 0.3)'
                  : '0px 2px 4px rgba(0, 0, 0, 0.1)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow:
                mode === 'dark'
                  ? '0px 4px 8px rgba(0, 0, 0, 0.4)'
                  : '0px 4px 8px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'dark' ? '#90caf9' : '#1976d2',
              },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: 'none',
          },
          elevation1: {
            boxShadow:
              mode === 'dark' ? '0px 2px 8px rgba(0, 0, 0, 0.3)' : '0px 2px 8px rgba(0, 0, 0, 0.1)',
          },
          elevation2: {
            boxShadow:
              mode === 'dark'
                ? '0px 4px 12px rgba(0, 0, 0, 0.4)'
                : '0px 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: {
            '& .MuiTableHead-root': {
              '& .MuiTableCell-root': {
                borderBottom: `1px solid ${
                  mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'
                }`,
                fontWeight: 600,
              },
            },
            '& .MuiTableBody-root': {
              '& .MuiTableRow-root:hover': {
                backgroundColor:
                  mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
              },
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${
              mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'
            }`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&:hover': {
              backgroundColor:
                mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            },
          },
        },
      },
    },
  });

  // 防止 hydration 不匹配 - 在客户端挂载前显示默认主题
  if (!mounted) {
    return (
      <div suppressHydrationWarning>
        <ThemeContext.Provider value={{ mode: 'dark', toggleMode }}>
          <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </ThemeContext.Provider>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
