"use client";

import React, { useState, useEffect } from "react";
import axios from "axios"; // npm install axios https://www.npmjs.com/package/axios
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button"; // Import ShadCN Button for navigation or actions

export default function ViewUserPage() {
  const { id } = useParams();
  console.log(id);

  const [user, setUser] = useState([]);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const result = await axios.get(`http://127.0.0.1:5000/userdetails/${id}`);
      console.log(result.data);
      setUser(result.data);
    } catch (err) {
      console.log("Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-5">
      <h1 className="text-2xl text-center mb-2">View User</h1>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="table-auto w-full text-sm text-gray-700">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">S No.</th>
              <th className="px-4 py-2 text-left">Full Name</th>
              <th className="px-4 py-2 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">{user.id}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}
