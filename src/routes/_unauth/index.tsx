import { createFileRoute, useNavigate } from "@tanstack/react-router";
import LoginForm from "@/components/login-form";
import { auth } from "@/utils/auth";

export const Route = createFileRoute("/_unauth/")({
  loader: async () => {
    // Loader can be implemented if needed
  },
  component: App,
});

function App() {
  const navigate = useNavigate();
  
  const handleLogin = async (email: string, password: string) => {
    try {
    //  await auth.login(email, password);
      
        // Simulate a login request
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Simulate a successful login response 
        console.log("Login successful:", { email, password });
      
        // Update auth status on successful login
        auth.status = 'loggedIn';
        // Navigate to dashboard on successful login
        navigate({ to: '/dashbroad' });

    } catch (error) {
      console.error('Login error:', error);
      // Throw the error with a specific message, which will be caught by the login form's error handler
      throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-6">

        <LoginForm onSubmitCredentials={handleLogin} />
      </div>
    </div>
  );
}
