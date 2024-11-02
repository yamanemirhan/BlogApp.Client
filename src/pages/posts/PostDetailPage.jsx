import React from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useParams } from "react-router-dom";
import PostDetailContent from "@/components/posts/PostDetailContent";
import Comments from "@/components/posts/Comments";
import PostAuthorDetail from "@/components/posts/PostAuthorDetail";
import PostHeader from "@/components/posts/PostHeader";
import { EditIcon, Trash2 } from "lucide-react";

const PostDetailPage = () => {
  const { id: postId } = useParams();

  const { data: authUser } = useQuery({
    queryKey: ["getProfile"],
  });

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
    <div>
      <PostAuthorDetail author={post.author} />
      <PostHeader
        title={post.title}
        publishedDate={post.publishedDate}
        tags={post.tags}
        category={post.category}
        coverImageUrl={post.coverImageUrl}
        description={post.description}
        lastUpdated={post.lastUpdated}
      />
      {authUser?.id === post?.author?.authorId && (
        <div className="flex items-center gap-4 my-2">
          <Trash2 color="red" size={40} className="hover:cursor-pointer" />
          <EditIcon color="blue" size={40} className="hover:cursor-pointer" />
        </div>
      )}
      <PostDetailContent content={post.content} />
      <Comments comments={post.comments} postId={postId} />
    </div>
  );
};

export default PostDetailPage;
