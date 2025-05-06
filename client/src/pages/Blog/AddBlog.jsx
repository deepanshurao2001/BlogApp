import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import Dropzone from "react-dropzone";

import Editor from "@/components/Editor";
import { useSelector } from "react-redux";
import { RouteBlog } from "@/helpers/RouteName";

const AddBlog = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  //console.log(user.user._id);

  const {
    data: categoryData,
    loading,
    error,
  } = useFetch(`${getEnv("VITE_API_BASE_URL")}/category/all-category`, {
    method: "get",
    credentials: "include",
  });

  const formSchema = z.object({
    category: z.string().min(3, "Category must be at least 3 character log"),
    title: z.string().min(3, "Title must be at least 3 character log"),
    slug: z.string().min(3, "Slug must be at least 3 character long"),
    blogContent: z
      .string()
      .min(3, "Blog content must be at least 3 character long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title: "",
      slug: "",
      blogContent: "",
    },
  });
  const blogTitle = form.watch("title");

  useEffect(() => {
    if (blogTitle) {
      const slug = slugify(blogTitle, { lower: true });
      form.setValue("slug", slug);
    }
  }, [blogTitle]);

  //console.log(getEnv("VITE_API_BASE_URL"));

  async function onSubmit(values) {
    // console.log(values);

    try {
      //      console.log(values);
      const newValues = { ...values, author: user.user._id };
      if (!file) {
        showToast("error", "Featured image required");
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(newValues));

      const response = await fetch(`${getEnv("VITE_API_BASE_URL")}/blog/add`, {
        method: "post",
        credentials: "include",
        body: formData,
      });
      console.log(response);

      const data = await response.json();
      //console.log(data);

      if (!response.ok) {
        return showToast("error", data.message);
      }
      form.reset();
      setFile();
      setPreview();
      navigate(RouteBlog);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    }
  }

  const handleEditorData = (event, editor) => {
    const data = editor.getData();
    // console.log(data);
    form.setValue("blogContent", data);
  };

  const [filePreview, setPreview] = useState();
  const [file, setFile] = useState();

  const handleFileSelection = (files) => {
    console.log(files);
    const file = files[0];
    const preview = URL.createObjectURL(file);
    setFile(file);
    setPreview(preview);
  };

  return (
    <div>
      <Card className="pt-5 ">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">Add Blog</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryData &&
                              categoryData.category.length > 0 &&
                              categoryData.category.map((category) => (
                                <SelectItem
                                  key={category._id}
                                  value={category._id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            <SelectItem value="light">Light</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter blog title" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3">
                <span className="mb-2 block">Featured Image</span>
                <Dropzone
                  onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div className="flex justify-center items-center w-36 h-28 border-2 border-dashed rounded overflow-hidden">
                        <img
                          src={filePreview}
                          alt=""
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </Dropzone>
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="blogContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blog Content</FormLabel>
                      <FormControl>
                        <div className="w-full overflow-x-auto sm:overflow-visible max-w-full">
                          <Editor
                            props={{
                              initialData: "",
                              onChange: handleEditorData,
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBlog;
