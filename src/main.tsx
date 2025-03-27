import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import the generated route tree
import { routeTree } from './routeTree.gen.ts'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'
import { auth } from './utils/auth.tsx';
import { initializeTheme, setupSystemThemeListener } from './utils/theme.tsx';

export const queryClient = new QueryClient()



// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPendingComponent: () => <div>Loading...</div>,
  defaultErrorComponent: ({ error }) => (
    <div>
      <h1>Uh oh!</h1>
      <p>{error.message}</p>
    </div>
  ),
  context: {
    auth: undefined!, // We'll inject this when we render
    queryClient,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
	// Initialize the theme
  initializeTheme();

	setupSystemThemeListener()

  return (
    <RouterProvider 
      router={router}
      defaultPreload="intent"
      context={{
        auth,
      }}
    />
  );
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
