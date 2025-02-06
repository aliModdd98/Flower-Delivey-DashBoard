import { Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "../../../dashboard/components/button";
import { Input } from "../../../dashboard/components/input";

interface CheckoutFormProps {
  onSubmit: (data: ContactFormData) => void;
  isLoading?: boolean;
}

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useFormContext<ContactFormData>();
  console.log(errors);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className=" bg-[#D2D2D7] p-4">
        <p>Already have an account? Log in for faster checkout</p>
      </div>
      <div>
        <h2 className="text-xl mb-6 ">1 Contact information</h2>
        <div className="space-y-4">
          <div>
            <Input
              {...register("name")}
              placeholder="Your Name"
              className="w-full placeholder:!text-gray-400   outline outline-[#D2D2D7] text-black rounded-none border-0 h-14"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register("email")}
              placeholder="Your Email"
              type="email"
              className="w-full placeholder:!text-gray-400   outline outline-[#D2D2D7] text-black rounded-none border-0 h-14"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              {...register("phone")}
              placeholder="Your Phone number *"
              type="tel"
              className="w-full placeholder:!text-gray-400   outline outline-[#D2D2D7] text-black rounded-none border-0 h-14"
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-black h-14  rounded-none hover:bg-black/90"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "CONTINUE TO SHIPPING"
        )}
      </Button>

      <div className="space-y-4 opacity-50">
        <h2 className="text-xl ">2 Shipping details</h2>
        <h2 className="text-xl ">3 Payment</h2>
      </div>
    </form>
  );
}
