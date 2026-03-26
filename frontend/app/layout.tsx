import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/AuthContext"
import { AutoLogoutHandler } from "@/components/auth/AutoLogoutHandler"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VitalFlow | Precision Clinical Nutrition",
  description: "Next-generation hospital food management with data-driven clinical nutrition and seamless operational orchestration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AutoLogoutHandler />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
