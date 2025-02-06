import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Label } from "../../../Components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../Components/ui/radio-group";
import { useCart } from "../../../contexts/CartContext";
import { Button } from "../../../dashboard/components/button";
import LoadingSpinner from "../../../dashboard/components/LoadingSpinner";
import { api } from "../../../lib/ajax/api";
import { cn } from "../../../lib/utils";
import { ScrollArea } from "../../../Components/ui/ScrollArea";
import { useReduxSelector } from "../../../store/store";

type Category = {
  _id: string;
  title: string;
  image: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type Product = {
  _id: string;
  priceAfterDiscount: string;
  quantity: string;
  title: string;
  image: string;
  stock: string;
  price: string;
  category_id: Category;
  description: string;
  accessory_id: AccessoryType[];
  __v: number;
};

type AccessoryType = {
  _id: string;
  title: string;
  image: string;
  price: string;
  stock: string;
};

export const ProductDetails = ({ productId }: { productId: string }) => {
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`product/${productId}`],
    queryFn: async () => {
      const res = await api.get(`/product/${productId}`);
      return res.data?.data?.product as Product & { _id: string };
    },
    throwOnError: true,
  });
  const { user } = useReduxSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const { data, addItem, updateCartItem } = useCart();
  const InCartProduct = data?.items.find(
    (item) => item.productId._id === product?._id
  );
  const accessoriesIds = useMemo(() => {
    return InCartProduct?.accessoriesId?.map((acc) => acc._id);
  }, [InCartProduct?.accessoriesId]);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(
    accessoriesIds ?? []
  );
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    navigate("/not-found");
    return null;
  }

  const handleAddToCart = () => {
    if (InCartProduct) return toast.info("already in cart");
    addItem({
      productId: product._id,
      productQuantity: quantity,
      accessoriesId: selectedAccessories,
    });
    toast.success("Product added to cart");
  };

  return (
    <div className="grid grid-cols-1 border border-y-0 divide-x-[1px] divide-black xl:grid-cols-2">
      <div className="relative aspect-[420/375] md:h-full w-full">
        <img
          src={`${import.meta.env.VITE_PUBLIC_API_BASE_URL}${product.image}`}
          alt={product.title}
          className=" absolute inset-0 size-full"
        />
      </div>
      <div className="p-4 md:p-8 flex flex-col gap-6 md:gap-8">
        <div>
          <nav aria-label="Breadcrumb" className="text-sm mb-4">
            <ol className="flex">
              <li>
                <span className="text-gray-600 uppercase">
                  {product.category_id?.title}
                </span>
              </li>
              <li>
                <span className="mx-2" aria-hidden="true">
                  /
                </span>
              </li>
              <li>
                <span className="uppercase" aria-current="page">
                  {product.title}
                </span>
              </li>
            </ol>
          </nav>
          <h1 className="text-xl md:text-2xl mb-4 uppercase font-bold">
            {product.title} - ${product.price}
          </h1>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="gap-6 flex flex-col  h-full"
          >
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm">
                Quantity
              </Label>
              {product.stock === "0" ? (
                <p className="text-red-600 font-semibold">Out of stock</p>
              ) : (
                <div className="flex items-center justify-between border md:max-w-min border-black">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border-r border-black hover:bg-gray-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-4 shrink-0" />
                  </button>
                  <span className="px-8" aria-live="polite" aria-atomic="true">
                    {quantity}
                  </span>
                  <button
                    disabled={Number(product.stock) <= quantity}
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 border-l border-black hover:bg-gray-100"
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-4 shrink-0" />
                  </button>
                </div>
              )}
            </div>
            <AccessoriesSection
              accessories={product.accessory_id}
              selectedAccessories={selectedAccessories}
              setSelectedAccessories={(accessoryId: string) =>
                setSelectedAccessories((prev) => {
                  const updatedAccessory = prev.includes(accessoryId)
                    ? prev.filter((id) => id !== accessoryId)
                    : [...prev, accessoryId];
                  if (InCartProduct) {
                    updateCartItem({
                      productId: product._id,
                      productQuantity: InCartProduct?.productQuantity,
                      accessoriesId: updatedAccessory,
                    });
                  }

                  return updatedAccessory;
                })
              }
            />
            <PriceOptions />

            <Button
              onClick={handleAddToCart}
              className="w-full bg-black rounded-none text-white py-6 hover:bg-gray-900 text-lg font-semibold"
              disabled={product.stock === "0" || !user}
            >
              {user ? "ADD TO BASKET" : "Login To Continue"}
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

function AccessoriesSection({
  accessories,
  selectedAccessories,
  setSelectedAccessories,
}: {
  accessories: AccessoryType[];
  selectedAccessories: string[];
  setSelectedAccessories: (accessoryId: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (accessories.length === 0) {
    return (
      <div className="flex-1 border border-gray-200 flex justify-center items-center capitalize p-4">
        <p>No accessories available for this product</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-[#121212]/50 capitalize mb-2">
        Vase not included
      </p>
      <h2 className="text-sm mb-4 font-semibold">
        Excellent Combination with:
      </h2>
      <div className="relative flex justify-between items-center">
        <button
          onClick={() => scroll("left")}
          className="z-10 bg-white/80 p-2 rounded-full shadow-md"
          aria-label="Scroll left"
        >
          <ChevronLeft className="size-6 shrink-0" />
        </button>
        <ScrollArea className="w-full" ref={scrollRef}>
          <div className="flex space-x-4 pb-4 justify-center">
            {accessories.map((accessory) => {
              if (accessory.stock === "0") return null;

              return (
                <motion.div
                  key={accessory._id}
                  className={cn(
                    "flex-none relative border-2 rounded-lg overflow-hidden",
                    {
                      "border-pink-500": selectedAccessories.includes(
                        accessory._id
                      ),
                      "border-transparent": !selectedAccessories.includes(
                        accessory._id
                      ),
                    }
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    className="flex flex-col transition-colors hover:bg-pink-100 cursor-pointer w-[150px]"
                    onClick={() => setSelectedAccessories(accessory._id)}
                    aria-pressed={selectedAccessories.includes(accessory._id)}
                  >
                    <div className="relative h-[150px] w-full">
                      <img
                        src={`${import.meta.env.VITE_PUBLIC_API_BASE_URL}${
                          accessory.image
                        }`}
                        alt={accessory.title}
                        className=" absolute inset-0 size-full"
                      />
                    </div>
                    <div className="text-start p-2">
                      <h3 className="text-sm mb-1 font-medium">
                        {accessory.title}
                      </h3>
                      <p className="text-sm text-[#808080]">
                        ${accessory.price}
                      </p>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
        <button
          onClick={() => scroll("right")}
          className="z-10 bg-white/80 p-2 rounded-full shadow-md"
          aria-label="Scroll right"
        >
          <ChevronRight className="size-6 shrink-0" />
        </button>
      </div>
    </div>
  );
}

function PriceOptions() {
  return (
    <div className="space-y-4 ">
      <h3 className="font-bold mb-2">Price options</h3>
      <RadioGroup defaultValue="one-time">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="one-time" id="one-time" />
            <Label htmlFor="one-time">One time purchase. Price $100</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="subscribe" id="subscribe" />
            <Label htmlFor="subscribe">
              Subscribe now, and save 25% on this order.
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
