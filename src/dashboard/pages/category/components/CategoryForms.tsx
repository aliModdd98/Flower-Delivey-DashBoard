import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  addCategory,
  deleteCategory,
  editCategory,
  TCategoryFromBackEnd,
  TCatergoryAdd,
  TCatergoryUpdate,
} from "../../../../store/slices/categorySlice";
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
export const CreateCategory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useReduxDispatch();

  const { register, handleSubmit, reset, formState } = useForm<TCatergoryAdd>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = (data: TCatergoryAdd) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (image) {
      formData.append("image", image);
    }
    dispatch(
      addCategory(formData as unknown as Parameters<typeof addCategory>[0])
    );
    reset();
    setPreviewImage("");
    setImage(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-end">
          <Button>Create Category</Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="title" className="block mb-2">
            Title :
          </label>
          <Input
            {...register("title")}
            placeholder="Title"
            required
            className="dark:bg-gray-800 mb-5"
          />

          <label htmlFor="description" className="block mb-2">
            Description :
          </label>
          <Textarea
            {...register("description")}
            placeholder="Description"
            className="dark:bg-gray-800 h-24 mb-5"
          />

          <div className="mb-5">
            <label htmlFor="image" className="block mb-2">
              Image:
            </label>
            <button
              type="button"
              className="flex p-5 bg-white border-dashed dark:border-white border-gray-300 border-2 w-full dark:bg-gray-800 items-center justify-center rounded"
              onClick={handleClick}
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Selected Preview"
                  className="w-[200px] h-[100px] rounded-md"
                />
              ) : (
                <img src="/assets/images/UploadIcon.png" alt="Upload Icon" />
              )}
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                id="image"
                className="sr-only"
                onChange={handleFileChange}
              />
            </button>
          </div>
          <Button type="submit" disabled={formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Edit Component
export const EditCategory = ({
  category,
}: {
  category: TCategoryFromBackEnd;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>(
    `${import.meta.env.VITE_PUBLIC_API_BASE_URL}${category.image}`
  );
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useReduxDispatch();

  const { register, handleSubmit, reset, formState } =
    useForm<TCatergoryUpdate>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = (data: TCatergoryUpdate) => {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (image) {
      formData.append("image", image);
    }

    dispatch(
      editCategory({
        categoryInfo: formData as unknown as TCatergoryAdd,
        id: category._id,
      })
    );
    reset();
    setPreviewImage("");
    setImage(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="title" className="block mb-2">
            Title :
          </label>
          <Input
            {...register("title")}
            defaultValue={category.title}
            placeholder="Title"
            required
            className="dark:bg-gray-800 mb-5"
          />

          <label htmlFor="description" className="block mb-2">
            Description :
          </label>
          <Textarea
            {...register("description")}
            defaultValue={category.description}
            placeholder="Description"
            className="dark:bg-gray-800 h-24 mb-5"
          />
          <div className="mb-5">
            <label htmlFor="image" className="block mb-2">
              Image:
            </label>
            <button
              type="button"
              className="flex p-5 bg-white border-dashed dark:border-white border-gray-300 border-2 w-full dark:bg-gray-800 items-center justify-center rounded"
              onClick={handleClick}
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Selected Preview"
                  className="w-[200px] h-[100px] rounded-md"
                />
              ) : (
                <img src="/assets/images/UploadIcon.png" alt="Upload Icon" />
              )}
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                id="image"
                className="sr-only"
                onChange={handleFileChange}
              />
            </button>
          </div>
          <Button type="submit" disabled={formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Delete Component
export const RemoveCategory = ({ categoryId }: { categoryId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useReduxDispatch();

  const onConfirm = () => {
    dispatch(deleteCategory(categoryId));
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this category?</p>
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
