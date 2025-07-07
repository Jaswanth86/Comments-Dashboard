import { AppHeader } from "@/components/header";
import { CommentsDashboard } from "@/components/comments-dashboard";
import type { Comment } from "@/types";

async function getComments(): Promise<Comment[]> {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/comments', { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error('Failed to fetch comments');
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const comments = await getComments();

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <CommentsDashboard comments={comments} />
      </main>
    </div>
  );
}
