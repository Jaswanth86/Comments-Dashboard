import { AppHeader } from "@/components/header";
import type { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

async function getUser(): Promise<User | null> {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users/1', { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error('Failed to fetch user');
    }
    const user = await res.json();
    return user || null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function InfoRow({ label, value, href, isLast = false }: { label: string; value: string; href?: string, isLast?: boolean }) {
  const valueElement = href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline text-right break-all">
      {value}
    </a>
  ) : (
    <p className="text-sm text-foreground text-right break-words">{value}</p>
  );

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center py-4">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {valueElement}
      </div>
      {!isLast && <Separator className="bg-border/50" />}
    </div>
  );
}

export default async function ProfilePage() {
  const user = await getUser();
  
  const contactInfo = user ? [
    { label: "Email", value: user.email, href: `mailto:${user.email}` },
    { label: "Phone", value: user.phone },
    { label: "Address", value: `${user.address.street}, ${user.address.suite}, ${user.address.city} ${user.address.zipcode}` },
    { label: "Website", value: user.website, href: `http://${user.website}` },
  ] : [];

  const professionalInfo = user ? [
    { label: "Company", value: user.company.name },
    { label: "Company Motto", value: user.company.catchPhrase },
  ] : [];

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        {user ? (
          <div className="w-full max-w-2xl animate-in fade-in-50 duration-500 space-y-8">
            <div className="flex flex-col items-center text-center space-y-4 pt-8">
              <Avatar className="h-28 w-28 ring-2 ring-primary ring-offset-4 ring-offset-background shadow-lg shadow-primary/40">
                <AvatarImage src={`https://placehold.co/128x128.png`} alt={user.name} data-ai-hint="person avatar" />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold font-headline">{user.name}</h1>
                <p className="text-lg text-muted-foreground">@{user.username}</p>
              </div>
            </div>

            <Card className="w-full bg-card/80 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {contactInfo.map((item, index) => (
                  <InfoRow key={item.label} {...item} isLast={index === contactInfo.length - 1} />
                ))}
              </CardContent>
            </Card>

            <Card className="w-full bg-card/80 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                 {professionalInfo.map((item, index) => (
                  <InfoRow key={item.label} {...item} isLast={index === professionalInfo.length - 1} />
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="w-full max-w-2xl shadow-lg p-8 text-center bg-card/80 border-border/50">
            <CardTitle>User not found</CardTitle>
            <p className="text-muted-foreground">We couldn't load the user profile. Please try again later.</p>
          </Card>
        )}
      </main>
    </div>
  );
}
