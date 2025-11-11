// This is a workaround for hydration errors with wallet components
// It suppresses the React hydration warning in development mode

export function suppressHydrationWarning() {
  if (typeof window !== 'undefined') {
    // Only run on client side
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      if (args[0]?.includes('Warning: Text content did not match') || 
          args[0]?.includes('Warning: Expected server HTML to contain') ||
          args[0]?.includes('Hydration failed because')) {
        // Suppress hydration warnings
        return;
      }
      originalConsoleError(...args);
    };
  }
}
