import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import CommentItem from "./CommentItem";

const CommentThread = ({ comment, postId, allComments }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const replyCount = comment.children?.length || 0;

  return (
    <div className="border-b border-gray-100 py-4">
      <CommentItem
        comment={comment}
        postId={postId}
        allComments={allComments}
      />

      {replyCount > 0 && (
        <div className="ml-8 mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </Button>

          {isExpanded && (
            <div className="mt-2">
              {comment.children.map((reply) => (
                <CommentItem
                  key={reply.commentId}
                  comment={reply}
                  postId={postId}
                  isReply={true}
                  allComments={allComments}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentThread;
