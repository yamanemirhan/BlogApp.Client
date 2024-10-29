import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

// Form validation schema using Zod
const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email." })
    .max(100, { message: "Email can be a maximum 50 characters." }),
  password: z
    .string()
    .min(7, { message: "Password must be at least 7 characters." }),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema), // Zod form validation
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // React Query mutation for log in request
  const {
    mutate: loginMutation,
    isError,
    isPending,
  } = useMutation({
    mutationFn: async (data) => {
      try {
        const res = await axiosInstance.post("/auth/login", data);
        return res.data;
      } catch (error) {
        throw error.response
          ? error.response.data
          : new Error("Something went wrong!");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["getProfile"]);
      toast({
        title: "Login Successful",
        description: "Logged in successfully!",
        status: "success",
        variant: "success",
      });
      navigate("/");
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Something went wrong!",
        status: "error",
        variant: "error",
      });
    },
  });

  // Submit handler for form
  const onSubmit = (values) => {
    loginMutation({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <div className="text-white space-y-6">
      <h1 className="text-3xl text-center">Log In</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 text-black"
        >
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-gray-300 flex justify-end">
                  {/* todo: dialog */}
                  <Link to={"/forgot-password"}>Forgot password?</Link>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "Logging in..." : "Log In"}
          </Button>

          {/* Show error/success messages */}
          {isError && (
            <p className="text-red-500">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
