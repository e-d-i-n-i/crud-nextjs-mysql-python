import Link from "next/link";
import TableData from "../components/tabledata";
import { Suspense } from "react";
import { Spinner } from "../components/spinner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full py-5 lg:flex justify-center flex-col items-center px-4 sm:px-8 lg:px-20">
      <div className="bg-gradient-to-r from-black to-purple-500 text-white py-6 w-full text-center mb-5">
        <h1 className="text-4xl font-bold">
          Next.js 14 Python Flask CRUD Mysql
        </h1>
      </div>
      <div className="mb-2 w-full flex justify-end">
        <Button asChild>
          <Link
            href="/user/create"
            className="btn btn-primary hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
          >
            <Plus /> Create New User
          </Link>
        </Button>
      </div>
      <div className=" shadow-md rounded-lg border border-gray-200 p-4 bg-white">
        <Suspense fallback={<Spinner />}>
          <TableData />
        </Suspense>
      </div>
    </div>
  );
}
