export interface Comment {
  id: string;
  post_id: string;
  content: string;
  author_name: string;
  created_at: string;
}

export interface Post {
  id: string;
  title: string | null;
  content: string;
  category: string;
  author_name: string;
  created_at: string;
  comments: Comment[];
}
