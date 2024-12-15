"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { Delete, Edit, View, ArrowUpDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Users() {
  const [userData, setUSerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sorting, setSorting] = useState({ column: null, order: null }); // For sorting
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    email: true,
    password: true,
    actions: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios("http://127.0.0.1:5000/users");
      setUSerData(result.data);
      setFilteredData(result.data);
    } catch (err) {
      console.log("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete("http://127.0.0.1:5000/userdelete/" + id);
      const newUserData = userData.filter((item) => item.id !== id);
      setUSerData(newUserData);
      setFilteredData(newUserData);
    } catch (err) {
      console.log("Error deleting user");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = userData.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleSort = (column) => {
    let order = "asc";
    if (sorting.column === column && sorting.order === "asc") {
      order = "desc";
    }
    setSorting({ column, order });

    const sortedData = [...filteredData].sort((a, b) => {
      if (a[column] < b[column]) return order === "asc" ? -1 : 1;
      if (a[column] > b[column]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredData(sortedData);
  };

  const toggleColumnVisibility = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  return (
    <div className="space-y-4">
      {/* Search and Column Visibility */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.keys(visibleColumns).map((col) => (
              <DropdownMenuCheckboxItem
                key={col}
                checked={visibleColumns[col]}
                onCheckedChange={() => toggleColumnVisibility(col)}
              >
                {col.charAt(0).toUpperCase() + col.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.id && (
              <TableHead className="cursor-pointer">
                #
                <ArrowUpDown className="inline-block ml-2" />
              </TableHead>
            )}
            {visibleColumns.id && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("id")}
              >
                Id
                <ArrowUpDown className="inline-block ml-2" />
              </TableHead>
            )}
            {visibleColumns.name && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name
                <ArrowUpDown className="inline-block ml-2" />
              </TableHead>
            )}
            {visibleColumns.email && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email
                <ArrowUpDown className="inline-block ml-2" />
              </TableHead>
            )}
            {visibleColumns.password && <TableHead>Password</TableHead>}
            {visibleColumns.actions && (
              <TableHead className="text-center">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((rs, index) => (
            <TableRow key={rs.id} className="bg-white border-b">
              {visibleColumns.id && <TableCell>{index + 1}</TableCell>}
              {visibleColumns.name && <TableCell>{rs.id}</TableCell>}
              {visibleColumns.name && <TableCell>{rs.name}</TableCell>}
              {visibleColumns.email && <TableCell>{rs.email}</TableCell>}
              {visibleColumns.password && <TableCell>{rs.password}</TableCell>}
              {visibleColumns.actions && (
                <TableCell className="flex gap-2">
                  <Button asChild variant="secondary">
                    <Link href={`/user/view/${rs.id}`}>
                      <Eye /> View
                    </Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href={`/user/edit/${rs.id}`}>
                      <Edit /> Edit
                    </Link>
                  </Button>
                  <Button
                    onClick={() => handleDelete(rs.id)}
                    variant="destructive"
                  >
                    <Delete /> Delete
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
