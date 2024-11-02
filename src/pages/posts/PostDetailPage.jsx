import React from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useParams } from "react-router-dom";
import PostDetailContent from "@/components/posts/PostDetailContent";
import Comments from "@/components/posts/Comments";

const PostDetailPage = () => {
  const { id: postId } = useParams();

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/post/${postId}`);
      return response.data;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-500">Error loading post</div>
      </div>
    );
  }

  if (!post?.content) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">No content available</div>
      </div>
    );
  }

  return (
    <div className="">
      <PostDetailContent content={post.content} />
      <Comments comments={post.comments} postId={postId} />
    </div>
  );
};

export default PostDetailPage;
