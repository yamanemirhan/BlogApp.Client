import PostCard from "@/components/posts/PostCard";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import React, { useState } from "react";

const HomePage = () => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await axiosInstance.get("/category/all"),
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filter, setFilter] = useState({
    search: "",
    sortBy: "PublishedDate",
    isDescending: true,
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: [
      "posts",
      {
        ...filter,
        ...(selectedCategories.length > 0 && {
          categoryNames: selectedCategories.join(","),
        }),
      },
    ],
    queryFn: async () => {
      let url = "/post/all?";
      const searchParams = [];

      // Add basic filters
      Object.entries(filter).forEach(([key, value]) => {
        searchParams.push(`${key}=${encodeURIComponent(value)}`);
      });

      // Preprocess categories to split any containing "&"
      const processedCategories = selectedCategories.flatMap((category) =>
        category.includes("&") ? category.split(" & ") : category
      );

      // Add processed categories to the query
      if (processedCategories.length > 0) {
        searchParams.push(`categoryNames=${processedCategories.join(",")}`);
      }

      url += searchParams.join("&");

      return await axiosInstance.get(url);
    },
    retry: false,
  });

  const handleCategoryClick = (category) => {
    if (category === "All") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
      );
    }
  };

  const handleSortChange = () => {
    setFilter((prev) => ({
      ...prev,
      isDescending: !prev.isDescending,
    }));
  };

  return (
    <div className="">
      {/* banner */}
      <div className="bg-slate-800 from-green-400 to-green-800 w-full h-full py-12 flex rounded-md">
        <div className="flex flex-col gap-6 w-full">
          {/* categories display */}
          <div className="flex items-center gap-3 border-b pb-2 justify-center mx-auto">
            <div className="flex flex-col gap-2">
              {categories?.data?.slice(0, 3).map((cat) => (
                <div
                  key={cat.categoryId}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`border hover:bg-gray-900 w-40 py-1 cursor-pointer shadow-xl border-red-400 rounded-l-xl text-center bg-black text-white ${
                    selectedCategories.includes(cat.name) ? "bg-red-500" : ""
                  }`}
                >
                  <p>{cat.name}</p>
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
              {categories?.data?.slice(3, 6).map((cat) => (
                <div
                  key={cat.categoryId}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`border hover:bg-gray-900 w-40 py-1 cursor-pointer shadow-xl border-red-400 rounded-r-xl text-center bg-black text-white ${
                    selectedCategories.includes(cat.name) ? "bg-red-500" : ""
                  }`}
                >
                  <p>{cat.name}</p>
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
          <div className="relative flex justify-center w-full">
            <input
              type="text"
              placeholder="Search blogs..."
              className="py-4 pl-6 pr-20 rounded-3xl w-2/5 focus:outline-none"
              value={filter.search}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, search: e.target.value }))
              }
            />
            <SearchIcon
              size={30}
              className="absolute right-[32%] top-3 hover:cursor-pointer"
              color="black"
            />
          </div>
        </div>
      </div>
      {/* Blog section */}
      <div className="text-white my-4 p-6 flex flex-col gap-2 max-w-[1536px] mx-auto">
        <h2 className="text-2xl">Blog</h2>
        <p className="text-gray-300">
          Discover the categories that match your interests and dive into our
          latest articles.
        </p>
        <div className="flex items-center justify-between mb-6">
          {/* Categories */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => handleCategoryClick("All")}
              className={`bg-slate-500 py-1 px-2 rounded-full hover:bg-gray-700 ${
                selectedCategories.length === 0 ? "bg-red-500" : ""
              }`}
            >
              All
            </button>
            {categories?.data?.map((cat) => (
              <button
                onClick={() => handleCategoryClick(cat.name)}
                className={`bg-gray-500 py-1 px-2 rounded-sm hover:bg-red-800 ${
                  selectedCategories.includes(cat.name) ? "bg-red-500" : ""
                }`}
                key={cat.categoryId}
              >
                {cat.name}
              </button>
            ))}
          </div>
          {/* Sort button */}
          <div>
            Sort by:{" "}
            <button onClick={handleSortChange}>
              {filter.isDescending ? "Newest" : "Oldest"}
            </button>
          </div>
        </div>
        {/* Post cards */}
        {isLoading ? (
          <div>Loading posts...</div>
        ) : (
          <div className="grid grid-flow-row mx-auto gap-20 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
            {posts?.data?.map((post) => (
              <PostCard key={post.postId} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
