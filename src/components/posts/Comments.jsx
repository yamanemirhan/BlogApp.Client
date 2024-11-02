import React from "react";
import { useState } from "react";
import CommentForm from "./CommentForm";
import CommentThread from "./CommentThread";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Comments = ({ comments, postId }) => {
  const [sortOrder, setSortOrder] = useState("newest");

  const sortedComments = [...(comments || [])].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="mt-8">
      <div className="mb-6">
        <CommentForm postId={postId} allComments={comments} />
      </div>
      <div className="flex items-center gap-8">
        <h2 className="text-xl font-semibold text-white">
          Comments ({comments.length})
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">Sort by:</span>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[140px] bg-gray-800 text-white border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="newest" className="hover:bg-gray-700">
                Newest First
              </SelectItem>
              <SelectItem value="oldest" className="hover:bg-gray-700">
                Oldest First
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        {sortedComments.map((comment) => (
          <CommentThread
            key={comment.commentId}
            comment={comment}
            postId={postId}
            allComments={comments}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
