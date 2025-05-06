import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  RouteAddCategory,
  RouteBlogAdd,
  RouteBlogEdit,
  RouteEditCategory,
} from "@/helpers/RouteName";

import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Loading from "@/components/Loading";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";
import { deleteData } from "@/helpers/handleDelete";
import { showToast } from "@/helpers/showToast";
import moment from "moment";

const BlogDetails = () => {
  const [refreshData, setRefreshData] = useState(false);

  const {
    data: blogData,
    loading,
    error,
  } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/get-all`,
    {
      method: "get",
      credentials: "include",
    },
    [refreshData]
  );

  console.log(blogData);

  const handleDelete = (id) => {
    const response = deleteData(
      `${getEnv("VITE_API_BASE_URL")}/blog/delete/${id}`
    );
    if (response) {
      setRefreshData(!refreshData);
      showToast("success", "Data deleted");
    } else {
      showToast("error", "Data not Deleted");
    }
  };

  if (loading) return <Loading />;
  return (
    <div>
      <Card>
        <CardContent>
          <CardHeader>
            <div>
              <Button>
                <Link to={RouteBlogAdd}>Add Blog</Link>
              </Button>
            </div>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Dated</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogData && blogData.blog.length > 0 ? (
                blogData.blog.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell>{blog?.author?.name}</TableCell>
                    <TableCell>{blog?.category?.name}</TableCell>
                    <TableCell>{blog?.title}</TableCell>
                    <TableCell>{blog?.slug}</TableCell>
                    <TableCell>
                      {moment(blog?.createdAt).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        className="hover:bg-violet-500 hover:text-white"
                        asChild
                      >
                        <Link to={RouteBlogEdit(blog._id)}>
                          <FaEdit />
                        </Link>
                      </Button>
                      <Button
                        onClick={() => handleDelete(blog._id)}
                        variant="outline"
                        className="hover:bg-violet-500 hover:text-white"
                      >
                        <MdDelete />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="3">Data not found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogDetails;
