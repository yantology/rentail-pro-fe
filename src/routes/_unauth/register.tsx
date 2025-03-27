import AuthForm from '@/components/auth-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { getToken as requestToken, register as registerUser } from '@/api/auth';

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
      // Call the actual registration API
      await registerUser(email, "", password, passwordConfirmation, token);
      
      // Navigate to login page on successful registration
      navigate({ to: '/' });
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    }
  };

  const getToken = async (email: string) => {
    try {
      // Call the actual token request API
      await requestToken('registration', email);
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
          submitButtonText="Register"
          title="Register Account"
          description="Create a new account. Enter your email to receive a verification token."
        />
          </div>
        </div>
  )
}
