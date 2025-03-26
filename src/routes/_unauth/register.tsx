import AuthForm from '@/components/auth-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();

  const handleSubmit = async (
    email: string,
    password: string,
    passwordConfirmation: string,
    token: string
  ) => {
    try {
      // Simulate a registration request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Validate if passwords match
      if (password !== passwordConfirmation) {
        throw new Error("Passwords don't match");
      }
      
      // Simulate a successful registration
      console.log("Registration successful:", { email, token });
      
      // Navigate to login page on successful registration
      navigate({ to: '/' });
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    }
  };

  const getToken = async (email: string) => {
    try {
      // Simulate a token request for email verification
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulate a successful token generation
      console.log("Verification token sent to email:", email);
      
      // No navigation here as we stay on the same page
    } catch (error) {
      console.error('Token request error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to send verification token.');
    }
  };

  return(
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm space-y-6">
          <AuthForm 
          handleSubmit={handleSubmit}
          getToken={getToken}
          title="Register Account"
          description="Create a new account. Enter your email to receive a verification token."
        />
          </div>
        </div>
  )
}
