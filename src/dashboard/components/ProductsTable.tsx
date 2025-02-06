import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Edit2, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProduct, getProducts } from "../../store/slices/productSlice";
import { useReduxDispatch, useReduxSelector } from "../../store/store";
import { Card, CardContent, CardHeader } from "./card";
import DeleteModal from "./DeleteModal";
import { Input } from "./input";
import LoadingSpinner from "./LoadingSpinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface Product {
  priceAfterDiscount: string;
  discount?: string;
  quantity: string;
  _id: string;
  title: string;
  price: number;
  stock: number;
  description: string;
  image?: string;
  category_id: number;
  accessory_id?: number;
  created_at: string;
  updated_at: string;
}

const ProductsTable = () => {
  const navigate = useNavigate();
  const dispatch = useReduxDispatch();
  const { products, loading, pagination } = useReduxSelector(
    (state) => state.product
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [show, setShow] = useState(false);
  const [id, setId] = useState<string>("");
  const [rowsPerPage] = useState(5);
  const totalPages = pagination?.totalPages;

  const handleRowClick = (rowData: Product) => {
    navigate(`/dashboard/products/product/${rowData._id}`);
  };

  useEffect(() => {
    dispatch(getProducts({ page: 1, limit: rowsPerPage })).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        console.log(totalPages);
      }
    });
  }, [dispatch, rowsPerPage, totalPages]);

  const deleteProductFunc = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setId(id);
    setShow(true);
  };

  const onConfirm = async (id: string) => {
    await dispatch(deleteProduct(id));
    setShow(false);
  };

  const editProduct = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/dashboard/products/edit/${id}`);
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    const truncated = text.substring(0, maxLength);
    return truncated.substring(0, truncated.lastIndexOf(" ")) + "...";
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "title",
      header: "Title",
      filterFn: "includesString",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "stock",
      header: "Stock",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => truncateText(row.getValue("description"), 40),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `$${row.getValue("price")}`,
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="p-2 rounded-full text-blue-500 hover:bg-primary"
            onClick={(e) => editProduct(e, row.original._id)}
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            className="p-2 rounded-full text-red-500 hover:bg-primary"
            onClick={(e) => deleteProductFunc(e, row.original._id)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  const setCurrentPage = ({ page }: { page: number }) => {
    dispatch(getProducts({ page, limit: rowsPerPage }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Input
            placeholder="Search by title..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("title")?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
        </div>
      </CardHeader>

      <CardContent>
        {products?.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            No Products Found
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
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
                          {header.column.getIsSorted() && (
                            <span className="ml-1">
                              {header.column.getIsSorted() === "asc"
                                ? "▲"
                                : "▼"}
                            </span>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleRowClick(row.original)}
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
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4">
              {loading ? (
                <div>Loading...</div>
              ) : (
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
                          (pagination?.currentPage || 1) === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setCurrentPage({ page: i + 1 })}
                          isActive={(pagination?.currentPage || 1) === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage({
                            page: Math.min(
                              pagination.currentPage + 1,
                              totalPages
                            ),
                          })
                        }
                        className={
                          (pagination?.currentPage || 1) === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </>
        )}
      </CardContent>

      {show && (
        <DeleteModal
          onClose={() => setShow(false)}
          onConfirm={onConfirm}
          id={id}
        />
      )}
    </Card>
  );
};

export default ProductsTable;
