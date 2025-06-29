"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ThumbsUp, MessageSquare } from "lucide-react";
import type { ApiThread, ApiComment, NewCommentData, UpdateCommentData } from "@/types/forum";
import { fetchCommentsForThread, postComment, upvoteThread, upvoteComment, updateComment } from "@/lib/forumService";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";

const getTypeBadgeProps = (type: ApiThread['type'] | undefined, darkMode: boolean) => {
  switch (type) {
    case "announcement":
      return {
        text: "Announcement",
        className: darkMode
          ? "bg-amber-900/60 text-amber-300 border-amber-700/70 hover:bg-amber-800/70 text-xs px-2 py-0.5"
          : "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200 text-xs px-2 py-0.5",
      };
    case "resource":
      return {
        text: "Resource",
        className: darkMode
          ? "bg-emerald-900/60 text-emerald-300 border-emerald-700/70 hover:bg-emerald-800/70 text-xs px-2 py-0.5"
          : "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200 text-xs px-2 py-0.5",
      };
    case "discussion":
    default:
      return {
        text: "Discussion",
        className: darkMode
          ? "bg-blue-900/60 text-blue-300 border-blue-700/70 hover:bg-blue-800/70 text-xs px-2 py-0.5"
          : "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200 text-xs px-2 py-0.5",
      };
  }
};

const getCurrentUserId = (): number | null => {
  if (typeof window !== 'undefined') {
    const userIdStr = localStorage.getItem('userId');
    return userIdStr ? parseInt(userIdStr, 10) : null;
  }
  return null;
};

interface CommentItemProps {
  comment: ApiComment;
  threadId: number;
  onCommentUpdatedOrReplied: () => void;
  currentUserId: number | null;
}

