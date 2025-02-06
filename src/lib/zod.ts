import { z } from "zod";

const passwordZodSchema = (name = "password") =>
  z
    .string({
      invalid_type_error: `${name} must be a string`,
      required_error: `${name} is required`,
    })
    .min(8, `${name} cannot be less then 8 characters`)
    .max(24, `${name} cannot be more then 24 charecters`);
// .refine((value) => {
//   return /(?=.*[A-Z])(?=.*\d)/.test(value);
// }, `${name} must have at least one capital and one number`);

const UserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
  email: z.string().email("Invalid email address."),
  phone: z.string(),
  subscriptions: z.string().nullable().default(null),
  verified: z.boolean().optional().default(false),
  password: passwordZodSchema("password"),
  password_confirmation: passwordZodSchema("password_confirmation"),
});
const signup = UserSchema.omit({
  subscriptions: true,
  verified: true,
});

const login = UserSchema.pick({ email: true, password: true });
const Forgot_Password = UserSchema.pick({ email: true });
const ResendVerifyCode = UserSchema.pick({ email: true });

const addReviewSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  text: z.string().trim().min(1, "text is required"),
});

const validateUpdateReviewSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  text: z.string().trim().min(1, "text is required"),
});

const CartSchema = z.object({
  _id: z.string(),
  discount: z.coerce
    .number()
    .min(0, { message: "Discount must be a non-negative number." })
    .max(100, { message: "Discount cannot exceed 100." }),
  status: z.enum(["active", "complete"], {
    required_error:
      "Status is required and must be either 'active' or 'complete'.",
  }),
  totalAmount: z.coerce
    .number()
    .min(0, { message: "Total amount must be a positive number." }),
  products: z
    .array(
      z.string({
        required_error: "Products must be an array of strings.",
      })
    )
    .nonempty({ message: "Products array must contain at least one product." }),
  user_id: z
    .string({
      required_error: "User ID is required.",
    })
    .min(1),
});

const CreateUserSchema = UserSchema.refine(
  (data) => data.password === data.password_confirmation,
  {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  }
);

const EditUserSchema = UserSchema.partial();
const CreateCartSchema = CartSchema.omit({
  _id: true,
});

const EditCartSchema = CartSchema.partial();

const OrderSchema = z.object({
  _id: z.string({
    required_error: "Order ID is required.",
  }),
  cart_id: z.string({
    required_error: "Cart ID is required.",
  }),
  products: z.array(
    z.string({
      required_error: "Products are required.",
    })
  ),
  total: z.coerce
    .number()
    .min(0, { message: "Total must be a positive number." }),
  address: z.string({
    required_error: "Address is required and must be a string.",
  }),
  isDone: z.boolean().optional().default(false),
});
// Address schema
const addressSchema = z.object({
  street: z.string().optional(),
  apartmentNumber: z.number().optional(),
});

// Product schema
const productSchema = z.object({
  title: z.string(),
  image: z.string(),
  priceAfterDiscount: z.number(),
  discount: z.number().optional(),
  quantity: z.number(),
});
// Create Order schema
const createOrderSchema = z.object({
  array_product: z.array(productSchema),
  totalAmount: z.number(),
  discountGift: z.number().optional(),
  discountSubscribe: z.number().optional(),
  cart_id: z.string(), // Assuming the `cart_id` is passed as a string
  recipientName: z.string(),
  recipientPhone: z.string(),
  dateDelivery: z.date(),
  timeDelivery: z.string(),
  address: addressSchema,
  doesKnowAddress: z.boolean().optional().default(true),
  cardNumber: z.string(),
  cvvCode: z.string(),
  isDone: z.boolean().default(false),
});

// Edit Order schema
const editOrderSchema = z
  .object({
    array_product: z.array(productSchema).optional(),
    totalAmount: z.number().optional(),
    discountGift: z.number().optional(),
    discountSubscribe: z.number().optional(),
    cart_id: z.string().optional(),
    recipientName: z.string().optional(),
    recipientPhone: z.string().optional(),
    dateDelivery: z.date().optional(),
    timeDelivery: z.string().optional(),
    address: addressSchema.optional(),
    doesKnowAddress: z.boolean().optional(),
    cardNumber: z.string().optional(),
    cvvCode: z.string().optional(),
    isDone: z.boolean(),
  })
  .partial();

  const CompareVerification = z.object({
    emailConfirmToken: z.string().min(1, "Verify Code is required"),
    email: z.string().email("Invalid email address."),
  });
  
export const validateSchemas = {
  signup,
  login,
  Forgot_Password,
  ResendVerifyCode,
  CompareVerification,
  user: UserSchema,
  addReview: addReviewSchema,
  editReview: validateUpdateReviewSchema,
  createUser: CreateUserSchema,
  editUser: EditUserSchema,
  cart: CartSchema,
  createCart: CreateCartSchema,
  editCart: EditCartSchema,
  order: OrderSchema,
  createOrder: createOrderSchema,
  editOrder: editOrderSchema,

};
