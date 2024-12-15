"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Delete, Edit, Eye, ChevronDown } from "lucide-react";
import { Spinner } from "@/components/spinner";

const initialColumns = [
  { id: "index", label: "#", visible: true },
  { id: "name", label: "Name", visible: true },
  { id: "email", label: "Email", visible: true },
  { id: "password", label: "Password", visible: true },
  { id: "actions", label: "Actions", visible: true },
];

export default function Users() {
  const [userData, setUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [columns, setColumns] = useState(initialColumns);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:5000/users");
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/userdelete/${id}`);
      setUserData((prevData) => prevData.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filteredData = userData.filter((user) =>
    ["name", "email", "password"].some((key) =>
      user[key]?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const toggleColumnVisibility = (id: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === id ? { ...col, visible: !col.visible } : col
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (!userData.length) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        No users found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Filter and Column Toggle */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-1 w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            {columns.map((col) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={col.visible}
                onCheckedChange={() => toggleColumnVisibility(col.id)}
              >
                {col.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 p-4 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {columns
                .filter((col) => col.visible)
                .map((col) => (
                  <TableHead key={col.id}>{col.label}</TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((user, index) => (
              <TableRow key={user.id}>
                {columns.map((col) => {
                  if (!col.visible) return null;

                  switch (col.id) {
                    case "index":
                      return <TableCell key={col.id}>{index + 1}</TableCell>;
                    case "name":
                      return <TableCell key={col.id}>{user.name}</TableCell>;
                    case "email":
                      return <TableCell key={col.id}>{user.email}</TableCell>;
                    case "password":
                      return (
                        <TableCell key={col.id}>{user.password}</TableCell>
                      );
                    case "actions":
                      return (
                        <TableCell key={col.id} className="flex gap-2">
                          <Button asChild variant="secondary" size="sm">
                            <Link href={`/user/view/${user.id}`}>
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button asChild variant="primary" size="sm">
                            <Link href={`/user/edit/${user.id}`}>
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button
                            onClick={() => handleDelete(user.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Delete className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </TableCell>
                      );
                    default:
                      return null;
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