const CommentItemDisplay: React.FC<CommentItemProps> = ({ comment, threadId, onCommentUpdatedOrReplied, currentUserId }) => {
  const { darkMode } = useTheme();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthor = currentUserId === comment.author.id;

  const handleReplySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !currentUserId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const replyData: NewCommentData = {
        thread: threadId,
        content: replyContent,
        parent_comment_id: comment.id,
      };
      await postComment(replyData);
      setReplyContent("");
      setIsReplying(false);
      onCommentUpdatedOrReplied();
    } catch (err: any) {
      setError(err.detail || err.message || "Failed to post reply.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editedContent.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const updateData: UpdateCommentData = { content: editedContent };
      await updateComment(comment.id, updateData);
      setIsEditing(false);
      onCommentUpdatedOrReplied();
    } catch (err: any) {
      setError(err.detail || err.message || "Failed to update comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentUpvote = async () => {
    if (!currentUserId) {
      alert("Please login to upvote.");
      return;
    }
    try {
      await upvoteComment(comment.id);
      onCommentUpdatedOrReplied();
    } catch (err: any) {
      alert(err.detail || err.message || "Failed to upvote comment.");
    }
  };

  return (
    <div className={cn("py-3 border-b last:border-b-0", darkMode ? "border-gray-700" : "border-gray-200")}>
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.profile_pic_url || undefined} alt={comment.author.username} />
          <AvatarFallback>{comment.author.username ? comment.author.username.substring(0,1).toUpperCase() : 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className={cn("flex items-center justify-between text-xs", darkMode ? "text-gray-500" : "text-gray-500")}>
            <span className={cn("font-medium", darkMode ? "text-gray-200" : "text-gray-700")}>{comment.author.username || 'User'}</span>
            <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
          </div>
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="mt-1">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={2}
                className={cn("w-full text-sm", darkMode ? "bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-purple-500" : "border-gray-300 focus:border-purple-500")}
                required
              />
              {error && <p className={cn("text-xs mt-1", darkMode ? "text-red-400" : "text-red-500")}>{error}</p>}
              <div className="flex gap-2 mt-1">
                <Button type="submit" size="sm" variant="default" disabled={isSubmitting} className={cn(darkMode ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-600 hover:bg-purple-700")}>Save</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => {setIsEditing(false); setEditedContent(comment.content); setError(null);}} disabled={isSubmitting} className={cn(darkMode ? "text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-gray-100" : "")}>Cancel</Button>
              </div>
            </form>
          ) : (
            <p className={cn("text-sm mt-1 whitespace-pre-wrap", darkMode ? "text-gray-300" : "text-gray-800")}>{comment.content}</p>
          )}
          {!isEditing && (
            <div className="mt-2 flex items-center space-x-3 text-xs">
              <Button variant="ghost" size="sm" onClick={handleCommentUpvote} className={cn("p-0 h-auto", darkMode ? "text-gray-400 hover:text-purple-400" : "text-gray-500 hover:text-purple-600")}>
                <ThumbsUp className="h-3.5 w-3.5 mr-1" /> {comment.upvote_count}
              </Button>
              {currentUserId && (
                <Button variant="ghost" size="sm" onClick={() => setIsReplying(!isReplying)} className={cn("p-0 h-auto", darkMode ? "text-gray-400 hover:text-purple-400" : "text-gray-500 hover:text-purple-600")}>
                  <MessageSquare className="h-3.5 w-3.5 mr-1" /> Reply
                </Button>
              )}
              {isAuthor && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className={cn("p-0 h-auto", darkMode ? "text-gray-400 hover:text-purple-400" : "text-gray-500 hover:text-purple-600")}>
                  Edit
                </Button>
              )}
            </div>
          )}
          {isReplying && (
            <form onSubmit={handleReplySubmit} className={cn("mt-2 ml-4 pl-4 border-l-2", darkMode ? "border-gray-700" : "border-gray-200")}>
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Replying to ${comment.author.username}...`}
                rows={2}
                className={cn("w-full text-sm", darkMode ? "bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-purple-500" : "border-gray-300 focus:border-purple-500")}
                required
              />
              {error && <p className={cn("text-xs mt-1", darkMode ? "text-red-400" : "text-red-500")}>{error}</p>}
              <div className="flex gap-2 mt-1">
                <Button type="submit" size="sm" variant="default" disabled={isSubmitting} className={cn(darkMode ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-600 hover:bg-purple-700")}>Post Reply</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setIsReplying(false)} disabled={isSubmitting} className={cn(darkMode ? "text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-gray-100" : "")}>Cancel</Button>
              </div>
            </form>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div className={cn("mt-3 ml-4 pl-4 border-l-2 space-y-3", darkMode ? "border-gray-700" : "border-gray-200")}>
              {comment.replies.map(reply => (
                <CommentItemDisplay key={reply.id} comment={reply} threadId={threadId} onCommentUpdatedOrReplied={onCommentUpdatedOrReplied} currentUserId={currentUserId} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


interface ThreadViewProps {
  thread: ApiThread;
  onBack: () => void;
}

export function ThreadView({ thread, onBack }: ThreadViewProps) {
  const { darkMode } = useTheme();
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentThread, setCurrentThread] = useState<ApiThread>(thread);

  useEffect(() => {
    setCurrentUserId(getCurrentUserId());
  }, []);

  const fetchAndSetComments = async () => {
    if (!currentThread?.slug) return;
    setIsLoadingComments(true);
    setCommentError(null);
    try {
      const fetchedComments = await fetchCommentsForThread(currentThread.slug);
      setComments(fetchedComments);
    } catch (err: any) {
      setCommentError(err.detail || err.message || "Failed to load comments.");
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    if (currentThread && currentThread.slug) {
        fetchAndSetComments();
    }
  }, [currentThread?.slug]);

  useEffect(() => {
    setCurrentThread(thread);
  }, [thread]);

  const handlePostComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim() || !currentUserId || !currentThread) return;
    setIsSubmittingComment(true);
    setCommentError(null);
    try {
      const commentData: NewCommentData = {
        thread: currentThread.id,
        content: newCommentContent,
      };
      await postComment(commentData);
      setNewCommentContent("");
      fetchAndSetComments();
      setCurrentThread(prev => {
        if (!prev) return thread;
        return {...prev, comment_count: prev.comment_count + 1};
      });
    } catch (err: any) {
      setCommentError(err.detail || err.message || "Failed to post comment.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleThreadUpvote = async () => {
    if (!currentUserId || !currentThread) {
      alert("Please login to upvote.");
      return;
    }
    try {
      const result = await upvoteThread(currentThread.slug);
      setCurrentThread(prev => {
        if (!prev) return thread;
        return { ...prev, upvote_count: result.count };
      });
    } catch (err: any) {
      alert(err.detail || err.message || "Failed to upvote thread.");
    }
  };

  if (!currentThread) return null;

  const typeBadge = getTypeBadgeProps(currentThread.type, darkMode);

  return (
    <div className={cn("p-4 md:p-6 rounded-lg", darkMode ? "bg-gray-900 border border-gray-700" : "bg-white shadow-lg")}>
      <Button
        variant="ghost"
        onClick={onBack}
        className={cn("mb-4", darkMode ? "text-purple-400 hover:text-purple-300 hover:bg-gray-700/50" : "text-purple-600 hover:text-purple-700")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
      </Button>
      <article>
        <header className="mb-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
            <h1 className={cn("text-2xl font-bold", darkMode ? "text-gray-100" : "text-gray-800")}>{currentThread.title}</h1>
            <Badge variant="outline" className={typeBadge.className}>
              {typeBadge.text}
            </Badge>
          </div>
          <div className={cn("flex items-center text-sm mt-1", darkMode ? "text-gray-400" : "text-gray-500")}>
            <Avatar className="h-7 w-7 mr-2">
              <AvatarImage src={currentThread.author.profile_pic_url || undefined} alt={currentThread.author.username} />
              <AvatarFallback>{currentThread.author.username ? currentThread.author.username.substring(0,1).toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
            <span className={cn(darkMode ? "text-gray-300" : "")}>{currentThread.author.username || 'User'}</span>
            <span className="mx-1.5">·</span>
            <span>Posted {formatDistanceToNow(new Date(currentThread.created_at), { addSuffix: true })}</span>
            {currentThread.updated_at !== currentThread.created_at && (
              <span className="mx-1.5">· Edited {formatDistanceToNow(new Date(currentThread.updated_at), { addSuffix: true })}</span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {currentThread.tags.map(tag => (
              <Badge
                key={tag.id}
                variant="secondary"
                className={cn(darkMode ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600" : "")}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </header>
        <div className={cn("prose prose-sm max-w-none mb-6 whitespace-pre-wrap", darkMode ? "text-gray-300 prose-invert" : "text-gray-700")}>
          {currentThread.content}
        </div>
        <div className={cn("flex items-center space-x-4 mb-6 pb-4 border-b", darkMode ? "border-gray-700" : "border-gray-200")}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleThreadUpvote}
            disabled={!currentUserId}
            className={cn(darkMode ? "text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-gray-100" : "")}
          >
            <ThumbsUp className="h-4 w-4 mr-1.5" /> Upvote ({currentThread.upvote_count})
          </Button>
        </div>
      </article>
      <section className="mt-6">
        <h2 className={cn("text-lg font-semibold mb-3", darkMode ? "text-gray-100" : "text-gray-800")}>Comments ({currentThread.comment_count})</h2>
        {currentUserId && (
          <form onSubmit={handlePostComment} className="mb-6">
            <Label htmlFor="new-comment" className="sr-only">Add a comment</Label>
            <Textarea
              id="new-comment"
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              placeholder="Add your comment..."
              rows={3}
              required
              className={cn("mb-2", darkMode ? "bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-purple-500" : "border-gray-300 focus:border-purple-500")}
            />
            {commentError && <p className={cn("text-xs mb-1", darkMode ? "text-red-400" : "text-red-500")}>{commentError}</p>}
            <Button
              type="submit"
              disabled={isSubmittingComment || !currentUserId}
              className={cn(darkMode ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-600 hover:bg-purple-700")}
            >
              {isSubmittingComment ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        )}
        {!currentUserId && (
          <p className={cn("text-sm mb-4", darkMode ? "text-gray-400" : "text-gray-600")}>
            Please <Link href="/auth" className={cn(darkMode ? "text-purple-400 hover:underline" : "text-purple-600 hover:underline")}>login</Link> to post comments.
          </p>
        )}
        {isLoadingComments && <p className={cn("text-sm", darkMode ? "text-gray-500" : "text-gray-500")}>Loading comments...</p>}
        {!isLoadingComments && commentError && !comments.length && (
          <p className={cn("text-sm", darkMode ? "text-red-400" : "text-red-500")}>{commentError}</p>
        )}
        {!isLoadingComments && !commentError && comments.length === 0 && (
          <p className={cn("text-sm", darkMode ? "text-gray-500" : "text-gray-500")}>No comments yet.</p>
        )}
        <div className="space-y-3">
          {comments.map(comment => (
            <CommentItemDisplay key={comment.id} comment={comment} threadId={currentThread.id} onCommentUpdatedOrReplied={fetchAndSetComments} currentUserId={currentUserId} />
          ))}
        </div>
      </section>
    </div>
  );
}