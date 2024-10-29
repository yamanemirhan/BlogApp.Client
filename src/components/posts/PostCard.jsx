import { formatDate } from "@/lib/formatDate";
import { MessageSquareMore } from "lucide-react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <Link to={`/post/${post.postId}`}>
      <div className="w-96 h-[400px] hover:opacity-60 hover:cursor-pointer flex flex-col gap-[2px] border border-stone-800 rounded-md relative shadow-md shadow-stone-800">
        <div className="absolute left-3 top-3 border border-zinc-500 bg-zinc-500 rounded-3xl py-1 px-2">
          <span className="text-white text-sm font-medium">
            {post.category?.name}
          </span>
        </div>
        <img
          src={post.coverImageUrl}
          className="rounded-t-md object-fill w-full h-48"
        />

        <div className="flex items-center justify-between text-sm text-gray-500 p-1">
          <div className="flex items-center gap-2">
            <p>{formatDate(post.publishedDate)}</p>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            {post.tags?.map((tag) => (
              <p key={tag.tagId}>#{tag.name}</p>
            ))}
          </div>
          <div className="flex items-center">
            <p>{post.comments?.length}</p>
            <MessageSquareMore size={20} />
          </div>
        </div>
        <h1 className="text-xl font-bold p-1">{post.title}</h1>
        <p className="p-1 font-medium text-gray-400">{post.description}</p>
        {/* user img and name */}
        <div className="flex items-center gap-2 p-1 mt-auto">
          <img
            src={post.author.profileImageUrl}
            className="rounded-full w-10 h-10 object-cover"
          />
          <button>
            <span className="text-base font-semibold">
              {post.author.username}
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
