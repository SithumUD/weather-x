import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import WeatherDashboard from './components/WeatherDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30, // 30 minutes
      retry: 3,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-900 dark:to-gray-800">
          <WeatherDashboard />
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
