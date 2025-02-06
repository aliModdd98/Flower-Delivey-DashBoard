import { zodResolver } from "@hookform/resolvers/zod";
// import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useReduxDispatch, useReduxSelector } from "../../store/store";
import { DialogDescription } from "@radix-ui/react-dialog";
import { forgotPassword } from "../../store/slices/authSlice";
import { EnumsDialogShow, EnumsSearchParams } from "../../types/global";
import { useSearchParams } from "react-router-dom";

type Forgot_PasswordType = z.infer<typeof validateSchemas.Forgot_Password>;

const ForgotPasswordDialog = ({
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
  } = useForm<Forgot_PasswordType>({
    resolver: zodResolver(validateSchemas.Forgot_Password),
  });

  const dispatch = useReduxDispatch();
  const { isPending } = useReduxSelector((state) => state.auth);

  const onSubmit = async (data: Forgot_PasswordType) => {
    await dispatch(forgotPassword(data));
    // if (res.meta.requestStatus === "fulfilled") {

    // }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {/* <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Forgot
        </Button>
      </DialogTrigger> */}
      <DialogContent
        aria-describedby={"Forgot your password"}
        className="mt-[48px] md:mt-[57px] lg:mt-[81px]  flex flex-col h-full   sm:rounded-none bg-white text-black border-[#121212] shadow-none   max-w-full lg:max-w-[722px] px-4 sm:px-20 pt-10 sm:pt-20 pb-10"
      >
        <DialogHeader>
          <DialogTitle className="text-start font-semibold text-[34px] sm:text-[50px] leading-10 sm:leading-[60px]">
            Forgot your password
          </DialogTitle>
          <DialogDescription className="py-6 text-start text-[16px] font-medium leading-5">
            Please provide your email below to receive a code for restoring
            access to your account
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4   pb-[50px]  overflow-y-auto "
        >
          <div className="flex flex-col gap-3 px-1">
            <label
              htmlFor="email"
              className="text-start text-base font-medium "
            >
              Enter your email
            </label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="h-[56px] dark:placeholder:text-black dark:border-input rounded-none  text-white text-base font-medium "
            />
          </div>
          {errors.email && <ErrorMessage message={errors.email?.message} />}

          <Button
            type="submit"
            className="h-[56px] rounded-none text-base font-medium w-full bg-[#121212] hover:scale-100 hover:bg-[#2e2e2e] text-white transition-[colors_transform] duration-200"
            disabled={isSubmitting || isPending}
          >
            {isSubmitting ? "CONTINUE..." : "CONTINUE"}
          </Button>
        </form>
        <p className="mb-6 mt-6 w-full text-[#808080] text-[16px] leading-5 font-medium">
          Back to sign in ?
          <span
            className={`hover:text-[#2b2b2b] hover:font-bold"} ms-1 text-[#121212] text-[16px]  leading-5 font-medium cursor-pointer`}
            onClick={() => {
              setSearchParams((prevParams) => {
                prevParams.set(EnumsSearchParams.dialog, EnumsDialogShow.Login);
                return prevParams;
              });
            }}
          >
            Sign In
          </span>
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
