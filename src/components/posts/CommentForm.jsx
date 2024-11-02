import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

const findRootParentId = (comments, targetCommentId) => {
  for (const comment of comments) {
    if (comment.commentId === targetCommentId) {
      return comment.commentId;
    }

    if (comment.children) {
      for (const child of comment.children) {
        if (child.commentId === targetCommentId) {
          return comment.commentId;
        }
      }
    }
  }
  return targetCommentId;
};

const CommentForm = ({
  postId,
  parentCommentId = null,
  replyToUsername = null,
  onCancel = null,
  allComments = [],
}) => {
  const [content, setContent] = useState(
    replyToUsername ? `@${replyToUsername} ` : ""
  );
  const queryClient = useQueryClient();

  const { mutate: submitComment, isLoading } = useMutation({
    mutationFn: async () => {
      const actualParentId = parentCommentId
        ? findRootParentId(allComments, parentCommentId)
        : null;

      const response = await axiosInstance.post("/comment", {
        postId,
        content,
        parentCommentId: actualParentId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["post", postId]);
      setContent("");
      if (onCancel) onCancel();
    },
  });

  return (
    <div className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="w-full min-h-[100px] bg-gray-300"
      />
      <div className="flex gap-2">
        <Button
          onClick={() => submitComment()}
          disabled={isLoading || !content.trim()}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};
export default CommentForm;
