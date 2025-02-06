import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const handleApiError = (error: unknown) => {  
  if (error instanceof AxiosError) {
    console.error("Axios error:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    toast.error(`Error: ${message}`);
  } else if (error instanceof Error) {
    console.error("General error:", error);
    toast.error(error.message || "An unexpected error occurred.");
  } else {
    console.error("Unexpected error:", error);
    toast.error("An unexpected error occurred.");
  }
};
export function convertDateFormat(dateValue: string | Date): string {
  let date: Date;

  if (typeof dateValue === "string") {
    date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string format");
    }
  } else if (dateValue instanceof Date) {
    date = dateValue;
  } else {
    throw new Error("Input must be a string or Date object");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} - ${hours}:${minutes}`;
}
