import { useFormContext } from "react-hook-form";

import { Loader2 } from "lucide-react";
import { ChangeEvent } from "react";
import { Button } from "../../../dashboard/components/button";
import { Input } from "../../../dashboard/components/input";
import { CompletedStep } from "./completed-step";

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  onEditContact: () => void;
  onEditShipping: () => void;
  isLoading?: boolean;
}

export function PaymentForm({
  onSubmit,
  onEditContact,
  onEditShipping,
  isLoading,
}: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<PaymentFormData>();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "");

    if (value.length > 4) {
      value = value.slice(0, 4);
    }

    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }

    e.target.value = value;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <CompletedStep title="Contact information" onEdit={onEditContact} />
      <CompletedStep title="Shipping details" onEdit={onEditShipping} />

      <div>
        <h2 className="text-xl mb-4 ">3 Payment</h2>
        <p className="text-gray-400 mb-6">
          Pay by card. Your payment is secure.
        </p>

        <div className="space-y-4">
          <div>
            <Input
              {...register("cardNumber")}
              placeholder="Card Number"
              className="w-full placeholder:!text-gray-400 outline outline-[#D2D2D7] text-black rounded-none border-0 h-14"
              disabled={isLoading}
              maxLength={16}
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cardNumber.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                {...register("expiryDate", {
                  required: "Expiry date is required",
                  validate: (value) => {
                    // Ensure the date is valid in MM/YY format
                    const [month, year] = value.split("/");
                    if (
                      !month ||
                      !year ||
                      Number(month) < 1 ||
                      Number(month) > 12 ||
                      year.length !== 2
                    ) {
                      return "Expiry date must be in MM/YY format and valid";
                    }
                    return true;
                  },
                })}
                placeholder="MM / YY"
                className="w-full placeholder:!text-gray-400 outline outline-[#D2D2D7] text-black rounded-none border-0 h-14"
                disabled={isLoading}
                maxLength={5} // Limit to 5 characters (MM/YY)
                onInput={handleInputChange}
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.expiryDate.message}
                </p>
              )}
            </div>
            <div>
              <Input
                {...register("cvv")}
                placeholder="CVV Code"
                type="password"
                maxLength={4}
                className="w-full placeholder:!text-gray-400 outline outline-[#D2D2D7] text-black rounded-none border-0 h-14"
                disabled={isLoading}
              />
              {errors.cvv && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cvv.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-black h-14 border border-white rounded-none hover:bg-black/90 mt-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
              Processing...
            </>
          ) : (
            "MAKE A PURCHASE"
          )}
        </Button>

        <div className="mt-8">
          <p className="text-black mb-4 capitalize">Or pay using:</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center space-x-2 border border-black py-3 px-4 rounded-none hover:bg-white/5"
              onClick={() => {}}
              disabled={isLoading}
            >
              <span className="text-2xl">
                <svg
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M21.4856 17.1449C21.1529 17.9135 20.7591 18.621 20.3028 19.2714C19.6809 20.1581 19.1717 20.7719 18.7792 21.1127C18.1709 21.6722 17.5191 21.9587 16.8211 21.975C16.32 21.975 15.7158 21.8324 15.0124 21.5432C14.3066 21.2553 13.6581 21.1127 13.0651 21.1127C12.4432 21.1127 11.7762 21.2553 11.0627 21.5432C10.3482 21.8324 9.77255 21.9832 9.33245 21.9981C8.66313 22.0266 7.99599 21.732 7.33006 21.1127C6.90503 20.742 6.37341 20.1065 5.73654 19.2062C5.05324 18.2448 4.49146 17.13 4.05136 15.8589C3.58003 14.4861 3.34375 13.1567 3.34375 11.8696C3.34375 10.3953 3.66232 9.12378 4.3004 8.05821C4.80188 7.20232 5.46903 6.52716 6.30402 6.03151C7.139 5.53587 8.0412 5.2833 9.0128 5.26714C9.54442 5.26714 10.2416 5.43158 11.1079 5.75477C11.9718 6.07904 12.5266 6.24349 12.7698 6.24349C12.9516 6.24349 13.5678 6.0512 14.6125 5.66786C15.6003 5.31236 16.4341 5.16516 17.1171 5.22314C18.968 5.37251 20.3585 6.10213 21.2832 7.4166C19.6279 8.41956 18.8091 9.82433 18.8254 11.6264C18.8403 13.0301 19.3496 14.1982 20.3503 15.1257C20.8039 15.5561 21.3104 15.8888 21.8739 16.1251C21.7517 16.4795 21.6227 16.819 21.4856 17.1449ZM17.2407 0.441082C17.2407 1.54128 16.8388 2.56854 16.0376 3.51936C15.0707 4.64969 13.9013 5.30285 12.6331 5.19979C12.617 5.0678 12.6076 4.92888 12.6076 4.7829C12.6076 3.72671 13.0674 2.59638 13.8839 1.67217C14.2916 1.20423 14.81 0.815149 15.4387 0.504768C16.0661 0.199018 16.6595 0.0299319 17.2176 0.000976562C17.2339 0.148056 17.2407 0.295146 17.2407 0.441068V0.441082Z"
                    fill="#121212"
                  />
                </svg>
              </span>
              <span className="">APPLE PAY</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center space-x-2 border border-black py-3 px-4 rounded-none hover:bg-white/5"
              onClick={() => {}}
              disabled={isLoading}
            >
              <span className="text-2xl">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M21.9992 11.235C21.9992 10.5417 21.943 9.84465 21.8231 9.1626H12.2031V13.09H17.712C17.4834 14.3567 16.7489 15.4772 15.6733 16.1892V18.7375H18.9599C20.8899 16.9612 21.9992 14.3379 21.9992 11.235Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12.2038 21.1996C14.9545 21.1996 17.2743 20.2965 18.9644 18.7375L15.6778 16.1892C14.7634 16.8113 13.5829 17.1636 12.2076 17.1636C9.54684 17.1636 7.29083 15.3685 6.48136 12.9551H3.08984V15.5821C4.8212 19.0261 8.34763 21.1996 12.2038 21.1996Z"
                    fill="#34A853"
                  />
                  <path
                    d="M6.47658 12.9553C6.04937 11.6886 6.04937 10.317 6.47658 9.05036V6.42334H3.08882C1.64227 9.30519 1.64227 12.7005 3.08882 15.5823L6.47658 12.9553Z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M12.2038 4.83805C13.6579 4.81556 15.0632 5.3627 16.1163 6.36704L19.0281 3.45521C17.1843 1.72385 14.7372 0.771977 12.2038 0.801957C8.34763 0.801957 4.8212 2.97552 3.08984 6.42325L6.47761 9.05027C7.28333 6.63311 9.54309 4.83805 12.2038 4.83805Z"
                    fill="#EA4335"
                  />
                </svg>
              </span>
              <span className="">GOOGLE PAY</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
