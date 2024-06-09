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
import { useSignInMutation } from "@/queries/auth.queries";
import Link from "next/link";

const formSchema = z.object({
  email: z
    .string({ required_error: "This field is required" })
    .email({ message: "Invalid e-mail" }),
  password: z
    .string({ required_error: "This field is required" })
    .min(6, "Password must be at least 6 characters long"),
});

export default function Login() {
  const router = useRouter();

  const signInMutation = useSignInMutation({
    onSuccess: (res) => {
      if (res.status) {
        router.push("/");
      } else {
        alert(res.message);
      }
    },
    onError: (e) => {
      alert(e.message);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: undefined,
      password: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    signInMutation.mutate(values);
  }

  return (
    <div className="w-full max-w-xl overflow-hidden rounded-lg bg-background2 shadow-md">
      <div className="px-8 pb-8 pt-24">
        <h1 className="mb-16 text-center">Login</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>
        <div className="mt-16">
          <p className="mb-2 text-center font-medium">
            Don&apos;t have an account?
          </p>
          <Link href="/register">
            <Button type="button" className="w-full">
              Register
            </Button>
          </Link>
          <Link href="/">
            <p className="mb-2 mt-8 text-center text-white/70">
              Continue as guest
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
