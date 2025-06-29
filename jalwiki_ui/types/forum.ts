export interface User {
  id: string
  name: string
  avatar: string
}

export interface Thread {
  id: string
  title: string
  content: string
  author: User
  createdAt: string
  upvotes: number
  commentCount: number
  tags: string[]
  type: "discussion" | "resource" | "announcement"
}

export interface Comment {
  id: string
  threadId: string
  author: User
  content: string
  createdAt: string
  upvotes: number
  replies?: Comment[]
}

export interface UserStory {
  id: string
  title: string
  content: string
  author: User
  createdAt: string
}

export type ThreadType = 'discussion' | 'resource' | 'announcement';

export interface ApiAuthor {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_pic_url: string | null;
}

export interface ApiForumTag {
  id: number;
  name: string;
  slug: string;
}

export interface ApiThread {
  id: number;
  title: string;
  slug: string;
  content: string;
  author: ApiAuthor;
  tags: ApiForumTag[];
  type: ThreadType; // <--- ADDED THIS
  created_at: string;
  updated_at: string;
  last_activity_at: string;
  upvote_count: number;
  upvoted_by: number[];
  comment_count: number;
  is_liked_by_user?: boolean; // Optional, depends on your serializer context
}

export interface ApiComment {
  id: number;
  thread: number;
  content: string;
  author: ApiAuthor;
  parent_comment: number | null;
  created_at: string;
  updated_at: string;
  upvote_count: number;
  upvoted_by: number[];
  replies: ApiComment[];
  is_liked_by_user?: boolean; // Optional
}

export interface NewThreadData {
  title: string;
  content: string;
  type: ThreadType; // <--- ADDED THIS
  tag_ids?: number[];
}

export interface NewCommentData {
  thread: number;
  content: string;
  parent_comment_id?: number | null;
}

export interface UpdateCommentData {
  content: string;
}