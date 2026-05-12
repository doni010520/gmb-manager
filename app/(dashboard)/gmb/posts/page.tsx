import { getGmbPosts } from "../actions";
import { PostsClient } from "./posts-client";

export default async function PostsPage() {
  const posts = await getGmbPosts();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Posts</h1>
        <p className="text-muted-foreground">Gerencie os posts do seu Google Meu Negocio</p>
      </div>
      <PostsClient initialPosts={posts} />
    </div>
  );
}
