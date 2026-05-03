"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserRole, ROLE_HIERARCHY, type UserRole } from "@/lib/admin/rbac";

interface AdminGuardProps {
  children: ReactNode;
  requiredRole: UserRole;
}

/**
 * Client-side role guard for admin pages.
 * Checks the user's role against the required minimum role.
 * Redirects to /admin/dashboard if insufficient permissions.
 */
export function AdminGuard({ children, requiredRole }: AdminGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkRole() {
      const userInfo = await getCurrentUserRole();

      if (!userInfo) {
        router.replace("/admin/signin");
        return;
      }

      if (ROLE_HIERARCHY[userInfo.role] >= ROLE_HIERARCHY[requiredRole]) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    }

    checkRole();
  }, [requiredRole, router]);

  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Checking permissions...</span>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
        <div className="bg-white rounded-xl border border-red-200 p-8 max-w-md text-center shadow-sm">
          <span className="material-symbols-outlined text-5xl text-red-400 mb-4 block">
            shield
          </span>
          <h2 className="text-xl font-semibold text-on-surface mb-2">Access Denied</h2>
          <p className="text-sm text-on-surface-variant mb-4">
            You need <strong>{requiredRole}</strong> role or higher to access this page.
          </p>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="bg-primary text-on-primary px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-container transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
