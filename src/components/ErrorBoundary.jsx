import React, { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500">
          <div className="text-center p-8 max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-extrabold text-red-600 mb-6">
              Oops! Something went wrong.
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              {this.state.error?.message}
            </p>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
