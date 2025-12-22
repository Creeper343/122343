// src/components/layout/Header.tsx
import Link from "next/link";
import { Calculator, User } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import UserNav from "./UserNav";

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Fahrschulfinder
            </span>
          </Link>

          {/* Login / User Status */}
          <div>
            {user ? (
              <UserNav />
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  href="/registration"
                  className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Partner werden
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}