import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Link } from "@tanstack/react-router";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(20, "Password maksimal 20 karakter"),
});

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onSubmitCredentials: (email: string, password: string) => Promise<void>;
}

export function LoginForm({
  onSubmitCredentials,
  className,
  ...props
}: LoginFormProps) {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmitAsync: async (values) => {
        try {
          await onSubmitCredentials(values.value.email, values.value.password);
        } catch (error) {
          if (error instanceof Error) {
            return error.message;
          }
          return "Terjadi kesalahan saat login";
        }
      },
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="flex flex-col gap-6">
              <form.Field
                name="email"
                validators={{
                  onBlur: ({ value }) => {
                    try {
                      loginSchema.shape.email.parse(value);
                      return undefined;
                    } catch (error) {
                      if (error instanceof z.ZodError) {
                        return error.errors.map((e) => e.message).join(", ");
                      }
                      return "Email tidak valid";
                    }
                  },
                }}
              >
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Email</Label>
                    <Input
                      id={field.name}
                      type="email"
                      placeholder="m@example.com"
                      className={cn(
                        field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0
                          ? "border-red-500"
                          : ""
                      )}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 ? (
                      <p className="text-sm text-red-600">
                        {field.state.meta.errors}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="password"
                validators={{
                  onBlur: ({ value }) => {
                    try {
                      loginSchema.shape.password.parse(value);
                      return undefined;
                    } catch (error) {
                      if (error instanceof z.ZodError) {
                        return error.errors.map((e) => e.message).join(", ");
                      }
                      return "Password tidak valid";
                    }
                  },
                }}
              >
                {(field) => (
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor={field.name}>Password</Label>
                      <Link
                        to="/forgotPassword"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id={field.name}
                      type="password"
                      className={cn(
                        field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0
                          ? "border-red-500"
                          : ""
                      )}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />

                    {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 ? (
                      <p className="text-sm text-red-600">
                        {field.state.meta.errors}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.Field>

              <form.Subscribe>
                {(state) => (
                  <>
                    {state.errors && state.errors.length > 0 ? (
                      <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200">
                        {state.errors}
                      </div>
                    ) : (
                      <h1 className="text-sm text-gray-500">Login to your account</h1>
                    )}

                    {state.isSubmitSuccessful && (
                      <div className="p-3 bg-green-50 text-green-700 rounded border border-green-200">
                        Logged in successfully
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={state.isSubmitting}
                    >
                      {state.isSubmitting ? "Sedang Login..." : "Login"}
                    </Button>
                  </>
                )}
              </form.Subscribe>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;