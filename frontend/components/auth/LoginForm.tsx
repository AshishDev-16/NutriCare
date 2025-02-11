"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from '@/context/AuthContext'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export function LoginForm() {
  const { toast } = useToast()
  const router = useRouter()
  const { login } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log('Login attempt with email:', values.email);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Determine role based on email
      const role = values.email === 'hospital_manager@xyz.com' 
        ? 'manager' 
        : values.email === 'hospital_pantry@xyz.com' 
          ? 'pantry_staff' 
          : null;

      console.log('Determined role:', role);

      if (!role) {
        throw new Error('Invalid email address. Please use the correct email for your role.');
      }

      // Store role first to ensure it's available
      localStorage.setItem('userRole', role);
      console.log('Role stored in localStorage:', localStorage.getItem('userRole'));

      // Call login with both token and role
      console.log('Calling login with:', { token: data.token, role });
      login(data.token, role);

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      // Redirect based on role
      const redirectPath = role === 'manager' ? '/dashboard' : '/pantry';
      console.log('Redirecting to:', redirectPath);
      router.push(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
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
                <Input type="password" placeholder="Enter your password" {...field} />
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
  )
} 