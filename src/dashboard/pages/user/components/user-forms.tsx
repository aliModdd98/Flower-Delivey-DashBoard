import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { validateSchemas } from "../../../../lib/zod";
import { Button } from "../../../components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/dialog";
import { ErrorMessage } from "../../../components/error-message";
import { Input } from "../../../components/input";
import {
  deleteUser,
  TUserFromBackend,
  updateUser,
} from "../../../../store/slices/userSlice";
import { useReduxDispatch } from "../../../../store/store";
type CreateUserFormType = z.infer<typeof validateSchemas.createUser>;

export const Create = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<CreateUserFormType>({
    resolver: zodResolver(validateSchemas.createUser),
  });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) => console.log(values))}
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">
              User Name
            </label>
            <Input id="name" {...register("name")} className="col-span-3" />
          </div>
          <ErrorMessage message={errors.name?.message} />
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-right">
              Email
            </label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="col-span-3"
            />
          </div>
          <ErrorMessage message={errors.email?.message} />
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="password" className="text-right">
              Password
            </label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className="col-span-3"
            />
          </div>
          <ErrorMessage message={errors.password?.message} />
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="password_confirmation" className="text-right">
              Password confirmation
            </label>
            <Input
              id="password_confirmation"
              {...register("password_confirmation")}
              className="col-span-3"
            />
          </div>
          <ErrorMessage message={errors.password_confirmation?.message} />

          <Button
            type="submit"
            disabled={isLoading}
            className="hover:bg-primary-hover bg-primary text-white"
          >
            Create User
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

type EditUserFormType = z.infer<typeof validateSchemas.editUser>;

export const Edit = ({ user }: { user: TUserFromBackend }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useReduxDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<EditUserFormType>({
    resolver: zodResolver(validateSchemas.editUser),
    defaultValues: user,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) =>
            dispatch(updateUser({ userId: user._id, userData: values }))
          )}
          className="grid gap-4 py-4"
        >
          <div>
            <label htmlFor="name">Name</label>
            <Input id="name" {...register("name")} />
            <ErrorMessage message={errors.name?.message} />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <Input id="email" {...register("email")} />
            <ErrorMessage message={errors.email?.message} />
          </div>

          <div>
            <label htmlFor="verified">Verified</label>
            <Input type="checkbox" id="verified" {...register("verified")} />
          </div>

          <Button type="submit" disabled={isLoading}>
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const Remove = ({ userId }: { userId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useReduxDispatch();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Remove</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this user?</p>
        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              dispatch(deleteUser(userId));
              setIsOpen(false);
            }}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
