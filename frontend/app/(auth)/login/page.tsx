import { Metadata } from "next"
import Link from "next/link"
import LoginForm from "@/components/forms/LoginForm"

export const metadata: Metadata = {
  title: "Login | NutriCare",
  description: "Login to your NutriCare account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <div className="w-full max-w-md space-y-8 px-4 bg-white rounded-xl shadow-lg py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <Link href="/" className="flex justify-center mb-6">
            <span className="text-2xl font-bold text-primary">NutriCare</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome to NutriCare
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
        <LoginForm />
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
} 