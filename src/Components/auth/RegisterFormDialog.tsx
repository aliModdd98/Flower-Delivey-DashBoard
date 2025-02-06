import { zodResolver } from "@hookform/resolvers/zod";
// import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSearchParams } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "../ui/Dialog";
import { Button } from "../../dashboard/components/button";
import { Input } from "../../dashboard/components/input";
import { ErrorMessage } from "../../dashboard/components/error-message";
import { validateSchemas } from "../../lib/zod";
import { signUpUser } from "../../store/slices/authSlice";
import { useReduxDispatch } from "../../store/store";
import { DialogDescription } from "@radix-ui/react-dialog";
import { EnumsDialogShow, EnumsSearchParams } from "../../types/global";

type CreateUserFormType = z.infer<typeof validateSchemas.createUser>;

const RegisterFormDialog = ({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [, setSearchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormType>({
    resolver: zodResolver(validateSchemas.createUser),
  });

  const dispatch = useReduxDispatch();

  const onSubmit = async (data: CreateUserFormType) => {
    const res = await dispatch(signUpUser(data));
    console.log(res, "Register");

    if (res.meta.requestStatus === "fulfilled") {
      if (res.payload?.data?.user?.isAccountVerified === false) {
        setSearchParams((prevParams) => {
          prevParams.set(EnumsSearchParams.dialog, EnumsDialogShow.Verify);
          return prevParams;
        });
      }
    }
    console.log(res, "Register");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {/* <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> sign up
        </Button>
      </DialogTrigger> */}

      <DialogContent
        aria-describedby={"Sign up"}
        className="mt-[48px] md:mt-[57px] lg:mt-[81px]  flex flex-col h-full   sm:rounded-none bg-white text-black border-[#121212] shadow-none   max-w-full lg:max-w-[722px] px-4 sm:px-20 pt-10 sm:pt-20 pb-10"
      >
        <DialogHeader>
          <DialogTitle className="text-start font-semibold text-[34px] sm:text-[50px] leading-10 sm:leading-[60px]">
            Sign up
          </DialogTitle>
          <DialogDescription className="py-6 text-start text-[16px] font-medium leading-5">
            Become a member and enjoy personalized gift recommendations, fast
            checkout, and more.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4   pb-[50px] overflow-y-auto"
        >
          <div className="flex flex-col gap-3 px-1">
            <label
              htmlFor="email"
              className="text-start text-base font-medium  "
            >
              Name
            </label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              className="h-[56px] dark:placeholder:text-black dark:border-input  rounded-none   text-base font-medium "
            />
          </div>
          {errors.name && <ErrorMessage message={errors.name?.message} />}

          <div className="flex flex-col gap-3 px-1">
            <label
              htmlFor="email"
              className="text-start text-base font-medium "
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="h-[56px] dark:placeholder:text-black dark:border-input rounded-none text-base font-medium "
            />
          </div>
          {errors.email && <ErrorMessage message={errors.email?.message} />}

          <div className="flex flex-col gap-3 px-1">
            <label
              htmlFor="phone"
              className="text-start text-base font-medium  "
            >
              Phone
            </label>
            <Input
              id="phone"
              type="number"
              {...register("phone")}
              className="h-[56px] dark:placeholder:text-black dark:border-input  rounded-none   text-base font-medium "
            />
          </div>
          {errors.phone && <ErrorMessage message={errors.phone?.message} />}

          <div className="flex flex-col gap-3 px-1">
            <label
              htmlFor="password"
              className="text-start text-base font-medium "
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className="h-[56px] dark:placeholder:text-black dark:border-input rounded-none text-base font-medium "
            />
          </div>
          {errors.password && (
            <ErrorMessage message={errors.password?.message} />
          )}

          <div className="flex flex-col gap-3 px-1">
            <label
              htmlFor="password_confirmation"
              className="text-start text-base font-medium "
            >
              Password Confirmation
            </label>
            <Input
              id="password_confirmation"
              type="password"
              {...register("password_confirmation")}
              className="h-[56px] dark:placeholder:text-black dark:border-input rounded-none text-base font-medium "
            />
          </div>
          {errors.password_confirmation && (
            <ErrorMessage message={errors.password_confirmation?.message} />
          )}

          {/* <div className="flex flex-col gap-3">
            <label htmlFor="emailConfirmToken" className="text-start text-base font-medium ">
              Enter code from email
            </label>
            <Input
              id="emailConfirmToken"
              {...register("emailConfirmToken")}
              className="h-[56px]  dark:placeholder:text-black dark:border-input rounded-none text-base font-medium "
            />
          </div> */}
          {/* <ErrorMessage message={errors.emailConfirmToken?.message} /> */}

          <Button
            type="submit"
            className="h-[56px] rounded-none outline-none  text-base font-medium w-full bg-[#121212] hover:scale-100 hover:bg-[#2e2e2e] text-white transition-[colors_transform] duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? "JOIN US..." : "JOIN US"}
          </Button>

          <p className="mt-6 mb-6 w-full text-[#808080] text-[16px] leading-5 font-medium">
            Had an account ?
            <span
              className={`hover:text-[#2b2b2b] hover:font-bold"} ms-1 text-[#121212] text-[16px]  leading-5 font-medium cursor-pointer`}
              onClick={() => {
                setSearchParams((prevParams) => {
                  prevParams.set(
                    EnumsSearchParams.dialog,
                    EnumsDialogShow.Login
                  );
                  return prevParams;
                });
              }}
            >
              Sign In
            </span>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterFormDialog;
