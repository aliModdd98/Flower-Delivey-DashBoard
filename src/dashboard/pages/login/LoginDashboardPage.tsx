import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon, LockIcon, MailIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { validateSchemas } from "../../../lib/zod";
import { loginAdmin } from "../../../store/slices/authSlice";
import { useReduxDispatch, useReduxSelector } from "../../../store/store";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { ThemeProvider } from "../../../contexts/ThemeProvider";

type LoginFormType = z.infer<typeof validateSchemas.login>;

export const LoginDashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useReduxDispatch();
  const { isPending } = useReduxSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(validateSchemas.login),
  });

  const onSubmit = async (data: LoginFormType) => {
    const res = await dispatch(loginAdmin(data));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/dashboard", {
        replace: true,
      });
    }
  };

  return (
    <ThemeProvider>
      <main className="min-h-screen  flex items-center justify-center ">
        <div className=" overflow-hidden     absolute inset-0 bg-black isolate ">
          <div className=" bg-black w-full  absolute inset-0 " />
          <div className="dark:mix-blend-lighten absolute animate-[spin_3s_linear_infinite]   w-[200vw] -left-[50vw] -top-[50vh] h-[200vh]  from-primary to-secondary bg-gradient-to-tr" />
          <div className=" bg-white size-full dark:invert  dark:mix-blend-color-burn mix-blend-lighten dark:filter w-full absolute inset-0">
            <img
              className="mx-auto object-cover  h-full  max-h-full  "
              src="/login-page-background.jpg"
              alt="background"
            />
          </div>
        </div>
        <div className="w-full max-w-md px-4 sm:px-0 relative z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl overflow-hidden ">
            <div className="p-8 space-y-6">
              <div className="flex justify-center">
                <img src="/vite.svg" alt="Logo" className="h-12 w-auto" />
              </div>
              <h2 className="text-2xl font-bold text-center text-white">
                Welcome back
              </h2>
              <p className="text-center text-gray-300">
                Enter your credentials to access your account
              </p>
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-white">
                    Email
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      {...register("email")}
                      className={`pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-primary focus:border-primary ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      <InfoIcon className="h-4 w-4 mr-1" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-white">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...register("password")}
                      className={`pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-primary focus:border-primary ${
                        errors.password ? "border-red-500" : ""
                      }`}
                    />
                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      <InfoIcon className="h-4 w-4 mr-1" />
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white transition-[colors_transform] duration-200"
                  disabled={isSubmitting || isPending}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
};
