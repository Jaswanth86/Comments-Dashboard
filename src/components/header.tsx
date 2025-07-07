"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, LayoutGrid } from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold font-headline text-primary hover:opacity-80 transition-opacity">
          DataGrid Navigator
        </Link>
        {pathname === "/" ? (
          <Button asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" /> Profile
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/">
              <LayoutGrid className="mr-2 h-4 w-4" /> Dashboard
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
