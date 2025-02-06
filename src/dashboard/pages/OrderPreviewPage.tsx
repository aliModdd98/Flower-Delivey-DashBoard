import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/ajax/api";
import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
import { cn } from "../../lib/utils";

interface Accessory {
  _id: string;
  title: string;
  image: string;
  currentPrice: number;
  quantity: number;
}

interface Product {
  _id: string;
  title: string;
  image: string;
  currentPrice: number;
  quantity: number;
  accessories?: Accessory[];
}

interface Order {
  _id: string;
  array_product: Product[];
  totalAmount: number;
  discountSubscribe: number | null;
  cart_id: string;
  recipientName: string;
  recipientPhone: string;
  dateDelivery: string;
  deliveryDate: string;
  street: string;
  apartmentNumber: number | null;
  dontKnowAddress: boolean;
  cardNumber: string;
  cvvCode: string;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
}

async function getOrderById(id: string): Promise<Order> {
  const response = await api.get(`/orders/${id}`);
  return response.data.data;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      className="mb-8 bg-muted rounded-md p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-primary">{title}</h2>
      <div className="p-4 rounded-md bg-card">{children}</div>
    </motion.section>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <p className="mb-2 flex flex-wrap items-center">
      <span className="font-medium text-primary ltr:mr-2 rtl:ml-2">
        {label}:
      </span>
      <span className="text-secondary-foreground">
        {value !== null ? value : "N/A"}
      </span>
    </p>
  );
}

function AccessoriesSection({ accessories }: { accessories: Accessory[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        Accessories
        {isOpen ? (
          <ChevronUp className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0" />
        )}
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 space-y-2 overflow-hidden"
          >
            {accessories.map((accessory) => (
              <div
                key={accessory._id}
                className="flex items-center space-x-2 rtl:space-x-reverse"
              >
                <div className="relative w-12 h-12 shrink-0">
                  <img
                    src={accessory.image || "/placeholder.svg"}
                    alt={accessory.title}
                    className="rounded-md object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">
                    {accessory.title}
                  </p>
                  <p className="text-xs text-secondary-foreground">
                    ${accessory.currentPrice.toFixed(2)} x {accessory.quantity}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      className="p-4 border rounded-md shadow-sm bg-card"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <div className="relative w-20 h-20 shrink-0">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="rounded-md object-cover w-full h-full"
          />
        </div>
        <div>
          <p className="font-semibold text-primary">{product.title}</p>
          <p className="text-sm text-secondary-foreground">
            ${product.currentPrice.toFixed(2)}
          </p>
          <p className="text-sm text-secondary-foreground">
            Quantity: {product.quantity}
          </p>
        </div>
      </div>
      {product.accessories && product.accessories.length > 0 && (
        <AccessoriesSection accessories={product.accessories} />
      )}
    </motion.div>
  );
}

function LoadingSkeleleton() {
  return (
    <div className="w-full min-h-screen p-4 md:p-6">
      <Card className="max-w-4xl mx-auto overflow-hidden">
        <CardContent className="p-6">
          <Skeleton className="h-10 w-3/4 mb-6" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="mb-8">
              <Skeleton className="h-8 w-1/2 mb-4" />
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-6 w-full" />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
export function OrderPreviewPage() {
  const navigate = useNavigate();
  const { id: orderId } = useParams<{ id: string }>();

  const {
    data: order,
    isLoading,
    error,
  } = useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: !!orderId,
  });

  useEffect(() => {
    if (error) {
      navigate("/not-found");
    }
  }, [error, navigate]);

  if (isLoading) {
    return <LoadingSkeleleton />;
  }

  if (!order) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-full min-h-screen p-4 md:p-6 rtl:space-x-reverse"
      >
        <Card className="max-w-4xl mx-auto overflow-hidden">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-primary">
              Order Details
            </h1>

            <Section title="Recipient Information">
              <InfoItem label="Name" value={order.recipientName} />
              <InfoItem label="Phone" value={order.recipientPhone} />
              <InfoItem
                label="Address"
                value={
                  order.dontKnowAddress
                    ? "Address not provided"
                    : `${order.street}${
                        order.apartmentNumber
                          ? `, Apt ${order.apartmentNumber}`
                          : ""
                      }`
                }
              />
            </Section>

            <Section title="Delivery Information">
              <InfoItem
                label="Date"
                value={new Date(order.dateDelivery).toLocaleDateString()}
              />
              <InfoItem label="Delivery Date" value={order.deliveryDate} />
            </Section>

            <Section title="Products">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.array_product.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </Section>

            <Section title="Payment Information">
              <InfoItem
                label="Total Amount"
                value={`$${order.totalAmount.toFixed(2)}`}
              />
              {order.discountSubscribe && (
                <InfoItem
                  label="Subscription Discount"
                  value={`$${order.discountSubscribe.toFixed(2)}`}
                />
              )}
              <InfoItem
                label="Card Number"
                value={`**** **** **** ${order.cardNumber.slice(-4)}`}
              />
              <InfoItem label="CVV" value="***" />
            </Section>

            <Section title="Order Status">
              <InfoItem
                label="Status"
                value={order.isDone ? "Completed" : "Pending"}
              />
              <InfoItem
                label="Created At"
                value={new Date(order.createdAt).toLocaleString()}
              />
              <InfoItem
                label="Updated At"
                value={new Date(order.updatedAt).toLocaleString()}
              />
            </Section>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
