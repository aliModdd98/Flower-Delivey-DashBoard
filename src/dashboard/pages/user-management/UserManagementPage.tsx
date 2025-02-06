import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { getUsers, TUserFromBackend } from "../../../store/slices/userSlice";
import {
  RootState,
  useReduxDispatch,
  useReduxSelector,
} from "../../../store/store";
import { Button } from "../../components/button";
import { Card, CardContent, CardHeader } from "../../components/card";
import { Input } from "../../components/input";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/table";
import * as UserForms from "./components/user-forms";

export const UserManagementPage = () => {
  const { users, pagination, loading } = useReduxSelector(
    (state: RootState) => state.user
  );

  const dispatch = useReduxDispatch();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const [fieldSearch, setFieldSearch] = useState<string | undefined>(undefined);
  const [valueSearch, setValueSearch] = useState<string | undefined>(undefined);

  const [nameSearch, setNameSearch] = useState("");

  const totalPages = pagination.totalPages;
  const setCurrentPage = ({ page }: { page: number }) => {
    dispatch(
      getUsers({
        page,
        limit: rowsPerPage,
        field: fieldSearch,
        value: valueSearch,
      })
    );
  };

  useEffect(() => {
    dispatch(
      getUsers({
        page: 1,
        limit: rowsPerPage,
        field: fieldSearch,
        value: valueSearch,
      })
    );
  }, [dispatch, rowsPerPage, fieldSearch, valueSearch]);

  const columns: ColumnDef<TUserFromBackend, unknown>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "isAdmin",
      header: "Admin Status",
      filterFn: (row, columnId, filterValue) => {
        if (filterValue === "") return true;
        const cellValue = row.getValue<boolean>(columnId);
        return cellValue === (filterValue === "true");
      },
      cell: ({ row }) => {
        const isAdmin = row.getValue("isAdmin") as boolean;
        return (
          <span
            className={`rounded-full px-2 py-1 text-xs ${
              isAdmin ? "bg-green-500/25 text-green-500" : ""
            }`}
          >
            {isAdmin ? "Admin" : "User"}
          </span>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original as TUserFromBackend;
        return (
          <span>
            <UserForms.Remove userId={user._id} />
          </span>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination: {
        pageSize: rowsPerPage,
        pageIndex: pagination.currentPage - 1,
      },
    },
  });

  const searchByNameInput = useRef<HTMLInputElement | null>(null);

  const handleSearch = (field: string, value: string) => {
    setFieldSearch(field);
    setValueSearch(value);
  };

  const handleResetSearch = () => {
    setFieldSearch(undefined);
    setValueSearch(undefined);

    setNameSearch("");
  };

  const handleSearchByName = (field: string, value: string) => {
    setNameSearch(value);
    handleSearch(field, value);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-4">
        {/* First Column */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Show</span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value) => setRowsPerPage(parseInt(value))}
            >
              <SelectTrigger className="w-[70px] bg-white dark:bg-gray-800">
                <SelectValue placeholder={rowsPerPage} />
              </SelectTrigger>
              <SelectContent>
                {[1, 3, 10, 25, 50, 100].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm">entries</span>
          </div>
          <div>
            <Button onClick={() => handleResetSearch()}>Reset Search</Button>{" "}
            {/*to reset search */}
          </div>
        </div>

        {/* Second Column */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 max-md:flex-wrap">
            <Input
              placeholder="Search by name..."
              className="max-w-sm dark:placeholder:text-white bg-white dark:bg-gray-800"
              ref={searchByNameInput}
              defaultValue={nameSearch}
            />
            <Button
              onClick={() =>
                handleSearchByName(
                  "name",
                  searchByNameInput.current?.value as string
                )
              }
            >
              search
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="rounded-md min-h-14">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              table.getPrePaginationRowModel().rows?.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage({
                      page: Math.max(pagination.currentPage - 1, 1),
                    })
                  }
                  className={
                    pagination.currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
              {[...Array.from({ length: totalPages })].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage({ page: i + 1 })}
                    isActive={pagination.currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage({
                      page: Math.min(pagination.currentPage + 1, totalPages),
                    })
                  }
                  className={
                    pagination.currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
};
