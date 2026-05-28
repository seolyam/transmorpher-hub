'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/utils/supabase/client';
import { submitComment } from '@/app/actions';
import Image from 'next/image';

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

interface CommentSectionProps {
  loadoutId: string;
  currentUserId: string | null;
}

export default function CommentSection({ loadoutId, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const supabase = createBrowserClient();

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id, user_id, content, created_at,
          profiles (username, avatar_url)
        `)
        .eq('loadout_id', loadoutId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data as any);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [loadoutId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId) return;

    setSubmitting(true);
    const res = await submitComment(loadoutId, newComment);
    if (res.success) {
      setNewComment('');
      fetchComments();
    } else {
      console.error(res.error);
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div className="animate-pulse flex space-x-4">
      <div className="flex-1 space-y-4 py-1">
        <div className="h-2 bg-slate-800 rounded"></div>
        <div className="h-2 bg-slate-800 rounded w-5/6"></div>
      </div>
    </div>;
  }

  return (
    <div className="mt-8 flex flex-col gap-4">
      <h3 className="text-lg font-bold text-slate-50">Comments ({comments.length})</h3>
      
      <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No comments yet. Be the first!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-slate-800 overflow-hidden relative border border-slate-700">
                {comment.profiles.avatar_url ? (
                  <Image src={comment.profiles.avatar_url} alt={comment.profiles.username} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                    {comment.profiles.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-slate-200">{comment.profiles.username}</span>
                  <span className="text-xs text-slate-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-400 mt-0.5">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {currentUserId ? (
        <form onSubmit={handleSubmit} className="mt-2 flex gap-3">
          <input 
            type="text" 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-frost-blue transition-colors"
            disabled={submitting}
          />
          <button 
            type="submit"
            disabled={!newComment.trim() || submitting}
            className="px-4 py-2 bg-frost-blue/10 text-frost-blue hover:bg-frost-blue hover:text-slate-950 font-medium text-sm rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </form>
      ) : (
        <div className="mt-2 p-3 bg-slate-900 border border-slate-800 rounded-md text-sm text-slate-500 text-center">
          Sign in to post a comment
        </div>
      )}
    </div>
  );
}
