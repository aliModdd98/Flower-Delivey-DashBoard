import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Eye,
  LoaderIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllOrdersThunk, Order } from "../../../store/slices/orderSlice";
import { useReduxDispatch, useReduxSelector } from "../../../store/store";
import { Button } from "../../components/button";
import { Card, CardContent, CardHeader } from "../../components/card";
import { Input } from "../../components/input";
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
import * as OrdersForms from "./components/order-forms";

export const OrdersPage = () => {
  const { orders, isPending, pagination } = useReduxSelector(
    (state) => state.orders
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const setCurrentPage = ({ page }: { page: number }) => {
    dispatch(getAllOrdersThunk({ page, limit: rowsPerPage }));
  };
  const dispatch = useReduxDispatch();
  const totalPages = pagination.totalPages;

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "_id",
      header: "id",
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Total
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "isDone",
      header: "status",
      filterFn: (row, columnId, filterValue) => {
        const cellValue = row.getValue(columnId);
        const isDone = filterValue === "true";
        return cellValue === isDone;
      },
      cell: ({ row }) => {
        const isDone = row.getValue("isDone") as boolean;
        return (
          <span
            className={`rounded-full text-nowrap px-2 py-1 text-xs ${
              isDone
                ? "bg-purple-500/25  text-purple-500"
                : "bg-amber-400/25 text-amber-400"
            }`}
          >
            {isDone ? "done" : "in progress"}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            CreatedAt
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        return <span className={` px-2 py-1 text-xs`}>{createdAt}</span>;
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Link to={`${order._id}`}>
              <Eye className=" size-4" />
            </Link>
            <OrdersForms.Remove rowsPerPage={rowsPerPage} orderId={order._id} />
            <OrdersForms.ToggleStatusButton order={order} />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageSize: rowsPerPage,
        pageIndex: pagination.currentPage - 1,
      },
    },
  });
  useEffect(() => {
    dispatch(
      getAllOrdersThunk({ page: pagination.currentPage, limit: rowsPerPage })
    );
  }, [dispatch, pagination.currentPage, rowsPerPage]);

  return (
    <Card className="relative">
      <CardHeader className="flex items-end justify-end gap-4">
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
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
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm">entries</span>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2 max-md:flex-wrap">
            <Input
              placeholder="Search by order id..."
              value={(table.getColumn("_id")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("_id")?.setFilterValue(event.target.value)
              }
              className="max-w-sm dark:placeholder:text-white bg-white dark:bg-gray-800"
            />
            <Select
              value={
                (table.getColumn("isDone")?.getFilterValue() as string) ?? "all"
              }
              onValueChange={(value) =>
                table
                  .getColumn("isDone")
                  ?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-[200px]  bg-white dark:bg-gray-800">
                <SelectValue placeholder="Filter by isDone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Done</SelectItem>
                <SelectItem value="false">in progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className=" relative rounded-md">
        <Table>
          {isPending ? (
            <div className="h-40 flex justify-center items-center">
              <LoaderIcon />
            </div>
          ) : (
            <>
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
                {orders.length > 0 ? (
                  table.getPrePaginationRowModel().rows?.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
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
            </>
          )}
        </Table>
        <div className="flex items-center justify-between py-4">
          <div className="text-nowrap text-sm text-muted-foreground">
            Showing{" "}
            {table.getPrePaginationRowModel().rows?.length +
              (pagination.currentPage - 1) * rowsPerPage}
            of {pagination.totalOrders} entries
          </div>
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
