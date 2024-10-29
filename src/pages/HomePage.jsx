import React from "react";
import Posts from "@/components/posts/Posts";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

const HomePage = () => {
  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => await axiosInstance.get("/tag/all"),
    retry: false,
  });

  return (
    <div className="">
      {/* banner */}
      <div className="bg-slate-800 from-green-400 to-green-800 w-full h-full py-12 flex rounded-md">
        <div className="flex flex-col gap-6 w-full">
          {/* tags display */}
          <div className="flex items-center gap-3 border-b pb-2 justify-center mx-auto">
            <div className="flex flex-col gap-2">
              {tags?.data?.slice(0, 3).map((tag) => (
                <div
                  key={tag.tagId}
                  className="border hover:bg-gray-900 w-40 py-1 cursor-pointer shadow-xl border-red-400 rounded-l-xl text-center bg-black text-white"
                >
                  <p>#{tag.name}</p>
                </div>
              ))}
            </div>
            {/* Divider */}
            <div className="relative border-x px-4">
              <div className="w-10 h-32" />
              <div className="absolute w-6 h-6 rounded-full bg-blue-500 -top-3 -left-3" />
              <div className="absolute w-6 h-6 rounded-full bg-blue-500 -top-3 -right-3" />
            </div>
            <div className="flex flex-col gap-2">
              {tags?.data?.slice(3, 6).map((tag) => (
                <div
                  key={tag.tagId}
                  className="border hover:bg-gray-900 w-40 py-1 cursor-pointer shadow-xl border-red-400 rounded-r-xl text-center bg-black text-white"
                >
                  <p>#{tag.name}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Big text */}
          <div className="w-1/2 p-4 bg-black mx-auto flex justify-center items-center rounded-md">
            <h1 className="text-white text-center text-7xl font-bold">
              Ready to Dive Into a World of Ideas?
            </h1>
          </div>
        </div>
      </div>

      {/* Blog section */}
      <div className="my-4 p-6 flex flex-col gap-2">
        <h2 className="text-2xl text-white">Blogs</h2>
        <p className="text-gray-300">
          Discover the categories that match your interests and dive into our
          latest articles.
        </p>
        <Posts />
      </div>
    </div>
  );
};

export default HomePage;
