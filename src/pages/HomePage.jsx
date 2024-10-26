import PostCard from "@/components/posts/PostCard";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import React from "react";

const HomePage = () => {
  const { data: categories } = useQuery({ queryKey: ["categories"] });

  return (
    <div className="">
      {/* banner */}
      <div className="bg-slate-800 from-green-400 to-green-800 w-full h-full py-12 flex rounded-md">
        <div className="flex flex-col gap-6 w-full">
          {/* yellow */}
          <div className="flex items-center gap-3 border-b pb-2 justify-center mx-auto">
            <div className="flex flex-col gap-2">
              <div className="border w-40 py-1 hover:text-semibold hover:bg-red-100 hover:cursor-pointer hover:border-red-50 hover:text-black shadow-xl border-red-400 rounded-l-xl text-center bg-black text-white">
                <p>Technology</p>
              </div>
              <div className="border w-40 py-1 hover:text-semibold hover:bg-red-100 hover:cursor-pointer hover:border-red-50 hover:text-black shadow-xl border-red-400 rounded-l-xl text-center bg-black text-white">
                <p>News</p>
              </div>
              <div className="border w-40 py-1 hover:text-semibold hover:bg-red-100 hover:cursor-pointer hover:border-red-50 hover:text-black shadow-xl border-red-400 rounded-l-xl text-center bg-black text-white">
                <p>Social</p>
              </div>
            </div>

            <div className="relative border-x px-4">
              <div className="w-10 h-32" />

              <div className="absolute w-6 h-6 rounded-full bg-blue-500 -top-3 -left-3" />
              {/* <div className="absolute w-3 h-3 rounded-full bg-white -top-2 -left-2 animate-bounce" /> */}

              <div className="absolute w-6 h-6 rounded-full bg-blue-500 -top-3 -right-3" />
              {/* <div className="absolute w-3 h-3 rounded-full bg-white -top-2 -right-2 animate-bounce" /> */}
            </div>

            <div className="flex flex-col gap-2">
              <div className="border w-40 py-1 hover:text-semibold hover:bg-red-100 hover:cursor-pointer hover:border-red-50 hover:text-black shadow-xl border-red-400 rounded-r-xl  text-center bg-black text-white">
                <p>Fun</p>
              </div>
              <div className="border w-40 py-1 hover:text-semibold hover:bg-red-100 hover:cursor-pointer hover:border-red-50 hover:text-black shadow-xl border-red-400 rounded-r-xl  text-center bg-black text-white">
                <p>Software</p>
              </div>
              <div className="border w-40 py-1 hover:text-semibold hover:bg-red-100 hover:cursor-pointer hover:border-red-50 hover:text-black shadow-xl border-red-400 rounded-r-xl  text-center bg-black text-white">
                <p>Game</p>
              </div>
            </div>
          </div>
          {/* big text */}
          <div className="w-1/2 p-4 bg-black mx-auto flex justify-center items-center rounded-md">
            <h1 className="text-white text-center text-7xl font-bold">
              Ready to Dive Into a World of Ideas?
            </h1>
          </div>
          {/* text */}
          <div className="mx-auto">
            <h1 className="text-2xl text-gray-100">
              Looking for Inspiration? Start Here!
            </h1>
          </div>
          {/* searchbar */}
          <div className="relative flex justify-center w-full">
            <input
              type="text"
              placeholder="Search blogs..."
              className="py-4 pl-6 pr-20 rounded-3xl w-2/5 focus: outline-none"
            />
            <SearchIcon
              size={30}
              className="absolute right-[32%] top-3 hover:cursor-pointer"
              color="black"
            />
          </div>
        </div>
      </div>
      {/* blog */}
      <div className="text-white my-4 p-6 flex flex-col gap-2 max-w-[1536px] mx-auto">
        <h2 className="text-2xl">Blog</h2>
        <p className="text-gray-300">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa, saepe.
        </p>
        <div className="flex items-center justify-between mb-6">
          {/* categories */}
          <div className="flex items-center gap-4 mt-4">
            <button>All</button>
            {categories?.data?.map((cat) => (
              <button key={cat.categoryId}>{cat.name}</button>
            ))}
          </div>
          {/* sort by */}
          <div>
            Sort by: <button>Newest</button>
          </div>
        </div>
        {/* blog cards */}
        <div className="grid grid-flow-row mx-auto gap-20 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
          <PostCard className="" />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
