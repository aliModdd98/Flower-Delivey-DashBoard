import { AxiosError } from "axios";

//Extracts an error message from an AxiosError or returns a default message.
export const parseErrorMessage = (error: unknown, defaultMessage: string): string => {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return error.response.data.message;
    }
    return defaultMessage;
  };