"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignUpMutation } from "@/queries/auth.queries";

const formSchema = z
  .object({
    username: z.string({ required_error: "This field is required" }).min(4, {
      message: "Username name must be at least 4 characters long.",
    }),
    email: z
      .string({ required_error: "This field is required" })
      .email({ message: "Invalid e-mail" }),
    password: z
      .string({ required_error: "This field is required" })
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string({ required_error: "This field is required" })
      .min(6, "Password must be at least 6 characters long"),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export default function Register() {
  const router = useRouter();

  const signUpMutation = useSignUpMutation({
    onSuccess: (res) => {
      router.push("");
    },
    onError: (e) => {
      alert(e.message);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: undefined,
      email: undefined,
      password: undefined,
      confirmPassword: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    signUpMutation.mutate({
      username: values.username,
      email: values.email,
      password: values.password,
    });
  }

  return (
    <div className="w-full max-w-xl overflow-hidden rounded-lg bg-background2 shadow-md">
      <div className="px-8 pb-8 pt-24">
        <h1 className="mb-16 text-center">Register</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="E-mail" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </Form>
        <div className="mt-16">
          <p className="mb-2 text-center font-medium">
            Already have an account?
          </p>
          <Link href="/login">
            <Button type="button" className="w-full">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
