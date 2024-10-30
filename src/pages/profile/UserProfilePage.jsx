import React, { useState, useEffect } from "react";
import Posts from "@/components/posts/Posts";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useParams, useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/formatDate";

const UserProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const { data: authUser, isLoading: isAuthLoading } = useQuery({
    queryKey: ["getProfile"],
  });

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/user/${username}`);
        return res.data;
      } catch (error) {
        // todo: toast
        console.error("error: ", error.message);
        return null;
      }
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthLoading && userProfile) {
      if (userProfile?.username === authUser?.username) {
        setShouldRedirect(true);
      }
    }
  }, [userProfile, authUser, isLoading, isAuthLoading]);

  useEffect(() => {
    if (shouldRedirect) {
      navigate("/profile/me");
    }
  }, [shouldRedirect, navigate]);

  if (isLoading || isAuthLoading || shouldRedirect) {
    return <div className="text-white">Loading...</div>;
  }

  if (!userProfile) return <div className="text-red-500">User not found!</div>;

  const customQueryFn = async () => {
    let url = `/post/user/id/${userProfile?.id}`;

    await new Promise((resolve) => setTimeout(resolve, 500));

    const res = await axiosInstance.get(url);
    return res.data.reverse();
  };

  return (
    <div className="text-white">
      <div className="flex flex-col gap-2">
        <img
          src={userProfile?.profileImageUrl}
          className="w-80 h-80 rounded-full mx-auto"
        />
        <h2 className="text-4xl text-center">{userProfile?.username}</h2>
        <p className="text-gray-400 text-center">
          Member since {formatDate(userProfile?.createdAt).split(" at ")[0]}
        </p>
      </div>
      <div className="flex flex-col gap-2 max-w-[1536px] mx-auto my-10">
        <Posts
          queryKey={["userPosts", userProfile?.id]}
          baseUrl={`/post/user/id/${userProfile?.id}`}
          customQueryFn={customQueryFn}
          showFilters={false}
        />
      </div>
    </div>
  );
};

export default UserProfilePage;
