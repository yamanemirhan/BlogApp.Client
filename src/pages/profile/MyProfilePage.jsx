import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { formatDate } from "@/lib/formatDate";
import Posts from "@/components/posts/Posts";
import { PencilIcon, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(50, { message: "Username can be maximum 20 characters." }),
});

const MyProfilePage = () => {
  const { toast } = useToast();
  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState(null);

  const usernameForm = useForm({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    },
  });

  const { data: authUser, refetch: refetchUser } = useQuery({
    queryKey: ["getProfile"],
    queryFn: async () => {
      const res = await axiosInstance.get("/user/me");
      return res.data;
    },
  });

  const { mutate: updateUsername } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.put("/user/update", {
        username: data.username,
      });
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Username Updated",
        description: "Your username has been updated successfully!",
        variant: "success",
      });
      setIsUsernameDialogOpen(false);
      refetchUser();
    },
    onError: (err) => {
      toast({
        title: "Error",
        description:
          err?.response?.data?.message || "Failed to update username",
        variant: "error",
      });
    },
  });

  const { mutate: updateProfileImage } = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const uploadResponse = await axiosInstance.post(
        "/image/upload",
        formData
      );
      const imageUrl = uploadResponse.data.secureUrl;
      const res = await axiosInstance.put("/user/update", {
        profileImageUrl: imageUrl,
      });
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Profile Image Updated",
        description: "Your profile image has been updated successfully!",
        variant: "success",
      });
      setIsImageDialogOpen(false);
      refetchUser();
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update profile image",
        variant: "error",
      });
    },
  });

  const { mutate: removeProfileImage } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.put("/user/update", {
        profileImageUrl:
          "https://res.cloudinary.com/dcj1bb8vk/image/upload/v1728852537/blogapp/default-user_uo85fb.jpg",
      });
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Profile Image Removed",
        description: "Your profile image has been removed",
        variant: "success",
      });
      setIsImageDialogOpen(false);
      refetchUser();
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfileImage(file);
    }
  };

  const handleImageUpdate = () => {
    if (newProfileImage) {
      updateProfileImage(newProfileImage);
    }
  };

  const customQueryFn = async () => {
    const url = `/post/user/id/${authUser?.id}`;
    await new Promise((resolve) => setTimeout(resolve, 500));
    const res = await axiosInstance.get(url);
    return res.data.reverse();
  };

  if (!authUser) return null;

  return (
    <div className="text-white">
      <div className="flex flex-col gap-2">
        {/* Profile Image Section */}
        <div className="relative w-80 h-80 mx-auto group">
          <img
            src={authUser.profileImageUrl || "/default-avatar.png"}
            className="w-full h-full rounded-full object-cover"
            alt="Profile"
          />
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="absolute inset-0 m-auto w-12 h-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                variant="secondary"
              >
                <Camera className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Profile Picture</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                <div className="flex justify-between">
                  <Button
                    onClick={handleImageUpdate}
                    disabled={!newProfileImage}
                  >
                    Update Image
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => removeProfileImage()}
                  >
                    Remove Image
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Username Section */}
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-4xl text-center">{authUser.username}</h2>
          <Dialog
            open={isUsernameDialogOpen}
            onOpenChange={setIsUsernameDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-white/10">
                <PencilIcon className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Username</DialogTitle>
              </DialogHeader>
              <Form {...usernameForm}>
                <form
                  onSubmit={usernameForm.handleSubmit((data) => {
                    if (data.username != authUser.username)
                      updateUsername(data);
                  })}
                  className="space-y-4"
                >
                  <FormField
                    control={usernameForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter new username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Update Username</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <p className="text-gray-400 text-center">
          Member since {formatDate(authUser.createdAt).split(" at")[0]}
        </p>
      </div>

      <div className="flex flex-col gap-2 max-w-[1536px] mx-auto my-10">
        <Posts
          queryKey={["userPosts", authUser.id]}
          baseUrl={`/post/user/id/${authUser.id}`}
          customQueryFn={customQueryFn}
          showFilters={false}
        />
      </div>
    </div>
  );
};

export default MyProfilePage;
