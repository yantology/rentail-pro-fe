import AuthForm from '@/components/auth-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { forgetPassword, getToken as requestToken } from '@/api/auth';

export const Route = createFileRoute('/_unauth/forgotPassword')({
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
      // TODO: Implement the actual password reset API call here when available
      console.log('Attempting password reset for:', { email, password, passwordConfirmation, token });
      await forgetPassword(email, password, passwordConfirmation, token);
      // Navigate to login page on successful password reset
      navigate({ to: '/' });
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    }
  };

  const getToken = async (email: string) => {
    try {
      // Call the actual token request API for password reset
      await requestToken('forget-password', email);
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
          title="Reset Password"
          description="Enter your email to receive a verification token and reset your password."
          submitButtonText="Reset Password"
        />
      </div>
    </div>
  )
}
