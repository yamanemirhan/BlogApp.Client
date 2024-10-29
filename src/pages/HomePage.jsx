import PostCard from "@/components/posts/PostCard";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL parameters
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const categoryParam = searchParams.get("categories");
    return categoryParam ? categoryParam.split(",") : [];
  });

  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
    sortBy: searchParams.get("sortBy") || "PublishedDate",
    isDescending: searchParams.get("isDescending") !== "false",
    pageNumber: parseInt(searchParams.get("pageNumber") || "1"),
    pageSize: 6,
  });

  // update url
  useEffect(() => {
    const newSearchParams = new URLSearchParams();

    if (filter.search) {
      newSearchParams.set("search", filter.search);
    }

    newSearchParams.set("sortBy", filter.sortBy);
    newSearchParams.set("isDescending", filter.isDescending.toString());
    newSearchParams.set("pageNumber", filter.pageNumber.toString());

    if (selectedCategories.length > 0) {
      newSearchParams.set("categories", selectedCategories.join(","));
    }

    setSearchParams(newSearchParams);
  }, [filter, selectedCategories, setSearchParams]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await axiosInstance.get("/category/all"),
    retry: false,
  });

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => await axiosInstance.get("/tag/all"),
    retry: false,
  });

  const { data: postsData, isLoading } = useQuery({
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

      Object.entries(filter).forEach(([key, value]) => {
        searchParams.push(`${key}=${encodeURIComponent(value)}`);
      });

      const processedCategories = selectedCategories.flatMap((category) =>
        category.includes("&") ? category.split(" & ") : category
      );

      if (processedCategories.length > 0) {
        searchParams.push(`categoryNames=${processedCategories.join(",")}`);
      }

      url += searchParams.join("&");
      return await axiosInstance.get(url);
    },
    retry: false,
  });

  const handlePageChange = (newPage) => {
    setFilter((prev) => ({ ...prev, pageNumber: newPage }));
  };

  const handleCategoryClick = (category, event) => {
    event.preventDefault(); // todo:
    if (category === "All") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
      );
    }

    // go to first page when changing cats
    setFilter((prev) => ({ ...prev, pageNumber: 1 }));
  };

  const handleSortChange = () => {
    setFilter((prev) => ({
      ...prev,
      isDescending: !prev.isDescending,
      pageNumber: 1, // reset to first page when changing sortBy
    }));
  };

  const handleSearchChange = (e) => {
    setFilter((prev) => ({
      ...prev,
      search: e.target.value,
      pageNumber: 1, // reset to first page when searching
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
                  className="border hover:bg-gray-900 w-40 py-1 cursor-pointer shadow-xl border-red-400 rounded-l-xl text-center bg-black text-white"
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
          <div className="relative flex justify-center w-full">
            <input
              type="text"
              placeholder="Search blogs..."
              className="py-4 pl-6 pr-20 rounded-3xl w-2/5 focus:outline-none"
              value={filter.search}
              onChange={handleSearchChange}
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
              onClick={(event) => handleCategoryClick("All", event)}
              className={`bg-slate-500 py-1 px-2 rounded-full hover:bg-gray-700 ${
                selectedCategories.length === 0 ? "bg-red-500" : ""
              }`}
            >
              All
            </button>
            {categories?.data?.map((cat) => (
              <button
                onClick={(event) => handleCategoryClick(cat.name, event)}
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
          // todo: flicker h-screen
          <div className="min-h-screen">Loading posts...</div>
        ) : (
          <>
            <div className="grid grid-flow-row mx-auto gap-20 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
              {postsData?.data?.items?.map((post) => (
                <PostCard key={post.postId} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {postsData?.data?.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={filter.pageNumber === 1}
                  className={`px-4 py-2 rounded ${
                    filter.pageNumber === 1
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  First
                </button>

                <button
                  onClick={() => handlePageChange(filter.pageNumber - 1)}
                  disabled={filter.pageNumber === 1}
                  className={`px-4 py-2 rounded ${
                    filter.pageNumber === 1
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  Previous
                </button>

                <span className="px-4 py-2">
                  Page {filter.pageNumber} of {postsData?.data?.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(filter.pageNumber + 1)}
                  disabled={filter.pageNumber === postsData?.data?.totalPages}
                  className={`px-4 py-2 rounded ${
                    filter.pageNumber === postsData?.data?.totalPages
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>

                <button
                  onClick={() => handlePageChange(postsData?.data?.totalPages)}
                  disabled={filter.pageNumber === postsData?.data?.totalPages}
                  className={`px-4 py-2 rounded ${
                    filter.pageNumber === postsData?.data?.totalPages
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  Last
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
