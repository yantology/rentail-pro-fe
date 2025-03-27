import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import LoginForm from "@/components/login-form";


export const Route = createFileRoute("/_unauth/")({
  component: App,
  loader: ({ context: { auth } }) => {
    if (auth.status === 'loggedIn') {
      throw redirect({ to: '/homepage' });
    }
    return { auth };
  },
});

function App() {
  const navigate = useNavigate();
  const data = Route.useLoaderData();
  const { auth } = data;
  
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await auth.login(email, password);
      
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }
      
      // Update auth status on successful login
      auth.status = 'loggedIn';
      // Navigate to dashboard on successful login
      navigate({ to: '/homepage' });

    } catch (error) {
      console.error('Login error:', error);
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
