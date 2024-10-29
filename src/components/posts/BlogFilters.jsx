import React from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { SearchIcon } from "lucide-react";

const BlogFilters = ({
  filter,
  setFilter,
  selectedCategories,
  setSelectedCategories,
}) => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await axiosInstance.get("/category/all"),
    retry: false,
  });

  const handleCategoryClick = (category, event) => {
    event.preventDefault();
    if (category === "All") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
      );
    }

    setFilter((prev) => ({ ...prev, pageNumber: 1 }));
  };

  const handleSortChange = () => {
    setFilter((prev) => ({
      ...prev,
      isDescending: !prev.isDescending,
      pageNumber: 1,
    }));
  };

  const handleSearchChange = (e) => {
    setFilter((prev) => ({
      ...prev,
      search: e.target.value,
      pageNumber: 1,
    }));
  };

  return (
    <div>
      <div className="relative flex justify-center w-full my-4">
        <input
          type="text"
          placeholder="Search blogs..."
          className="py-4 pl-6 pr-20 rounded-3xl w-2/5 focus:outline-none text-black"
          value={filter.search}
          onChange={handleSearchChange}
        />
        <SearchIcon
          size={30}
          className="absolute right-[32%] top-3 hover:cursor-pointer"
          color="black"
        />
      </div>

      <div className="flex items-center justify-between mb-6">
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
        <div>
          Sort by:{" "}
          <button
            onClick={handleSortChange}
            className="border border-gray-500 py-1 px-2 rounded-md bg-gray-700"
          >
            {filter.isDescending ? "Newest" : "Oldest"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogFilters;
