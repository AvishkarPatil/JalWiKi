import { api } from '@/lib/api'; // Your existing Axios instance
import type { ApiForumTag } from '@/types/forum';

import type {
  ApiThread,
  ApiComment,
  NewThreadData,
  NewCommentData,
    UpdateCommentData
} from '@/types/forum'; // Adjust path as needed

function handleAxiosError(error: any, defaultMessage: string): Error {
  const errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
  return new Error(`${defaultMessage}: ${errorMessage}`);
}

export async function fetchForumThreads(): Promise<ApiThread[]> {
  try {
    const response = await api.get<ApiThread[]>('/forum-threads/');
    return response.data;
  } catch (error: any) {
    console.error("Error fetching forum threads:", error.response?.data || error.message);
    throw handleAxiosError(error, 'Failed to fetch forum threads');
  }
}

export async function fetchForumThreadBySlug(slug: string): Promise<ApiThread> {
  try {
    const response = await api.get<ApiThread>(`/forum-threads/${slug}/`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching forum thread by slug ${slug}:`, error.response?.data || error.message);
    throw handleAxiosError(error, 'Failed to fetch forum thread');
  }
}

export async function fetchCommentsForThread(threadSlug: string): Promise<ApiComment[]> {
  try {
    // Uses the custom action 'thread-comments' on ForumThreadViewSet
    const response = await api.get<ApiComment[]>(`/forum-threads/${threadSlug}/thread-comments/`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching comments for thread ${threadSlug}:`, error.response?.data || error.message);
    throw handleAxiosError(error, 'Failed to fetch comments');
  }
}

export async function createForumThread(data: NewThreadData): Promise<ApiThread> {
  try {
    const response = await api.post<ApiThread>('/forum-threads/', data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating forum thread:", error.response?.data || error.message);
    throw handleAxiosError(error, 'Failed to create forum thread');
  }
}

export async function postComment(data: NewCommentData): Promise<ApiComment> {
  try {
    // Your ForumCommentViewSet expects POST requests to /forum-comments/
    // The serializer expects 'thread' (ID), 'content', and optionally 'parent_comment_id'
    const payload = {
        thread: data.thread,
        content: data.content,
        ...(data.parent_comment_id && { parent_comment: data.parent_comment_id }) // serializer expects 'parent_comment' for ID
    };
    const response = await api.post<ApiComment>('/forum-comments/', payload);
    return response.data;
  } catch (error: any) {
    console.error("Error posting comment:", error.response?.data || error.message);
    throw handleAxiosError(error, 'Failed to post comment');
  }
}

export async function upvoteThread(threadSlug: string): Promise<{ status: string; upvoted: boolean; count: number }> {
  try {
    const response = await api.post<{ status: string; upvoted: boolean; count: number }>(`/forum-threads/${threadSlug}/upvote/`);
    return response.data;
  } catch (error: any) {
    console.error(`Error upvoting thread ${threadSlug}:`, error.response?.data || error.message);
    throw handleAxiosError(error, 'Failed to upvote thread');
  }
}

export async function upvoteComment(commentId: number): Promise<{ status: string; upvoted: boolean; count: number }> {
  try {
    const response = await api.post<{ status: string; upvoted: boolean; count: number }>(`/forum-comments/${commentId}/upvote/`);
    return response.data;
  } catch (error: any) {
    console.error(`Error upvoting comment ${commentId}:`, error.response?.data || error.message);
    throw handleAxiosError(error, 'Failed to upvote comment');
  }
}

export async function updateComment(commentId: number, data: UpdateCommentData): Promise<ApiComment> {
  try {
    // Assuming PATCH for partial update. Use PUT if your backend expects the full object.
    const response = await api.patch<ApiComment>(`/forum-comments/${commentId}/`, data);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating comment ${commentId}:`, error.response?.data || error.message);
    throw handleAxiosError(error, 'Failed to update comment');
  }
}


export async function fetchForumTags(): Promise<ApiForumTag[]> {
  try {
    const response = await api.get<ApiForumTag[]>('/forum-tags/');
    return response.data;
  } catch (error: any) {
    console.error("Error fetching forum tags:", error.response?.data || error.message);
    throw handleAxiosError(error, 'Failed to fetch forum tags');
  }
}

export async function createForumTag(name: string): Promise<ApiForumTag> {
  try {

    const response = await api.post<ApiForumTag>('/forum-tags/', { name });
    return response.data;
  } catch (error: any) {
    console.error(`Error creating forum tag "${name}":`, error.response?.data || error.message);
    throw handleAxiosError(error, 'Failed to create forum tag');
  }
}
