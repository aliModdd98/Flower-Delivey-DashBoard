import { DialogClose } from "@radix-ui/react-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  getAllOrdersThunk,
  Order,
  removeOrderThunk,
  toggleOrderStatusThunk,
} from "../../../../store/slices/orderSlice";
import { useReduxDispatch, useReduxSelector } from "../../../../store/store";
import { Button } from "../../../components/button";
import { Checkbox } from "../../../components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/dialog";

export const ToggleStatusButton = ({ order }: { order: Order }) => {
  const dispatch = useReduxDispatch();
  const { isPending } = useReduxSelector((state) => state.orders);
  const toggle = (values: { _id: string; status: boolean }) => {
    dispatch(toggleOrderStatusThunk(values));
  };

  return (
    <span className=" relative size-4">
      {isPending ? (
        <Loader2 className=" animate-spin inline size-4" />
      ) : (
        <Checkbox
          id="isDone"
          defaultChecked={order.isDone}
          onCheckedChange={(checked) => {
            toggle({ _id: order._id, status: Boolean(checked) });
          }}
        />
      )}
    </span>
  );
};

export const Remove = ({
  orderId,
  rowsPerPage,
}: {
  orderId: string;
  rowsPerPage: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useReduxDispatch();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className=" size-8 p-1 " variant="ghost">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-foreground bg-background">
        <DialogHeader>
          <DialogTitle>Delete Order</DialogTitle>
        </DialogHeader>
        <p>are you sure you want to delete the order ?</p>
        <div className="flex w-full justify-between">
          <DialogClose asChild>
            <Button variant={"ghost"}>Close</Button>
          </DialogClose>
          <Button
            onClick={async () => {
              const res = await dispatch(removeOrderThunk(orderId));
              if (res.meta.requestStatus == "fulfilled") {
                dispatch(
                  getAllOrdersThunk({
                    page: 1,
                    limit: rowsPerPage,
                  })
                );
              }
            }}
            className="hover:bg-primary-hover bg-primary"
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
