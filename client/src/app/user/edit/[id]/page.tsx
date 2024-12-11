"use client";

import React, { useState, useEffect } from "react";
import axios from "axios"; // npm install axios https://www.npmjs.com/package/axios
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input"; // Import ShadCN UI components
import { Button } from "@/components/ui/button"; // Import ShadCN UI components

export default function ViewUserPage() {
  const { id } = useParams();
  console.log(id);

  const [userField, setUserField] = useState({
    name: "",
    email: "",
    password: "", // Initialize password field as well
  });

  const [loading, setLoading] = useState(true); // Loading state to handle async data fetching

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const result = await axios.get(`http://127.0.0.1:5000/userdetails/${id}`);
      console.log(result.data);
      setUserField(result.data);
      setLoading(false); // Set loading to false once data is fetched
    } catch (err) {
      console.log("Something went wrong");
      setLoading(false); // Set loading to false even on error
    }
  };

  const changeUserFieldHandler = (e) => {
    const { name, value } = e.target;
    setUserField((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5000/userupdate/${id}`, userField);
      window.location.href = "/";
    } catch (err) {
      console.log("Something went wrong");
    }
  };

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-5">
      <h1 className="text-2xl text-center mb-2">Edit Form</h1>
      <form onSubmit={onSubmitChange}>
        <div className="mb-3 mt-3">
          <label className="block text-sm font-medium text-gray-900">ID:</label>
          <Input
            type="text"
            id="id"
            name="id"
            value={id}
            disabled
            className="input input-bordered input-primary w-full max-w-xs"
          />
        </div>
        <div className="mb-3 mt-3">
          <label className="block text-sm font-medium text-gray-900">
            Full Name:
          </label>
          <Input
            type="text"
            className="w-full max-w-xs"
            placeholder="Enter Your Full Name"
            name="name"
            value={userField.name}
            onChange={changeUserFieldHandler}
          />
        </div>
        <div className="mb-3 mt-3">
          <label className="block text-sm font-medium text-gray-900">
            Email:
          </label>
          <Input
            type="email"
            className="w-full max-w-xs"
            placeholder="Enter email"
            name="email"
            value={userField.email}
            onChange={changeUserFieldHandler}
          />
        </div>
        <div className="mb-3 mt-3">
          <label className="block text-sm font-medium text-gray-900">
            Password:
          </label>
          <Input
            type="text"
            className="w-full max-w-xs"
            placeholder="Enter password"
            name="password"
            value={userField.password}
            onChange={changeUserFieldHandler}
          />
        </div>
        <Button type="submit" className="w-full mt-4">
          Update
        </Button>
      </form>
    </div>
  );
}
