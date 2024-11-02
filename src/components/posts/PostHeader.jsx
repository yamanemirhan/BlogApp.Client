import { formatDate } from "@/lib/formatDate";
import React from "react";

const PostHeader = ({
  title,
  publishedDate,
  tags,
  category,
  coverImageUrl,
  description,
  lastUpdated,
}) => {
  return (
    <div className="text-white">
      <img
        src={coverImageUrl}
        alt={title}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-sm text-gray-400 mb-4">
        Published on: {formatDate(publishedDate)}{" "}
        {lastUpdated && `(Updated: ${formatDate(lastUpdated)})`}
      </p>
      <p className="text-lg mb-4">{description}</p>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm bg-gray-700 px-2 py-1 rounded">
          {category.name}
        </span>
        <div className="flex gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
