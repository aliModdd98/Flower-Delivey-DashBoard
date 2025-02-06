import { zodResolver } from "@hookform/resolvers/zod";
// import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import Google from "../../assets/Google.png";

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
import { loginUser } from "../../store/slices/authSlice";
import { useReduxDispatch, useReduxSelector } from "../../store/store";
import { EnumsDialogShow, EnumsSearchParams } from "../../types/global";
import { useNavigate, useSearchParams } from "react-router-dom";

type LoginFormType = z.infer<typeof validateSchemas.login>;

const LoginFormDialog = ({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const [, setSearchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(validateSchemas.login),
  });

  const dispatch = useReduxDispatch();
  const { isPending } = useReduxSelector((state) => state.auth);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormType) => {
    const res = await dispatch(loginUser(data));
    if (res.meta.requestStatus === "fulfilled") {
      if (res.payload?.data?.user?.isAccountVerified === false) {
        setSearchParams((prevParams) => {
          prevParams.set(EnumsSearchParams.dialog, EnumsDialogShow.Verify);
          return prevParams;
        });
      } else if (
        res.payload?.data?.user?.isAdmin === true &&
        res.payload?.data?.user?.isAccountVerified === true
      ) {
        handleClose();
        navigate("/dashboard", {
          replace: true,
        });
      } else if (
        res.payload?.data?.user?.isAdmin === false &&
        res.payload?.data?.user?.isAccountVerified === true
      ) {
        handleClose();
        navigate("/", {
          replace: true,
        });
      }
    }

    console.log(res, "resresresres");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {/* <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New User
        </Button>
      </DialogTrigger> */}
      <DialogContent
        aria-describedby={"Sign in"}
        className="mt-[48px] md:mt-[57px] lg:mt-[81px]  flex flex-col h-full   sm:rounded-none bg-white text-black border-[#121212] shadow-none   max-w-full lg:max-w-[722px] px-4 sm:px-20 pt-10 sm:pt-20 pb-10"
      >
        <DialogHeader>
          <DialogTitle className="text-start font-semibold  text-[34px] sm:text-[50px] leading-10 sm:leading-[60px]">
            Greetings! Welcome to luxury gift shop.
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4  pb-[50px] overflow-y-auto"
        >
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
              className="h-[56px] dark:placeholder:text-black dark:border-input rounded-none  text-base font-medium "
            />
          </div>
          {errors.email && <ErrorMessage message={errors.email?.message} />}
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

          <Button
            type="submit"
            className="h-[56px] rounded-none text-base font-medium w-full bg-[#121212] hover:scale-100 hover:bg-[#2e2e2e] text-white transition-[colors_transform] duration-200"
            disabled={isSubmitting || isPending}
          >
            {isSubmitting ? "CONTINUE..." : "CONTINUE"}
          </Button>

          <p className="mt-6 w-full text-[#808080] text-[16px] leading-5 font-medium">
            Don't have an account ?
            <span
              className={`hover:text-[#2b2b2b] hover:font-bold"} ms-1 text-[#121212] text-[16px]  leading-5 font-medium cursor-pointer`}
              onClick={() => {
                setSearchParams((prevParams) => {
                  prevParams.set(
                    EnumsSearchParams.dialog,
                    EnumsDialogShow.SignUp
                  );
                  return prevParams;
                });
              }}
            >
              Sign Up
            </span>
          </p>

          <p className="mt-6 mb-6  w-full text-[#808080] text-[16px] leading-5 font-medium">
            <span
              className={`hover:text-[#2b2b2b] hover:font-bold"} ms-1 text-[#121212] text-[16px]  leading-5 font-medium cursor-pointer`}
              onClick={() => {
                setSearchParams((prevParams) => {
                  prevParams.set(
                    EnumsSearchParams.dialog,
                    EnumsDialogShow.ForgotPassowrd
                  );
                  return prevParams;
                });
              }}
            >
              Forgot your password ?
            </span>
          </p>
        </form>

        {/* <p className="w-full text-center border-b mx-0 mt-6 mb-6 leading-[0.1rem] border-[#D2D2D7] ">
            <span className="bg-white text-[#D2D2D7] text-sm font-normal py-0 px-2">
                or
            </span>
        </p>
        <p className="text-start text-base font-medium ">
          Instantly login or sign up via Google
        </p>
          
          <Button
          variant="outline"
          className="h-[56px] w-[270px] rounded-none text-base font-medium   text-[#121212] transition-[colors_transform] duration-200"
          >
            <img src={Google} className="w-6 h-6 me-[2.5px]" alt="Google" />
            CONTINUE WITH GOOGLE
        </Button> */}
      </DialogContent>
    </Dialog>
  );
};

export default LoginFormDialog;
