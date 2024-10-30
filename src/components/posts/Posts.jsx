import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PostCard from "@/components/posts/PostCard";
import BlogFilters from "./BlogFilters";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Pagination from "../common/Pagination";

const Posts = ({
  queryKey = "posts",
  baseUrl = "/post/all",
  showFilters = true,
  customQueryFn = null,
  skeletonCount = 6,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

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

  // update url if showFilters is true
  useEffect(() => {
    if (!showFilters) return;

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
  }, [filter, selectedCategories, setSearchParams, showFilters]);

  const defaultQueryFn = async () => {
    let url = `${baseUrl}?`;
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

    await new Promise((resolve) => setTimeout(resolve, 500));

    const res = await axiosInstance.get(url);
    return res.data;
  };

  const { data: postsData, isLoading } = useQuery({
    queryKey: [
      queryKey,
      showFilters && {
        ...filter,
        ...(selectedCategories.length > 0 && {
          categoryNames: selectedCategories.join(","),
        }),
      },
    ],
    queryFn: customQueryFn || defaultQueryFn,
    retry: false,
  });

  const handlePageChange = (newPage) => {
    setFilter((prev) => ({ ...prev, pageNumber: newPage }));
  };

  return (
    <div className="text-white w-full">
      {showFilters && (
        <BlogFilters
          filter={filter}
          setFilter={setFilter}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      )}
      <h2 className="text-2xl text-white text-center pb-4">
        Blogs ({postsData?.length})
      </h2>
      {isLoading ? (
        <div className="grid grid-flow-row mx-auto gap-20 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 max-w-[1560px] place-items-center">
          {[...Array(skeletonCount)].map((_, index) => (
            <div key={index} className="flex flex-col space-y-3 w-96 h-[400px]">
              <Skeleton className="rounded-t-md w-full h-48 bg-gray-700" />
              <div className="flex flex-col flex-1">
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-4 w-full mt-4 bg-gray-700" />
                <Skeleton className="h-4 w-full mt-4 bg-gray-700" />
                <Skeleton className="h-4 w-full mt-auto bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-flow-row mx-auto gap-20 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 max-w-[1560px] place-items-center">
            {showFilters
              ? postsData?.items?.map((post) => (
                  <PostCard key={post.postId} post={post} />
                ))
              : postsData
                  ?.reverse()
                  .map((post) => <PostCard key={post.postId} post={post} />)}
          </div>

          {showFilters && postsData?.totalPages > 1 && (
            <Pagination
              currentPage={filter.pageNumber}
              totalPages={postsData?.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Posts;
