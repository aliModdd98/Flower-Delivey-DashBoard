import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import {
  getGiftDiscounts,
  TGiftDiscount,
} from "../../../store/slices/giftDiscountSlice";
import {
  RootState,
  useReduxDispatch,
  useReduxSelector,
} from "../../../store/store";
import LoadingSpinner from "../../components/LoadingSpinner";
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
import {
  CreateGiftDiscount,
  EditGiftDiscount,
  RemoveGiftDiscount,
} from "./components/GiftDiscountForms";

const GiftDiscount = () => {
  const { giftDiscounts, loading, pagination } = useReduxSelector(
    (state: RootState) => state.giftDiscount
  );
  const dispatch = useReduxDispatch();

  const [rowsPerPage, setRowsPerPage] = useState(3);

  const [fieldSearch, setFieldSearch] = useState<string | undefined>(undefined);
  const [valueSearch, setValueSearch] = useState<string | undefined>(undefined);

  const [CodeSearch, setCodeSearch] = useState("");

  useEffect(() => {
    dispatch(
      getGiftDiscounts({
        page: 1,
        limit: rowsPerPage,
        field: fieldSearch,
        value: valueSearch,
      })
    );
  }, [dispatch, rowsPerPage, fieldSearch, valueSearch]);

  const totalPages = pagination.totalPages;

  const columns: ColumnDef<TGiftDiscount, unknown>[] = [
    {
      accessorKey: "codeGift",
      header: "Code",
      filterFn: "includesString",
    },
    {
      accessorKey: "discountGift",
      header: "Discount",
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const giftDiscount = row.original;
        return (
          <div className="flex space-x-2">
            <EditGiftDiscount giftDiscount={giftDiscount} />
            <RemoveGiftDiscount giftDiscountId={giftDiscount._id} />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: giftDiscounts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const setCurrentPage = ({ page }: { page: number }) => {
    dispatch(
      getGiftDiscounts({
        page,
        limit: rowsPerPage,
        field: fieldSearch,
        value: valueSearch,
      })
    );
  };

  const searchByCodeInput = useRef<HTMLInputElement | null>(null);

  const handleSearch = (field: string, value: string) => {
    setFieldSearch(field);
    setValueSearch(value);
  };

  const handleResetSearch = () => {
    setFieldSearch(undefined);
    setValueSearch(undefined);

    setCodeSearch("");
  };

  const handleSearchByCode = (field: string, value: string) => {
    setCodeSearch(value);
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
            <Button onClick={handleResetSearch}>Reset Search</Button>
          </div>
        </div>

        {/* Second Column */}
        <div className="flex flex-col gap-2">
          <div>
            <CreateGiftDiscount />
          </div>
          <div className="flex items-center gap-2 max-md:flex-wrap">
            <Input
              placeholder="Search by code..."
              className="max-w-sm dark:placeholder:text-white bg-white dark:bg-gray-800"
              ref={searchByCodeInput}
              defaultValue={CodeSearch}
            />

            <Button
              onClick={() =>
                handleSearchByCode(
                  "title",
                  searchByCodeInput.current?.value as string
                )
              }
            >
              search
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Table className="table-auto border-collapse w-full mb-7">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-left px-4 py-2">
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
            {giftDiscounts.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="py-5">
                <TableCell
                  colSpan={columns.length}
                  className="text-center px-4"
                >
                  No gift discounts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
            {Array.from({ length: totalPages }).map((_, i) => (
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
      </CardContent>
    </Card>
  );
};

export default GiftDiscount;
