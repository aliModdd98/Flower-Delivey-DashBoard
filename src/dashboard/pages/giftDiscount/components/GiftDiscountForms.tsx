import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  addGiftDiscount,
  deleteGiftDiscount,
  updateGiftDiscount,
  TGiftDiscount,
} from "../../../../store/slices/giftDiscountSlice";
import { useReduxDispatch } from "../../../../store/store";
import { Button } from "../../../components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/dialog";
import { Input } from "../../../components/input";

// Create Component
export const CreateGiftDiscount = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useReduxDispatch();

  const { register, handleSubmit, reset, formState } = useForm<TGiftDiscount>();

  const onSubmit = (data: TGiftDiscount) => {
    dispatch(addGiftDiscount(data));
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-end">
          <Button>Create Gift Discount</Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-5">
          <DialogTitle>Create Gift Discount</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="codeGift" className="block mb-2">
            Code Gift :
          </label>

          <Input
            {...register("codeGift")}
            placeholder="Gift Code"
            required
            className="dark:bg-gray-800 mb-5"
          />

          <label htmlFor="discountGift" className="block mb-2">
            Discount Gift :
          </label>

          <Input
            {...register("discountGift", { valueAsNumber: true })}
            placeholder="Discount Percentage"
            type="number"
            required
            className="dark:bg-gray-800 mb-5"
          />

          <Button type="submit" disabled={formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Edit Component
export const EditGiftDiscount = ({
  giftDiscount,
}: {
  giftDiscount: TGiftDiscount;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useReduxDispatch();

  const { register, handleSubmit, reset, formState } = useForm<TGiftDiscount>();

  const onSubmit = (data: TGiftDiscount) => {
    dispatch(updateGiftDiscount({ id: giftDiscount._id, values: data }));
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Gift Discount</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="codeGift" className="block mb-2">
            Code Gift :
          </label>

          <Input
            {...register("codeGift")}
            defaultValue={giftDiscount.codeGift}
            placeholder="Gift Code"
            className="dark:bg-gray-800 mb-5"
            required
          />

          <label htmlFor="discountGift" className="block mb-2">
            Discount Gift :
          </label>

          <Input
            {...register("discountGift", { valueAsNumber: true })}
            defaultValue={giftDiscount.discountGift}
            placeholder="Discount Percentage"
            type="number"
            className="dark:bg-gray-800 mb-5"
            required
          />

          <Button type="submit" disabled={formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const RemoveGiftDiscount = ({
  giftDiscountId,
}: {
  giftDiscountId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useReduxDispatch();

  const onConfirm = () => {
    dispatch(deleteGiftDiscount(giftDiscountId));
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Gift Discount</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this gift discount?</p>
        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
