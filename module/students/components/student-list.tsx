"use client";

import ButtonPrimary from "@/components/ui/button-primary";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CirclePlus, EllipsisVertical, Loader2 } from "lucide-react";
import { useStudents } from "../hooks/useStudents";
import { usePaginationStore } from "@/store/use-pagination-store";
import { useEffect, useMemo } from "react";
import Pagination from "@/components/ui/pagination";
import { useUsersStore } from "../store/use-student-store";
import { Message } from "@/components/layout/message-box";

const TableHeading = [ "ID", "Student Name", "Registered Email", "Email Verified", "Role", "Created At", "Action"]

export default function StudentList() {

  const page = usePaginationStore((state) => state.page);
  const search = usePaginationStore((state) => state.search)

  const setUsers = useUsersStore((state) => state.setUsers);

  const {data: studentData, isPending, isError, refetch} = useStudents({
    page, limit: 20, search
  })

  const paginationData = useMemo(() => ({
    pages: studentData?.totalPages ?? 0,
    total: studentData?.total ?? 0,
    currentPage: page
  }), [studentData?.totalPages, studentData?.total, page])

  useEffect(() => {
    setUsers(studentData?.graphData || [])
  }, [studentData, setUsers])


  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="w-full  overflow-y-scroll rounded-md ">
        <Table>
          <TableHeader className="bg-emerald-800 font-[NeueMachina] font-bold hover:bg-emerald-900!">
            <TableRow>
              {TableHeading.map((heading, index) => (
                <TableHead 
                key={index} 
                className={`${index === 0 && "pl-4"} text-white tracking-wide`}>
                  {heading}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <div className=" fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            ): isError ? (
              <Message 
              message="Data Fetching Error" onReload={refetch} />
            ) : studentData.success && studentData.data.length === 0 ? (
              <Message
              icon={CirclePlus}
              message="Students Not Found..."
              />
            ) : studentData.success && studentData.data.length > 0 && (
              <>
              {studentData.data.map((student) => (
                <TableRow className="odd:bg-emerald-600/50 text-emerald-100 tracking-wide font-[Helvetica] font-semibold hover:even:bg-emerald-600 hover:odd:bg-emerald-600" 
                key={student.id}>
                  <TableCell className="pl-4">{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.emailVerified ? "Verified" : "Not Verified"}</TableCell>
                  <TableCell>{student.role}</TableCell>
                  <TableCell>{new Date(student.createdAt).toLocaleDateString("en-IN")}</TableCell>
                  <TableCell>
                  <ButtonPrimary size={"sm"} variant={"outline"} className="p-1 bg-transparent border-0 rounded-md">
                      <EllipsisVertical />
                  </ButtonPrimary>
                  </TableCell>
                </TableRow>
              ))}
              </>
            )}

          </TableBody>
        </Table>
      </div>

      {paginationData.pages > 1 && (
        <div
        className="w-full py-2 px-4">
          <Pagination
          pages={paginationData.pages}
          currentPage={paginationData.currentPage}
          total={paginationData.total}/>
        </div>
      )}
    </div>
  );
}