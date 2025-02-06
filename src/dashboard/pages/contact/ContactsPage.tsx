import { DialogClose } from "@radix-ui/react-dialog";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Loader2,
  Trash2,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../components/button";
import { Card, CardContent, CardHeader } from "../../components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/dialog";
import { Input } from "../../components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/table";
import { Switch } from "../../components/switch";
import { toast } from "react-toastify";
import { handleApiError } from "../../../lib/utils";
import { api } from "../../../lib/ajax/api";
import LoadingSpinner from "../../components/LoadingSpinner";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            contact.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-4">
          <DialogClose>Cancel</DialogClose>
          <Button onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
const apiVersion = import.meta.env.VITE_PUBLIC_API_VERSION;

interface Contact {
  _id: number;
  name: string;
  isChecked: boolean;
  user_id: {
    name: string;
    email: string;
    phone: string;
  };
}

export const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<"all" | "checked" | "unchecked">("all");

  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    id: number | null;
  }>({ isOpen: false, id: null });

  const [fieldSearch, setFieldSearch] = useState<string | undefined>(undefined);
  const [valueSearch, setValueSearch] = useState<string | undefined>(undefined);

  const [nameSearch, setNameSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await api.get("/contact", {
          params: {
            page: currentPage,
            limit: 5,
            field: fieldSearch,
            value: valueSearch,
          },
        });
        const { contacts, pagination } = response.data.data;

        setContacts(contacts);
        setTotalPages(pagination?.totalPages || 1);
        setIsLoading(false);
      } catch (error) {
        handleApiError(error);
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, [currentPage, fieldSearch, valueSearch]);

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

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      if (filter === "all") return true;
      return filter === "checked" ? contact.isChecked : !contact.isChecked;
    });
  }, [contacts, filter]);

  const handleToggleChecked = async (id: number) => {
    try {
      setIsUpdating(id);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const contact = contacts.find((item) => item._id === id);
      if (contact) {
        const updatedContact = {
          ...contact,
          isChecked: !contact.isChecked,
        };

        await axios.put(
          `${baseUrl}/api/${apiVersion}/contact/${id}`,
          updatedContact,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setContacts((prev) =>
          prev.map((item) => (item._id === id ? updatedContact : item))
        );
      }
    } catch (error) {
      console.error("Error updating contact:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteContact = async (id: number) => {
    try {
      setIsDeleting(id);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      await axios.delete(`${baseUrl}/api/${apiVersion}/contact/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setContacts((prev) => prev.filter((contact) => contact._id !== id));
      setDeleteConfirmation({ isOpen: false, id: null });
      toast.success("contact deleted successfully");
    } catch (error) {
      handleApiError(error);
      console.error("Error deleting contact:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const columns: ColumnDef<Contact>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Name
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => row.original.user_id?.name,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.user_id?.email,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => row.original.user_id?.phone,
    },
    {
      accessorKey: "isChecked",
      header: "Checked",
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          {isUpdating === row.original._id ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          ) : (
            <Switch
              checked={row.original.isChecked}
              onCheckedChange={() => handleToggleChecked(row.original._id)}
              disabled={isUpdating === row.original._id}
            />
          )}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          onClick={() =>
            setDeleteConfirmation({ isOpen: true, id: row.original._id })
          }
          disabled={isDeleting === row.original._id}
        >
          {isDeleting === row.original._id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredContacts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between gap-4">
          {/* First Column */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={filter === "checked" ? "default" : "outline"}
                  onClick={() => setFilter("checked")}
                >
                  Checked
                </Button>
                <Button
                  variant={filter === "unchecked" ? "default" : "outline"}
                  onClick={() => setFilter("unchecked")}
                >
                  Unchecked
                </Button>
              </div>
            </div>
            <div>
              <Button onClick={() => handleResetSearch()}>Reset Search</Button>
            </div>
          </div>

          {/* Second Column */}
          <div className="flex flex-col gap-2">
            <div></div>
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
              {filteredContacts.length > 0 ? (
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
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1 || totalPages === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages || totalPages === 1}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, id: null })}
        onConfirm={() =>
          deleteConfirmation.id && handleDeleteContact(deleteConfirmation.id)
        }
      />
    </>
  );
};
