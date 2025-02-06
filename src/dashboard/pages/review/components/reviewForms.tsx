import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  addReview,
  deleteReview,
  editReview,
  TReviewFromBackEnd,
} from "../../../../store/slices/reviewSlice";
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
import { Textarea } from "../../../components/textarea";

// Create Component
export const Create = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useReduxDispatch();

  const { register, handleSubmit, reset, formState } =
    useForm<TReviewFromBackEnd>();

  const onSubmit = (data: TReviewFromBackEnd) => {
    //@ts-expect-error unknown type conflict
    dispatch(addReview(data));
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-end">
          <Button>Create Review</Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-5">
          <DialogTitle>Create Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("name")}
            placeholder="Name"
            required
            className="dark:bg-gray-800 mb-5"
          />

          <Textarea
            {...register("text")}
            placeholder="Text"
            required
            className="dark:bg-gray-800 h-52 mb-5"
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
export const Edit = ({ review }: { review: TReviewFromBackEnd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useReduxDispatch();

  const { register, handleSubmit, reset, formState } =
    useForm<TReviewFromBackEnd>();

  const onSubmit = (data: TReviewFromBackEnd) => {
    //@ts-expect-error unknown type conflict
    dispatch(editReview({ reviewInfo: { ...data }, id: review._id }));
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
          <DialogTitle>Edit Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("name")}
            defaultValue={review.name}
            placeholder="Name"
            className="dark:bg-gray-800 mb-5"
            required
          />

          <Textarea
            {...register("text")}
            defaultValue={review.text}
            placeholder="Text"
            required
            className="dark:bg-gray-800 h-52 mb-5"
          />
          <Button type="submit" disabled={formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const Remove = ({ reviewId }: { reviewId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useReduxDispatch();

  const onConfirm = () => {
    dispatch(deleteReview(reviewId));
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Review</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this review?</p>
        <div className="flex justify-between">
          <Button
            variant="ghost"
            className=" dark:text-white"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
