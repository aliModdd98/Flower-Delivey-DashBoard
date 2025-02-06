declare global {
  type CheckoutStep = "information" | "shipping" | "payment";
  type AccessoriesType = {
    title: string;
    image: string;
    stock: number;
    description: string;
    price: number;
  };
  type ContactFormData = {
    name: string;
    email: string;
    phone: string;
  };

  type ShippingFormData = {
    recipientName: string;
    recipientPhone: string;
    deliveryDate: string;
    deliveryTime: string;
    street: string;
    apartmentNumber: string;
    dontKnowAddress: boolean;
  };

  type PaymentFormData = {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    paymentMethod: "card" | "apple-pay" | "google-pay";
  };

  type CheckoutState = {
    contact: ContactFormData | null;
    shipping: ShippingFormData | null;
    payment: PaymentFormData | null;
    loading: boolean;
    error: string | null;
  };

  type User = {
    _id: string;
    name: string;
    email: string;
    subscriptions: string;
    verified: boolean;
    isAdmin: boolean;
    createdAt: Date | string;
    emailConfirmToken?: string;
    isAccountVerified?: boolean;
    isReminder: boolean;
  };

  type SubProduct = {
    _id: string;
    price: number;
    quantity: number;
    name: string;
    image: string;
  };

  type Address = {
    street: string;
    apartmentNumber: number;
    _id: string;
  };

  type Product = {
    title: string;
    image: string;
    priceAfterDiscount: number;
    discount?: number; // Optional, as it's missing in one product
    quantity: number;
    _id: string;
  };

  type Cart = {
    _id: string;
    hasDiscount: boolean;
    totalAmount: number;
    product_array: Product[];
    user_id: string;
  };
}

export interface PaginationInfo {
  totalPlans: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export enum EnumsDialogShow {
  Login = "login",
  SignUp = "sign-up",
  ForgotPassowrd = "forgot-password",
  Verify = "verify-code",
  Hide = "hide",
}

export enum EnumsSearchParams {
  dialog = "dialog",
}

export {};
