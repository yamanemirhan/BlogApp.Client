import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(50, { message: "Title can be a maximum of 50 characters." }),
  description: z
    .string()
    .min(1, { message: "Description is required." })
    .max(100, { message: "Description can be a maximum of 100 characters." }),
  content: z.any(),
  categoryId: z.number().min(0, { message: "Category is required." }),
  coverImageUrl: z.string().optional(),
  tagIds: z
    .array(z.number())
    .min(1, { message: "Select at least one tag." })
    .max(3, { message: "You can select up to 3 tags." }),
});

const CreatePostForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [coverImage, setCoverImage] = useState(null);

  const editor = useCreateBlockNote({
    uploadFile,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      categoryId: 0,
      coverImageUrl: "",
      contentImages: [],
      tagIds: [],
    },
  });

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

  const {
    mutate: createPostMutation,
    isError,
    isPending,
  } = useMutation({
    mutationFn: async (data) => {
      // Handle cover image upload
      let coverImageUrl = data.coverImageUrl;
      if (coverImage) {
        const formData = new FormData();
        formData.append("file", coverImage);
        try {
          const response = await axiosInstance.post("/image/upload", formData);
          coverImageUrl = response.data.secureUrl;
        } catch (error) {
          console.error("Error uploading cover image:", error);
          throw error;
        }
      }

      const serializedContent = JSON.stringify(editor.document);
      const parsedContent = JSON.parse(serializedContent);

      const contentImageUrls = parsedContent
        .filter((item) => item.type === "image" && item.props.url)
        .map((item) => item.props.url);

      // Upload content images to Cloudinary
      const uploadedContentImages = await Promise.all(
        contentImageUrls.map(async (url) => {
          try {
            // Fetch the image from the temporary URL
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new File([blob], "content-image.png", {
              type: blob.type,
            });

            // Upload to Cloudinary
            const formData = new FormData();
            formData.append("file", file);
            const uploadResponse = await axiosInstance.post(
              "/image/upload",
              formData
            );
            return uploadResponse.data.secureUrl;
          } catch (error) {
            console.error("Error uploading content image:", error);
            throw error;
          }
        })
      );

      const postData = {
        title: data.title,
        description: data.description,
        content: serializedContent,
        categoryId: data.categoryId,
        coverImageUrl,
        tagIds: data.tagIds,
        contentImages: uploadedContentImages,
      };

      const res = await axiosInstance.post("/post", postData);
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Post Created",
        description: "Your post was created successfully!",
        variant: "success",
      });
      // todo:
      navigate("/profile/me");
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Something went wrong!",
        variant: "error",
      });
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverImage(file);
    }
  };

  async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axiosInstance.post("/image/upload", formData);
      console.log("response: ", response);
      return response.data.secureUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  // editor
  // async function uploadFile(file) {
  //   const body = new FormData();
  //   body.append("file", file);

  //   const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
  //     method: "POST",
  //     body: body,
  //   });
  //   return (await ret.json()).data.url.replace(
  //     "tmpfiles.org/",
  //     "tmpfiles.org/dl/"
  //   );
  // }

  const onSubmit = (values) => {
    createPostMutation(values);
  };

  return (
    <div className="text-white space-y-6">
      <h1 className="text-3xl text-center">Create Post</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 text-black"
        >
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-white">Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter post title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-white">
                  Description
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter post description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Field */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-white">Category</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString() || "0"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue>
                        {categories?.data?.find(
                          (cat) => cat.categoryId === field.value
                        )?.name || "Select a category"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.data?.map((cat) => (
                      <SelectItem
                        className="text-black"
                        key={cat.categoryId}
                        value={cat.categoryId.toString()}
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover Image Field */}
          <FormItem>
            <FormLabel className="text-lg text-white">Cover Image</FormLabel>
            <FormControl>
              <Input type="file" onChange={handleFileChange} />
            </FormControl>
          </FormItem>

          {/* Tags Field */}
          <FormField
            control={form.control}
            name="tagIds"
            render={({ field }) => (
              <FormItem className="text-white">
                <div className="flex md:items-center gap-4 flex-col md:flex-row">
                  <FormLabel className="text-lg text-white">Tags</FormLabel>
                  {tags?.data?.map((tag) => (
                    <div key={tag.tagId} className="flex items-center gap-1">
                      <FormControl>
                        <Checkbox
                          className="w-5 h-5"
                          checked={field.value?.includes(tag.tagId)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, tag.tagId])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== tag.tagId
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{tag.name}</FormLabel>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Editor for Content */}
          <div className="flex flex-col gap-4">
            <FormLabel className="text-lg text-white">Content</FormLabel>
            <div className="border border-gray-300 rounded-md">
              <BlockNoteView theme={"dark"} editor={editor} />
            </div>
          </div>
          {/* Submit Button */}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Post"}
          </Button>

          {isError && <p>Error creating post.</p>}
        </form>
      </Form>
    </div>
  );
};

export default CreatePostForm;
