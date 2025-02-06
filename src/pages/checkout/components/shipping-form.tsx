import {
  CalendarIcon,
  ChevronDownIcon,
  Loader2,
  PenSquare,
} from "lucide-react";
import { useFormContext } from "react-hook-form";

import { format } from "date-fns";
import { Button } from "../../../dashboard/components/button";
import { Checkbox } from "../../../dashboard/components/checkbox";
import { Input } from "../../../dashboard/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../dashboard/components/select";

const timeSlots = [
  "09:00 - 11:00",
  "11:00 - 13:00",
  "13:00 - 15:00",
  "15:00 - 17:00",
  "17:00 - 19:00",
];

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function ShippingForm({
  onSubmit,
  onBack,
  isLoading,
}: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ShippingFormData>();

  const dontKnowAddress = watch("dontKnowAddress");

  // Get tomorrow's date as the minimum date for delivery
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = format(tomorrow, "yyyy-MM-dd", {});

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 ">
      <div className="flex items-center justify-between border-b border-gray-600 pb-4">
        <div className="flex items-center space-x-2">
          <span className="text-green-500">✓</span>
          <h2 className="text-xl text-gray-400">Contact information</h2>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-gray-400 "
          disabled={isLoading}
        >
          <PenSquare className="w-5 h-5" />
        </button>
      </div>

      <div>
        <h2 className="text-xl mb-6 ">2 Shipping details</h2>
        <div className="space-y-4">
          <div>
            <Input
              {...register("recipientName")}
              placeholder="Recipients Name"
              className="w-full placeholder:!text-gray-400   outline outline-[#D2D2D7] text-black rounded-none border-0 h-14"
              disabled={isLoading}
            />
            {errors.recipientName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.recipientName.message}
              </p>
            )}
          </div>

          <div>
            <Input
              {...register("recipientPhone")}
              type="tel"
              placeholder="Recipients Phone number *"
              className="w-full placeholder:!text-gray-400   outline outline-[#D2D2D7] text-black rounded-none border-0 h-14"
              disabled={isLoading}
              pattern="[0-9]*"
            />
            {errors.recipientPhone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.recipientPhone.message}
              </p>
            )}
          </div>

          <div className="relative">
            <Input
              {...register("deliveryDate")}
              type="date"
              min={minDate}
              placeholder="Date of Delivery"
              className="w-full placeholder:!text-gray-400   outline outline-[#D2D2D7] text-black rounded-none border-0 h-14"
              disabled={isLoading}
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            {errors.deliveryDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.deliveryDate.message}
              </p>
            )}
          </div>

          <div className="relative">
            <Select
              onValueChange={(value) => setValue("deliveryTime", value)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full placeholder:!text-gray-400   outline outline-[#D2D2D7] text-black rounded-none border-0 h-14">
                <SelectValue placeholder="Delivery Time" />
              </SelectTrigger>
              <SelectContent className=" bg-white text-black">
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register("deliveryTime")} />
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            {errors.deliveryTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.deliveryTime.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              {...register("street")}
              placeholder="Street"
              className="w-full placeholder:!text-gray-400   outline outline-[#D2D2D7] text-black rounded-none border-0 h-14"
              disabled={isLoading || dontKnowAddress}
            />
            <Input
              {...register("apartmentNumber")}
              placeholder="Apartment Number"
              className="w-full placeholder:!text-gray-400   outline outline-[#D2D2D7] text-black rounded-none border-0 h-14"
              disabled={isLoading || dontKnowAddress}
            />
          </div>
          {errors.street && (
            <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              {...register("dontKnowAddress")}
              id="dontKnowAddress"
              className="  outline outline-[#D2D2D7] size-4"
              disabled={isLoading}
              onCheckedChange={(checked) => {
                setValue("dontKnowAddress", checked as boolean);
                if (checked) {
                  setValue("street", "");
                  setValue("apartmentNumber", "");
                }
              }}
            />
            <label
              htmlFor="dontKnowAddress"
              className="text-sm text-gray-400 cursor-pointer"
            >
              I don't know the address, please call the recipient
            </label>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-black  border border-white rounded-none h-14 hover:bg-black/90"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "CONTINUE TO PAYMENT"
        )}
      </Button>

      <div className="opacity-50">
        <h2 className="text-xl ">3 Payment</h2>
      </div>
    </form>
  );
}
