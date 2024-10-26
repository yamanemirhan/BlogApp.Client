const PostCard = () => {
  return (
    <div className="w-96 hover:opacity-60 hover:cursor-pointer h-fit flex flex-col gap-[2px] border border-stone-800 rounded-md relative shadow-md shadow-stone-800">
      <div className="absolute left-3 top-3 border border-zinc-500 bg-zinc-500 rounded-3xl py-1 px-2">
        <span className="text-white text-sm font-medium">Destination</span>
      </div>
      <img
        src="https://img.freepik.com/free-photo/online-blog_53876-123696.jpg"
        className="rounded-t-md w-fit bg-cover h-fit"
      />
      {/* date * tags, sagda comment sayisi ve icon */}
      <div className="flex items-center justify-between text-sm text-gray-500 p-1">
        <div className="flex items-center gap-2">
          <p>30 Jan 2024</p>
          <p>*</p>
          <p>#asssdasd #assdasdsda #asdsadsdsa</p>
        </div>
        <div className="flex items-center gap-1">
          <p>5</p>
          <p>*</p>
        </div>
      </div>
      <h1 className="text-xl font-bold p-1">
        Unveiling the Secrets Beyond the Tourist Trails
      </h1>
      <p className="p-1 font-medium text-gray-400">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. A nesciunt, est
        reprehenderit aliquam quam in.
      </p>
      {/* user img and namek */}
      <div className="flex items-center gap-2 p-1">
        <img
          src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
          className="rounded-full w-10 h-10 object-cover"
        />
        <button>
          <span className="text-base font-semibold">Emirhan Yaman</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
