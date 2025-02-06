import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../../lib/ajax/api";
import { handleApiError } from "../../../lib/utils";
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
import AddPopup from "./components/AddPopup";
import EditPopup from "./components/EditPopup";

interface Accessory {
  _id: number;
  title: string;
  image: string;
  stock: number;
  description: string;
  price: number;
  products_array: Product[];
}

export const Accessories: React.FC = () => {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [newAccessory, setNewAccessory] = useState<Accessory>({
    _id: 0,
    title: "",
    image: "",
    stock: 0,
    description: "",
    price: 0,
    products_array: [],
  });
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [fieldSearch, setFieldSearch] = useState<string | undefined>(undefined);
  const [valueSearch, setValueSearch] = useState<string | undefined>(undefined);

  const [titleSearch, setTitleSearch] = useState("");

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isEditPopupVisible, setEditPopupVisible] = useState(false);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/accessory`, {
          params: {
            page: currentPage,
            limit: rowsPerPage,
            field: fieldSearch,
            value: valueSearch,
          },
        });
        setAccessories(response.data.accessories);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        handleApiError(error);
      }
    };

    fetchAccessories();
  }, [currentPage, rowsPerPage, fieldSearch, valueSearch]);

  const handeleChangeRowPerPage = (newRowPerPage: number) => {
    setCurrentPage(1);
    setRowsPerPage(newRowPerPage);
  };

  const searchByTitleInput = useRef<HTMLInputElement | null>(null);

  const handleSearch = (field: string, value: string) => {
    setFieldSearch(field);
    setValueSearch(value);
  };

  const handleResetSearch = () => {
    setFieldSearch(undefined);
    setValueSearch(undefined);

    setTitleSearch("");
  };

  const handleSearchByTitle = (field: string, value: string) => {
    setTitleSearch(value);
    handleSearch(field, value);
  };

  const handleEdit = (id: number) => {
    const accessoryToEdit = accessories.find((item) => item._id === id);
    if (accessoryToEdit) {
      setSelectedAccessory(accessoryToEdit);
      setEditPopupVisible(true);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this accessory?"
    );
    if (!confirmation) {
      return; // Exit if the user cancels
    }

    try {
      const response = await api.delete(`/accessory/${id}`);
      if (response.status === 200) {
        // Remove the deleted accessory from the state
        setAccessories((prev) =>
          prev.filter((accessory) => accessory._id !== id)
        );

        toast.success("accessory added successfully");
      }
    } catch (error) {
      console.error("Error deleting accessory:", error);
    }
  };

  const updateAccessory = (updatedAccessory: Accessory) => {
    setAccessories((prev) =>
      prev.map((item) =>
        item._id === updatedAccessory._id ? updatedAccessory : item
      )
    );
  };

  const columns: ColumnDef<Accessory>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Title
        </div>
      ),
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <img
          src={import.meta.env.VITE_PUBLIC_API_BASE_URL + row.original.image}
          alt={row.original.title}
          className="h-10 w-10 rounded-md object-cover"
        />
      ),
    },
    {
      accessorKey: "products_array",
      header: "Products",
      cell: ({ row }) => (
        <div>
          {row.original.products_array?.map((product) => (
            <span key={product._id} className="block">
              {product.title}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => handleEdit(row.original._id)}>
            <Edit className="h-5 w-5 text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleDelete(row.original._id)}
          >
            <Trash className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: accessories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Card className="mb-7">
        <CardHeader className="flex items-center justify-between gap-4">
          {/* First Column */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm">Show</span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={(value) =>
                  handeleChangeRowPerPage(parseInt(value))
                }
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
              <Button onClick={() => handleResetSearch()}>Reset Search</Button>
            </div>
          </div>

          {/* Second Column */}
          <div className="flex flex-col gap-2">
            <div>
              <Button onClick={() => setPopupVisible(true)}>
                Add New Accessory
              </Button>
            </div>
            <div className="flex items-center gap-2 max-md:flex-wrap">
              <Input
                placeholder="Search by name..."
                className="max-w-sm dark:placeholder:text-white bg-white dark:bg-gray-800"
                ref={searchByTitleInput}
                defaultValue={titleSearch}
              />
              <Button
                onClick={() =>
                  handleSearchByTitle(
                    "title",
                    searchByTitleInput.current?.value as string
                  )
                }
              >
                search
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
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
              {accessories.length > 0 ? (
                table.getRowModel().rows.map((row) => (
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
                  <TableCell colSpan={columns.length}>
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {isPopupVisible && (
        <AddPopup
          //@ts-expect-error unknown
          setAccessories={setAccessories}
          setPopupVisible={setPopupVisible}
          newAccessory={newAccessory}
          //@ts-expect-error unknown
          setNewAccessory={setNewAccessory}
        />
      )}
      {isEditPopupVisible && selectedAccessory && (
        <EditPopup
          //@ts-expect-error unknown
          accessory={selectedAccessory}
          setPopupVisible={setEditPopupVisible}
          //@ts-expect-error unknown
          updateAccessory={updateAccessory}
        />
      )}
    </>
  );
};
