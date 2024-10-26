import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router-dom";
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

// Form validation schema using Zod
const formSchema = z
  .object({
    username: z
      .string()
      .min(3, {
        message: "Username must be at least 3 characters.",
      })
      .max(50, { message: "Username can be a maximum 50 characters." }),
    email: z
      .string()
      .email({ message: "Please enter a valid email." })
      .max(100, { message: "Email can be a maximum 50 characters." }),
    password: z
      .string()
      .min(7, { message: "Password must be at least 7 characters." }),
    confirmPassword: z
      .string()
      .min(7, { message: "Confirm password must match password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Field to target the error
  });

const SignUpForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema), // Zod form validation
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // React Query mutation for sign-up request
  const {
    mutate: signUpMutation,
    isError,
    isPending,
  } = useMutation({
    mutationFn: async (data) => {
      try {
        const res = await axiosInstance.post("/auth/signup", data);
        return res.data;
      } catch (error) {
        throw error.response
          ? error.response.data
          : new Error("Something went wrong!");
      }
    },
    onSuccess: () => {
      toast({
        title: "Account Created",
        description: "Your account was created successfully!",
        status: "success",
        variant: "success",
      });
      navigate("/login");
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
    signUpMutation({
      username: values.username,
      email: values.email,
      password: values.password,
    });
  };

  return (
    <div className="text-white space-y-6">
      <h1 className="text-3xl text-center">Sign Up</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 text-black"
        >
          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormDescription className="text-gray-300">
                  *This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "Signing Up..." : "Sign Up"}
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

export default SignUpForm;
