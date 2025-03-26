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
import { useTokenSubmit } from "@/hooks/tokenHook";
import { Link } from "@tanstack/react-router";

const registerResetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(20, "Password maksimal 20 karakter"),
  passwordConfirmation: z.string().min(8, "Konfirmasi password wajib diisi"),
  token: z.string().min(1, "Token wajib diisi"),
});
interface AuthFormProps extends React.ComponentPropsWithoutRef<"div"> {
  handleSubmit: (
    email: string,
    password: string,
    passwordConfirmation: string,
    token: string
  ) => Promise<void>;
  title: string;
  description: string;
  getToken: (email: string) => Promise<void>;
}

export function AuthForm({
  handleSubmit,
  title,
  description,
  getToken,
  className,
  ...props
}: AuthFormProps) {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
      token: "",
    },
    onSubmit: async ({ value }) => {
      try {
        registerResetPasswordSchema.parse(value);
        console.log("Mengirim data reset password:", value);
        await handleSubmit(
          value.email,
          value.password,
          value.passwordConfirmation,
          value.token
        );
      } catch (error) {
        console.error("Error saat submit:", error);
        if (error instanceof z.ZodError) {
          return {
            status: "error" as const,
            message: "Data tidak valid",
          };
        }
        return {
          status: "error" as const,
          message: "Gagal terhubung ke server",
        };
      }
    },
  });

  const verifyTokenAPI = async (email: string) => {
    try {
      // Validate email first
      const emailSchema = z.string().email("Format email tidak valid");
      emailSchema.parse(email);

      await getToken(email);
      console.log("Token berhasil dikirim ke email");
    } catch (error) {
      console.error("Error saat mengirim token:", error);
      if (error instanceof z.ZodError) {
        throw new Error("Format email tidak valid");
      }
      throw new Error("Gagal mengirim token ke email");
    }
  };

  const { isDisabled, status, submitToken } = useTokenSubmit(verifyTokenAPI);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
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
                      registerResetPasswordSchema.shape.email.parse(value);
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
                      registerResetPasswordSchema.shape.password.parse(value);
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
                    <Label htmlFor={field.name}>Password</Label>
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

              <form.Field
                name="passwordConfirmation"
                validators={{
                  onBlurListenTo: ["password"],
                  onBlur: ({ value,fieldApi }) => {
                    try {
                      registerResetPasswordSchema.shape.passwordConfirmation.parse(
                        value
                      );

                      if (value !== fieldApi.form.getFieldValue('password')) {
                        return 'Passwords do not match'
                      }
                      return undefined;
                    } catch (error) {
                      if (error instanceof z.ZodError) {
                        return error.errors.map((e) => e.message).join(", ");
                      }
                      return "Konfirmasi password tidak valid";
                    }
                  },
                }}
              >
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Password Confirmation</Label>
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

              <form.Field
                name="token"
                validators={{
                  onBlur: ({ value }) => {
                    try {
                      registerResetPasswordSchema.shape.token.parse(value);
                      return undefined;
                    } catch (error) {
                      if (error instanceof z.ZodError) {
                        return error.errors.map((e) => e.message).join(", ");
                      }
                      return "Token tidak valid";
                    }
                  },
                }}
              >
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Verification Token</Label>
                    <div className="flex gap-2">
                      <Input
                        id={field.name}
                        placeholder="Enter verification token"
                        className={cn(
                          field.state.meta.isTouched &&
                            field.state.meta.errors.length
                            ? "border-red-500"
                            : ""
                        )}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        disabled={isDisabled}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          // Get the current email value from the form
                          const email = form.getFieldValue("email");
                          submitToken(email);
                        }}
                      >
                        Get Token
                      </Button>
                    </div>
                    {status != "" &&
                      !field.state.meta.isTouched &&
                      !field.state.meta.errors.length && (
                        <p className={cn("text-sm")}>{status}</p>
                      )}
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
                        Password berhasil direset!
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={state.isSubmitting}
                    >
                      {state.isSubmitting ? "Memproses..." : "Reset Password"}
                    </Button>
                  </>
                )}
              </form.Subscribe>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Have an account?{" "}
            <Link to="/" className="underline underline-offset-4">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default AuthForm;
