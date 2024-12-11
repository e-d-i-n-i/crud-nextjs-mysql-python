"use client";

import React, { useEffect, useState } from "react";
import axios from "axios"; //npm install axios https://www.npmjs.com/package/axios
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Delete, Edit, View } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Users() {
  const [userData, setUSerData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios("http://127.0.0.1:5000/users");
      console.log(result.data);
      setUSerData(result.data);
    } catch (err) {
      console.log("somthing Wrong");
    }
  };

  const handleDelete = async (id) => {
    console.log(id);
    await axios.delete("http://127.0.0.1:5000/userdelete/" + id);
    const newUserData = userData.filter((item) => {
      return item.id !== id;
    });
    setUSerData(newUserData);
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="py-3 px-6">#</TableHead>
          <TableHead className="py-3 px-6">Name</TableHead>
          <TableHead className="py-3 px-6">Email</TableHead>
          <TableHead className="py-3 px-6">Password</TableHead>
          <TableHead className="py-3 px-6 text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userData.map((rs, index) => (
          <TableRow key={rs.id} className="bg-white border-b">
            <TableCell className="py-3 px-6">{index + 1}</TableCell>
            <TableCell className="py-3 px-6">{rs.name}</TableCell>
            <TableCell className="py-3 px-6">{rs.email}</TableCell>
            <TableCell className="py-3 px-6">{rs.password}</TableCell>
            <TableCell className="flex justify-center gap-1 py-3">
              <Button asChild>
                <Link href={`/user/view/${rs.id}`} className="btn btn-info">
                  <View /> View
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/user/edit/${rs.id}`} className="btn btn-primary">
                  <Edit /> Edit
                </Link>
              </Button>
              <Button onClick={() => handleDelete(rs.id)} variant="destructive">
                <Delete /> Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
