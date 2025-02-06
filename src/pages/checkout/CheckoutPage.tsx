import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalStorage } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { api } from "../../lib/ajax/api";
import { CheckoutForm } from "./components/checkout-form";
import { OrderSummary } from "./components/order-summary";
import { PaymentForm } from "./components/payment-form";
import { ProgressSteps } from "./components/progress-steps";
import { ShippingForm } from "./components/shipping-form";
import { useReduxSelector } from "../../store/store";
import { useNavigate } from "react-router-dom";

// Zod schema for validation
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

const shippingFormSchema = z
  .object({
    recipientName: z.string().min(1, "Recipient name is required"),
    recipientPhone: z.string().min(10, "Valid phone number is required"),
    deliveryDate: z.string().min(1, "Delivery date is required"),
    deliveryTime: z.string().min(1, "Delivery time is required"),
    street: z.string().optional(),
    apartmentNumber: z.string().optional(),
    dontKnowAddress: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // Only require street if dontKnowAddress is false
      if (!data.dontKnowAddress) {
        if (!data.street) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Street is required unless 'don't know address' is checked",
      path: ["street"],
    }
  );
const paymentFormSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});
const initialOrder = {
  contact: null,
  shipping: null,
  payment: null,
  loading: false,
  error: null,
};
type CreateOrder = {
  name: string;
  email: string;
  phone: string;
  recipientName: string;
  recipientPhone: string;
  deliveryDate: string;
  deliveryTime: string;
  discountGift?: string;
  street?: string;
  apartmentNumber?: string;
  dontKnowAddress: boolean;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};
export default function CheckoutPage() {
  const [state, setState] = useLocalStorage<CheckoutState>({
    key: "order",
    defaultValue:
      JSON.parse(localStorage.getItem("order") || "{}") ?? initialOrder,
  });

  const [discountGift, setDiscountGift] = useState<string>();
  const [step, setStep] = useState<CheckoutStep>("information");

  const contactMethods = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: state.contact || { name: "", email: "", phone: "" },
  });

  const shippingMethods = useForm({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: state.shipping || {
      dontKnowAddress: false,
    },
  });

  const paymentMethods = useForm({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: state.payment || { cardNumber: "", expiryDate: "", cvv: "" },
  });

  // Handle form submit
  const handleContactSubmit = (data: ContactFormData) => {
    setState((prev) => ({ ...prev, contact: data }));
    setStep("shipping");
  };

  const handleShippingSubmit = (data: ShippingFormData) => {
    setState((prev) => ({ ...prev, shipping: data }));
    setStep("payment");
  };
  const makePurchaseMutation = useMutation({
    mutationFn: async (data: CreateOrder) => {
      console.log("Data", data);
      return await api.post("/order", data);
    },
    onSuccess: () => {
      toast.success("Order placed successfully!");
    },
    onError: (error: AxiosError) => {
      //@ts-expect-error backend api configuration
      toast.error(error.response.data?.message || "failed to submit");
      console.error(error);
    },
  });
  const handlePaymentSubmit = (payment: z.infer<typeof paymentFormSchema>) => {
    if (!state.contact || !state.shipping) return;
    makePurchaseMutation.mutate({
      ...state.contact,
      ...payment,
      ...state.shipping,
      discountGift,
    });
    // setState((prev) => ({ ...prev, payment: data }));
  };

  // Handlers to go back to previous steps
  const handleEditContact = () => setStep("information");
  const handleEditShipping = () => setStep("shipping");
  const { user } = useReduxSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [navigate, user]);
  return (
    <main className="">
      <div className="flex flex-col-reverse md:flex-row lg:grid lg:grid-cols-2">
        <div className="flex-1 p-8">
          <ProgressSteps currentStep={step} />

          {state.error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 mb-6 rounded-none">
              {state.error}
            </div>
          )}

          {makePurchaseMutation.isPending ? (
            <div className=" flex-1 border aspect-square border-gray-400 flex justify-center items-center">
              <Loader2Icon className=" animate-spin size-12 text-pink-600" />
            </div>
          ) : (
            <>
              {step === "information" && (
                <FormProvider {...contactMethods}>
                  <CheckoutForm
                    onSubmit={handleContactSubmit}
                    isLoading={state.loading}
                  />
                </FormProvider>
              )}
              {step === "shipping" && (
                <FormProvider {...shippingMethods}>
                  <ShippingForm
                    onSubmit={handleShippingSubmit}
                    onBack={handleEditContact}
                    isLoading={state.loading}
                  />
                </FormProvider>
              )}
              {step === "payment" && (
                <FormProvider {...paymentMethods}>
                  <PaymentForm
                    onSubmit={handlePaymentSubmit}
                    onEditContact={handleEditContact}
                    onEditShipping={handleEditShipping}
                    isLoading={state.loading}
                  />
                </FormProvider>
              )}
            </>
          )}
        </div>
        <OrderSummary
          discountGift={discountGift}
          applyGiftCard={(val: string) => setDiscountGift(val)}
        />
      </div>
    </main>
  );
}
