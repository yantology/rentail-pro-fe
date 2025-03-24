import { createFileRoute } from "@tanstack/react-router";
import LoginForm from "@/components/login-form";

export const Route = createFileRoute("/_unauth/")({
  loader: async () => {
    // Loader can be implemented if needed
  },
  component: App,
});

function App() {
  return (
    <div className="flex  min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-6">
        <LoginForm />
      </div>
    </div>
  );
}
