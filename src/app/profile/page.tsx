import Link from "next/link";
import { AppHeader } from "@/components/header";
import type { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, User as UserIcon, Mail, Phone, Home, Building } from "lucide-react";

async function getUser(): Promise<User | null> {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users', { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error('Failed to fetch user');
    }
    const users = await res.json();
    return users[0] || null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ProfilePage() {
  const user = await getUser();

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        {user ? (
          <Card className="w-full max-w-2xl shadow-lg animate-in fade-in-50 duration-500">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 space-y-4 sm:space-y-0 text-center sm:text-left">
                <div className="p-3 bg-primary/10 rounded-full">
                  <UserIcon className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-headline text-3xl">{user.name}</CardTitle>
                  <CardDescription>@{user.username} | {user.website}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm sm:text-base">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-4 text-muted-foreground flex-shrink-0" />
                <span className="break-all">{user.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-4 text-muted-foreground flex-shrink-0" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-start">
                <Home className="w-5 h-5 mr-4 text-muted-foreground mt-1 flex-shrink-0" />
                <span>{`${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`}</span>
              </div>
               <div className="flex items-start">
                <Building className="w-5 h-5 mr-4 text-muted-foreground mt-1 flex-shrink-0" />
                <span>{user.company.name} - <i className="text-muted-foreground">{user.company.catchPhrase}</i></span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-2xl shadow-lg p-8 text-center">
            <CardTitle>User not found</CardTitle>
            <CardDescription>We couldn't load the user profile. Please try again later.</CardDescription>
          </Card>
        )}
      </main>
    </div>
  );
}
