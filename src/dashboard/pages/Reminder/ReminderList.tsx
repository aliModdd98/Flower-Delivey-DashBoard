import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  PaginationState,
  flexRender,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import React, { useState } from "react";

interface Reminder {
  id: string;
  email: string;
  name: string;
  phone: string;
}
interface ReminderListProps {
  reminders: Reminder[];
}

const ReminderList: React.FC<ReminderListProps> = ({ reminders }) => {
  const [data] = useState<Reminder[]>(reminders);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const pagination = {
    pageIndex,
    pageSize,
  };

  const columns: ColumnDef<Reminder>[] = [
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    pageCount: Math.ceil(data.length / pageSize),
    manualPagination: false,
  });

  return (
    <>
      <div className="p-4 dark:bg-[#020817] shadow-lg dark:text-white rounded-lg">
        <div className="w-full overflow-auto">
          {data.length === 0 ? (
            <div className="text-center text-gray-500 p-4">No Data Found</div>
          ) : (
            <>
              <table className="w-full border-collapse border border-gray-600 text-left">
                <thead className="dark:bg-gray-800">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="p-2 border hover:underline border-gray-600 cursor-pointer"
                          onClick={() =>
                            header.column.toggleSorting(
                              header.column.getIsSorted() === "asc"
                            )
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted()
                            ? header.column.getIsSorted() === "asc"
                              ? " ▲"
                              : " ▼"
                            : ""}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="dark:hover:bg-gray-700 cursor-pointer hover:bg-gray-200"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="p-2 border border-gray-600"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between p-4">
                <span className="text-sm">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>
                <div className="flex gap-2">
                  <button
                    className="p-1 border border-gray-600 rounded dark:hover:bg-gray-800 disabled:opacity-50"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronsLeft size={20} />
                  </button>
                  <button
                    className="p-1 border border-gray-600 rounded dark:hover:bg-gray-800 disabled:opacity-50"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    className="p-1 border border-gray-600 rounded dark:hover:bg-gray-800 disabled:opacity-50"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <ChevronRight size={20} />
                  </button>
                  <button
                    className="p-1 border border-gray-600 rounded dark:hover:bg-gray-800 disabled:opacity-50"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <ChevronsRight size={20} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ReminderList;
