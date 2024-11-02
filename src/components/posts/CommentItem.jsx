import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CommentForm from "./CommentForm";
import { formatDate } from "@/lib/formatDate";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CommentItem = ({ comment, postId, isReply = false, allComments }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({
    queryKey: ["getProfile"],
  });

  const canModify =
    authUser?.id === comment.author.authorId || authUser?.isAdmin;

  // Delete mutation
  const { mutate: deleteComment } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/comment/${comment.commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["post", postId]);
      setShowDeleteDialog(false);
    },
  });

  // Update mutation
  const { mutate: updateComment } = useMutation({
    mutationFn: async () => {
      await axiosInstance.put(`/comment/${comment.commentId}`, {
        content: editedContent,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["post", postId]);
      setIsEditing(false);
    },
  });

  return (
    <div className={`${isReply ? "ml-8 mt-4" : "mt-4"}`}>
      <div className="flex items-start gap-3 bg-gray-300 p-4 rounded-lg relative">
        <img
          src={comment.author.profileImageUrl}
          alt={comment.author.username}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{comment.author.username}</span>
            <span className="text-sm text-gray-800">
              {formatDate(comment.createdAt)}
            </span>
            {comment.isUpdated && (
              <span className="text-sm text-gray-500">(edited)</span>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[100px] bg-white"
              />
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => updateComment()}
                  className="flex items-center gap-1"
                >
                  <Check size={16} /> Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(comment.content);
                  }}
                  className="flex items-center gap-1"
                >
                  <X size={16} /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1">{comment.content}</p>
          )}

          {!isEditing && (
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                Reply
              </Button>
            </div>
          )}
        </div>

        {canModify && !isEditing && (
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditing(true)}
            >
              <Pencil size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>

      {showReplyForm && (
        <div className="ml-8 mt-4">
          <CommentForm
            postId={postId}
            parentCommentId={comment.commentId}
            replyToUsername={comment.author.username}
            onCancel={() => setShowReplyForm(false)}
            allComments={allComments}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteComment()}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CommentItem;
