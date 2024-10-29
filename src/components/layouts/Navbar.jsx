import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, BadgePlus } from "lucide-react";
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["getProfile"],
  });

  const { mutate: logoutMutation } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axiosInstance.post("/auth/logout");
        return res.data;
      } catch (error) {
        throw error.response
          ? error.response.response.data
          : new Error("Something went wrong!");
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["getProfile"], null);
      toast({
        title: "Logout Successful",
        description: "Logged out successfully!",
        status: "success",
        variant: "success",
      });
      navigate("/login");
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Something went wrong!",
        status: "error",
        variant: "error",
      });
    },
  });

  const OnLogoutClick = () => {
    logoutMutation();
    setIsProfileDropdownOpen(false);
  };

  const OnProfileClick = () => {
    setIsProfileDropdownOpen(false);
    navigate("/profile/me");
  };

  if (isLoading) return null;

  return (
    <nav className="p-5 h-20 bg-black w-full flex items-center text-white fixed z-10">
      <div className="flex items-center justify-between w-full">
        {/* left */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-1">
            {/* logo */}
            <NavLink to={"/"}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwU6XX_4Gc4TSTgw_JLmRrkBhnygCrVpl8CQ&s"
                alt=""
                className="w-24 h-8 object-cover"
              />
            </NavLink>
          </div>
          {/* navitems */}
          <div className="flex items-center gap-4 font-semibold">
            <NavLink>About</NavLink>
            <Link>Smt</Link>
          </div>
        </div>
        {/* right */}
        <div className="flex items-center gap-24">
          <div className="flex items-center gap-4 relative">
            {/* profile dropdown */}
            <div
              className={`rounded-md absolute top-14 right-0 bg-zinc-900 border-black shadow-md w-full flex flex-col gap-4 overflow-hidden transition-all duration-300 ${
                isProfileDropdownOpen ? "max-h-40 p-2" : "max-h-0 p-0"
              }`}
            >
              <button
                onClick={OnProfileClick}
                className="w-full text-start border-b hover:bg-slate-100 hover:text-black hover:rounded-sm p-1"
              >
                Profile
              </button>
              <button
                onClick={OnLogoutClick}
                className="w-full text-start border-b hover:bg-red-700 hover:border-b-red-700 hover:rounded-sm p-1"
              >
                Logout
              </button>
            </div>

            {authUser ? (
              <div className="flex items-center gap-4">
                <Link to={"/post/create"}>
                  <BadgePlus size={35} />
                </Link>
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center gap-2 border border-slate-500 rounded-md py-2 px-4 bg-slate-800"
                >
                  {/* usr image */}
                  <img
                    src={authUser?.profileImageUrl}
                    className="w-8 h-8 rounded-full"
                  />
                  {/* username */}
                  {authUser?.username}
                  {isProfileDropdownOpen ? <ArrowUp /> : <ArrowDown />}
                </button>
              </div>
            ) : (
              <>
                <Link to={"/login"} className="font-semibold">
                  Log In
                </Link>
                <button className="border border-purple-800 shadow-lg hover:bg-violet-800 hover:border-violet-800 py-1 px-2 rounded-lg bg-purple-800 text-white">
                  <Link to={"/signup"}>Sign Up</Link>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
