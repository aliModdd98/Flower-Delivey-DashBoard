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
import {
  RootState,
  useReduxDispatch,
  useReduxSelector,
} from "../../store/store";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
  resendVerifyCode,
  compareVeificationCode,
} from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

type CompareVerificationType = z.infer<
  typeof validateSchemas.CompareVerification
>;

const VerificationDialog = ({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const { user } = useReduxSelector((state: RootState) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<CompareVerificationType>({
    resolver: zodResolver(validateSchemas.CompareVerification),
    defaultValues: {
      email:
        user?.email ||
        (localStorage.getItem("user") !== null
          ? JSON.parse(localStorage.getItem("user") || "{}")?.email
          : "") ||
        "",
      emailConfirmToken: "",
    },
  });

  const dispatch = useReduxDispatch();
  const { isPending, isPendingResend } = useReduxSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  const onSubmit = async (data: CompareVerificationType) => {
    const res = await dispatch(compareVeificationCode(data));
    if (res.meta.requestStatus === "fulfilled") {
      handleClose();
      if (res.payload?.data?.user?.isAdmin === true) {
        navigate("/dashboard", {
          replace: true,
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {/* <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Verify
        </Button>
      </DialogTrigger> */}
      <DialogContent
        aria-describedby={"Verify your email"}
        className="mt-[48px] md:mt-[57px] lg:mt-[81px]  flex flex-col h-full   sm:rounded-none bg-white text-black border-[#121212] shadow-none   max-w-full lg:max-w-[722px] px-4 sm:px-20 pt-10 sm:pt-20 pb-10"
      >
        <DialogHeader>
          <DialogTitle className="text-start font-semibold text-[34px] sm:text-[50px] leading-10 sm:leading-[60px]">
            Verify your email
          </DialogTitle>
          <DialogDescription className="py-6 text-start text-[16px] font-medium leading-5">
            Please provide your code that was sent to uour email for restoring
            access to your account
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4  pb-[50px]  overflow-y-auto "
        >
          <div className="flex flex-col gap-3 px-1">
            <label
              htmlFor="email"
              className="text-start text-base font-medium "
            >
              your email
            </label>
            <Input
              disabled={true}
              id="email"
              type="email"
              {...register("email")}
              className="h-[56px] dark:placeholder:text-black dark:border-input  rounded-none text-base font-medium "
            />
          </div>
          {errors.email && <ErrorMessage message={errors.email?.message} />}

          <div className="flex flex-col gap-3 px-1">
            <label
              htmlFor="emailConfirmToken"
              className="text-start text-base font-medium "
            >
              your verification code
            </label>
            <Input
              id="emailConfirmToken"
              {...register("emailConfirmToken")}
              className="h-[56px] dark:placeholder:text-black dark:border-input rounded-none text-base font-medium "
            />
          </div>
          {errors.emailConfirmToken && (
            <ErrorMessage message={errors.emailConfirmToken?.message} />
          )}

          <Button
            type="submit"
            className="h-[56px] rounded-none text-base font-medium w-full hover:scale-100 bg-[#121212] hover:bg-[#2e2e2e] text-white transition-[colors_transform] duration-200"
            disabled={isSubmitting || isPending}
          >
            {isSubmitting ? "CONTINUE..." : "CONTINUE"}
          </Button>
        </form>
        <p className="mt-6 mb-6  w-full text-[#808080] text-[16px] leading-5 font-medium">
          Didn't receive a code?
          <span
            className={`${
              isPendingResend
                ? "text-[#808080]"
                : "hover:text-[#2b2b2b] hover:font-bold"
            } ms-1 text-[#121212] text-[16px]  leading-5 font-medium cursor-pointer`}
            onClick={() => {
              if (isPendingResend) return;
              else dispatch(resendVerifyCode({ email: getValues("email") }));
            }}
          >
            Resend Code
          </span>
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
