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

const getTypeBadgeProps = (type: ApiThread['type'] | undefined) => {
  switch (type) {
    case "announcement":
      return {
        text: "Announcement",
        className: "bg-warning/10 text-warning-foreground border border-warning/20 hover:bg-warning/20 text-xs px-2 py-0.5"
      };
    case "resource":
      return {
        text: "Resource",
        className: "bg-success/10 text-success-foreground border border-success/20 hover:bg-success/20 text-xs px-2 py-0.5"
      };
    case "discussion":
    default:
      return {
        text: "Discussion",
        className: "bg-primary/10 text-primary-foreground border border-primary/20 hover:bg-primary/20 text-xs px-2 py-0.5"
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
    <div className="py-3 border-b last:border-b-0 border-border">
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8 border border-border">
          <AvatarImage src={comment.author.profile_pic_url || undefined} alt={comment.author.username} />
          <AvatarFallback className="bg-muted text-foreground">
            {comment.author.username ? comment.author.username.substring(0,1).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{comment.author.username || 'User'}</span>
            <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
          </div>
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="mt-1">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={2}
                className="w-full text-sm bg-background text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              />
              {error && <p className="text-xs mt-1 text-destructive">{error}</p>}
              <div className="flex gap-2 mt-1">
                <Button type="submit" size="sm" disabled={isSubmitting}>
                  Save
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {setIsEditing(false); setEditedContent(comment.content); setError(null);}} 
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-sm mt-1 whitespace-pre-wrap text-foreground">{comment.content}</p>
          )}
          {!isEditing && (
            <div className="mt-2 flex items-center space-x-3 text-xs">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCommentUpvote} 
                className="p-0 h-auto text-muted-foreground hover:text-foreground"
              >
                <ThumbsUp className="h-3.5 w-3.5 mr-1" /> {comment.upvote_count}
              </Button>
              {currentUserId && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsReplying(!isReplying)} 
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-1" /> Reply
                </Button>
              )}
              {isAuthor && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)} 
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                >
                  Edit
                </Button>
              )}
            </div>
          )}
          {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-2 ml-4 pl-4 border-l-2 border-border">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Replying to ${comment.author.username}...`}
                rows={2}
                className="w-full text-sm bg-background text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              />
              {error && <p className="text-xs mt-1 text-destructive">{error}</p>}
              <div className="flex gap-2 mt-1">
                <Button type="submit" size="sm" disabled={isSubmitting}>
                  Post Reply
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsReplying(false)} 
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 ml-4 pl-4 border-l-2 space-y-3 border-border">
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

  const typeBadge = getTypeBadgeProps(currentThread.type);

  return (
    <div className="p-4 md:p-6 rounded-lg bg-card border border-border shadow-sm">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 text-primary hover:text-primary/90 hover:bg-accent"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
      </Button>
      <article>
        <header className="mb-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
            <h1 className="text-2xl font-bold text-foreground">{currentThread.title}</h1>
            <Badge variant="outline" className={typeBadge.className}>
              {typeBadge.text}
            </Badge>
          </div>
          <div className="flex items-center text-sm mt-1 text-muted-foreground">
            <Avatar className="h-7 w-7 mr-2 border border-border">
              <AvatarImage src={currentThread.author.profile_pic_url || undefined} alt={currentThread.author.username} />
              <AvatarFallback className="bg-muted text-foreground">
                {currentThread.author.username ? currentThread.author.username.substring(0,1).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-foreground">{currentThread.author.username || 'User'}</span>
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
                className="bg-muted text-foreground hover:bg-muted/80"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </header>
        <div className="prose prose-sm max-w-none mb-6 whitespace-pre-wrap text-foreground">
          {currentThread.content}
        </div>
        <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={handleThreadUpvote}
            disabled={!currentUserId}
            className="text-foreground hover:bg-accent"
          >
            <ThumbsUp className="h-4 w-4 mr-1.5" /> Upvote ({currentThread.upvote_count})
          </Button>
        </div>
      </article>
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-3 text-foreground">Comments ({currentThread.comment_count})</h2>
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
              className="mb-2 bg-background text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            {commentError && <p className="text-xs mb-1 text-destructive">{commentError}</p>}
            <Button
              type="submit"
              disabled={isSubmittingComment || !currentUserId}
            >
              {isSubmittingComment ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        )}
        {!currentUserId && (
          <p className="text-sm mb-4 text-muted-foreground">
            Please <Link href="/auth" className="text-primary hover:underline">login</Link> to post comments.
          </p>
        )}
        {isLoadingComments && <p className="text-sm text-muted-foreground">Loading comments...</p>}
        {!isLoadingComments && commentError && !comments.length && (
          <p className="text-sm text-destructive">{commentError}</p>
        )}
        {!isLoadingComments && !commentError && comments.length === 0 && (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
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