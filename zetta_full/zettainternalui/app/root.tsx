import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  Navigate,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { LoadingScreen } from "./components/loading-screen";
import { useEffect } from "react";
import { useAuth } from "~/hooks/use-auth";
import { useInterestsNotifications } from "./hooks/use-interests-notifications";
import NotFound from "./components/errors/not-found";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          {children}
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <Toaster richColors position="bottom-center" />
      </body>
    </html>
  );
}

export default function App() {
  const { checkAuth, isInitialized, user } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const { initializeChannel, cleanup } = useInterestsNotifications(); //

  useEffect(() => {
    if (!isInitialized) {
      checkAuth();
    }
  }, [isInitialized]);

  // Initialiser le channel Echo seulement après l'authentification
  useEffect(() => {
    if (user && !isLoginPage) {
      initializeChannel();
    }

    // Cleanup lors de la déconnexion ou du démontage
    return () => {
      cleanup();
    };
  }, [user, isLoginPage, initializeChannel, cleanup]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!user && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  if (user && isLoginPage) {
    return <Navigate to={`${user.role}/dashboard`} replace />;
  }

  return <Outlet />;
}

export function HydrateFallback() {
  return <LoadingScreen />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return <NotFound />;
  // return (
  //   <main className="pt-16 p-4 container mx-auto">
  //     <h1>{message}</h1>
  //     <p>{details}</p>
  //     {stack && (
  //       <pre className="w-full p-4 overflow-x-auto">
  //         <code>{stack}</code>
  //       </pre>
  //     )}
  //   </main>
  // );
}
