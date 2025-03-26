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
    onSubmit: async ({ value }) => {
      try {
        loginSchema.parse(value);
        console.log("Mengirim data login:", value);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await onSubmitCredentials(value.email, value.password);
      } catch (error) {
        console.error("Error saat submit:", error);
        if (error instanceof z.ZodError) {
          return {
            status: "error" as const,
            message: "Data login tidak valid",
          };
        }
        return {
          status: "error" as const,
          message: "Gagal terhubung ke server",
        };
      }
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
                          field.state.meta.errors.length
                          ? "border-red-500"
                          : ""
                      )}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.isTouched &&
                    field.state.meta.errors.length ? (
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
                          field.state.meta.errors.length
                          ? "border-red-500"
                          : ""
                      )}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />

                    {field.state.meta.isTouched &&
                    field.state.meta.errors.length ? (
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
                    {state.errors.length ? (
                      <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200">
                        {state.errors}
                      </div>
                    ) : null}

                    {state.isSubmitSuccessful && (
                      <div className="p-3 bg-green-50 text-green-700 rounded border border-green-200">
                        Login berhasil!
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
