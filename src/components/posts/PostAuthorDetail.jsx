import React from "react";
import { Link } from "react-router-dom";

const PostAuthorDetail = ({ author }) => {
  return (
    <div className="flex flex-row items-center gap-3 my-2 p-2">
      <img src={author?.profileImageUrl} className="w-12 h-12 rounded-full" />
      <button>
        <Link
          className="text-white text-xl"
          to={`/profile/${author?.authorId}`}
        >
          {author?.username}
        </Link>
      </button>
    </div>
  );
};

export default PostAuthorDetail;
