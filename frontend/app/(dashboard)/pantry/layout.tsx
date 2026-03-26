import DashboardLayout from "@/components/common/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function PantryDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['pantry_staff']}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  )
}
