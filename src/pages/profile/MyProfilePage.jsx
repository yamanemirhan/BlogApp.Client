import Posts from "@/components/posts/Posts";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const MyProfilePage = () => {
  const { data: authUser, userLoading } = useQuery({
    queryKey: ["getProfile"],
  });

  const customQueryFn = async () => {
    let url = `/post/user/id/${authUser?.id}`;

    await new Promise((resolve) => setTimeout(resolve, 500));

    const res = await axiosInstance.get(url);
    return res.data.reverse();
  };

  if (userLoading) return null;

  return (
    <div className="text-white">
      <h1>{authUser?.username}</h1>
      <h2 className="text-2xl text-white text-center">Blogs</h2>
      <div className="my-4 p-6 flex flex-col gap-2 max-w-[1536px] mx-auto">
        <Posts
          queryKey={["userPosts", authUser?.id]}
          baseUrl={`/post/user/id/${authUser?.id}`}
          customQueryFn={customQueryFn}
          showFilters={false}
        />
      </div>
    </div>
  );
};

export default MyProfilePage;
