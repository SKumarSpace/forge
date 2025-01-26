import React from 'react';
import ReactDOM from 'react-dom/client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { defaultTheme, Provider } from '@adobe/react-spectrum';

import App from './App';
import theme from './theme';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider theme={defaultTheme} colorScheme="light">
          <App />
        </Provider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
