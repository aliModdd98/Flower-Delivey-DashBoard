import { AxiosError } from "axios";
import React, { FormEvent, useState } from "react";
import { api } from "../../../../lib/ajax/api";
import SectionTitle from "../../SectionTitle/SectionTitle";

const CallBack: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");

  const storedUser = localStorage.getItem("user");

  let phoneInputValue = " click on book a call";
  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user.phone) phoneInputValue = user.phone;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setResponseMessage("Authentication token not found. Please log in.");
        setIsSubmitting(false);
        return;
      }

      const response = await api.post("/contact");

      if (response.status === 201) {
        setResponseMessage(
          response.data.message ||
            "Your request has been submitted successfully!"
        );
      } else {
        setResponseMessage("Failed to submit your request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      if (error instanceof AxiosError) {
        setResponseMessage(error.response?.data.message);
      } else {
        setResponseMessage("An error occurred. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="aj-callback px-4 py-10 md:px-[80px] md:pt-[80px] md:pb-[99px] border border-[#121212] border-b-0">
      <SectionTitle title="To Contact Us" />
      <p className="mb-4 leading-[25.2px] mt-6 md:mt-0 text-lg">
        We will call you back
      </p>
      <form
        className="flex flex-col flex-wrap md:flex-row gap-4"
        onSubmit={handleSubmit}
      >
        <input
          type="tel"
          placeholder="+380 XX XXX XX XX"
          value={phoneInputValue}
          className="border border-[#D2D2D7] px-7 py-2 w-full md:w-[272px] h-[56px]"
          disabled
        />
        <button
          type="submit"
          className="bg-black text-white px-7 py-2 w-full md:w-[272px] h-[56px] min-w-fit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "BOOK A CALL"}
        </button>
      </form>
      {responseMessage && (
        <p className="mt-4 text-lg text-[#121212]">{responseMessage}</p>
      )}
    </div>
  );
};

export default CallBack;
