import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    SortingState,
    useReactTable,
    PaginationState,
  } from "@tanstack/react-table";
  import {
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
  } from "lucide-react";
  import { useState } from "react";
  import DeleteModal from "../DeleteModal";
  import { useNavigate } from "react-router-dom";
  import { useReduxDispatch } from "../../../store/store";
import { SubscribePlan } from "../../../types/subscribePlansType";
import { deleteSubsciblePlan } from "../../../store/slices/subscribePlansSlice";
  


  
  
  interface SubscribePlansTableProps {
    subscribePlansData: SubscribePlan[];
    fetchData: () => void;
  }
  
  
  const SubscribePlansTable: React.FC<SubscribePlansTableProps> = ({
    subscribePlansData,
    fetchData,
  }) => {
    const subscribePlans = subscribePlansData || [];
  
    const naviagte = useNavigate();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [show, setshow] = useState(false);
    const [id, setid] = useState<string>("");
    const dispatch = useReduxDispatch();
  
    // Pagination state
     const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
       pageIndex: 0,
       pageSize: 3,
     });
  
     const pagination = {
       pageIndex,
       pageSize,
     };
  
    const handleRowClick = (rowData: (typeof subscribePlansData)[0]) => {
      console.log("Row clicked:", rowData);
      naviagte(`/dashboard/subscribe-plans/${rowData._id}`);
    };
  
    const deleteSubscibePlanfunc = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setid(id);
      setshow(true);
    };
  
  
    const onConfirm = async (id: string) => {
      await dispatch(deleteSubsciblePlan(id));
      fetchData();
      setshow(false);
    };
  
    const onClose = () => {
      setshow(false);
    };
  
    const editProducts = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      naviagte(`/dashboard/subscribe-plans/edit/${id}`);
    };
  

  
    const columns: ColumnDef<(typeof subscribePlansData)[number]>[] = [
      {
        accessorKey: "title",
        header: "Name",
        cell: ({ row }) =>  <div className="text-center">{row.getValue("title")}</div> ,
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = row.getValue("price");
            if (typeof price === 'string') {
                const numberPrice = parseFloat(price);
                if (!isNaN(numberPrice)) {
                    return <div className="text-center">${numberPrice.toFixed(2)}</div> ;
                }
              }
              return <div className="text-center">$0.00</div> 
        },
      },
      {
        accessorKey: "isFreeDelivery",
        header: "Free Delivery",
        cell: ({ row }) => {
            const isFree = row.getValue("isFreeDelivery");
            if (isFree==="1") {
            return <div className="text-center">yes</div>;
        }else return <div className="text-center">no</div>
        },
      },
      {
        accessorKey: "deliveryFrequency",
        header: "Delivery Frequency",
        cell: ({ row }) => <div className="text-center">{row.getValue("deliveryFrequency")}</div>,
      },
      {
        accessorKey: "deliveryCount",
        header: "Delivery Count",
        cell: ({ row }) => <div className="text-center">{row.getValue("deliveryCount")}</div>,
      },
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            return( <div className="text-center">
                <img
                className="w-[100px] lg:h-full object-cover rounded-lg"
                src={`${import.meta.env.VITE_PUBLIC_API_BASE_URL}${row.getValue("image")}`}
                alt={"Subscribe Plan"}
                />
                </div>
                )
        },
      },

      {
        accessorKey: "features",
        header: "Features",
        cell: ({ row }) => {
            const features = row.getValue("features");
            
            if (Array.isArray(features)) {
              return (
                <div className="text-center">
                  {features.join(', ').length > 50 ? 
                    `${features.slice(0, 47).join(',')}...` :
                    features.join(', ')
                  }
                </div>
              );
            }
            return <div className="text-center">_</div>; 
    }
},
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex space-x-2 justify-center">
            <button
              className="text-blue-500 dark:bg-gray-900 bg-gray-300 rounded-full p-2 dark:hover:bg-gray-800"
  
              onClick={(e) => editProducts(e, row.original._id)}>
              <Edit2 size={15} />
            </button>
            <button
              className="text-red-500 dark:bg-gray-900 bg-gray-300 rounded-full p-2 dark:hover:bg-gray-800"
  
              onClick={(e) => deleteSubscibePlanfunc(e, row.original._id)}>
              <Trash2 size={15} />
            </button>
          </div>
        ),
      },
    ];
  
    const table = useReactTable({
      data: subscribePlans,
      columns,
      getCoreRowModel: getCoreRowModel(),
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      onColumnFiltersChange: setColumnFilters,
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
      state: {
        sorting,
        columnFilters,
        pagination,
      },
      manualPagination: false,
    });
  
    return (
      <>
        <div className="p-4 dark:bg-[#020817] shadow-lg dark:text-white rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search by title..."
              className="p-2 w-full rounded dark:bg-gray-800 border border-gray-600"
              value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
              onChange={(e) =>
                table.getColumn("title")?.setFilterValue(e.target.value)
              }
            />
          </div>
          <div className="w-full overflow-auto">
  
            {subscribePlans.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-300 p-4">
                No SubScribe Plans Found
              </div>
            ) : table.getRowModel().rows.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-300 p-4">
                No SubScribe Plans Found
              </div>
            ) : (
              <>
                <table className="w-full border-collapse border border-gray-600 text-left">
                  <thead className="dark:bg-gray-800 text-center">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="p-2 border hover:underline border-gray-600 cursor-pointer"
                            // onClick={() =>
                            
                            //   header.column.toggleSorting(
                            //     header.column.getIsSorted() === "asc"
                            //   )}
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
                        onClick={() => handleRowClick(row.original)}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="p-2 border border-gray-600">
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
  
                {/* Pagination Controls */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    {/* <select
                      value={table.getState().pagination.pageSize}
                      onChange={(e) => table.setPageSize(Number(e.target.value))}
                      className="p-2 bg-transparent border border-gray-600 rounded dark:bg-gray-800">
                      {[10, 20, 30, 40, 50].map((size) => (
                        <option key={size} value={size}>
                          Show {size}
                        </option>
                      ))}
                    </select> */}
                    <span className="text-sm">
                      Page {table.getState().pagination.pageIndex + 1} of{" "}
                      {table.getPageCount()}
                    </span>
                  </div>
  
                  <div className="flex gap-2">
                    <button
                      className="p-1 border border-gray-600 rounded dark:hover:bg-gray-800 disabled:opacity-50"
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}>
                      <ChevronsLeft size={20} />
                    </button>
                    <button
                      className="p-1 border border-gray-600 rounded dark:hover:bg-gray-800 disabled:opacity-50"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}>
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      className="p-1 border border-gray-600 rounded dark:hover:bg-gray-800 disabled:opacity-50"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}>
                      <ChevronRight size={20} />
                    </button>
                    <button
                      className="p-1 border border-gray-600 rounded dark:hover:bg-gray-800 disabled:opacity-50"
                      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                      disabled={!table.getCanNextPage()}>
                      <ChevronsRight size={20} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {show && <DeleteModal onClose={onClose} onConfirm={onConfirm} id={id} />}
      </>
    );
  };
  
  export default SubscribePlansTable;
  