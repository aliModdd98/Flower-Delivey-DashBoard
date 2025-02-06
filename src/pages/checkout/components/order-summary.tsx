import { Check, LockIcon, ShoppingCart } from "lucide-react";
import { useRef, useState } from "react";
import { useCart } from "../../../contexts/CartContext";

export function OrderSummary({
  applyGiftCard,
  discountGift,
}: {
  discountGift?: string;
  applyGiftCard: (val: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data } = useCart();
  const ref = useRef(null);
  return (
    <div className="bg-[#F5F5F7] flex-1  lg:p-8">
      <div className="md:hidden h-[72px] flex justify-between items-center py-4 px-4 border-t border-b border-[#121212]">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-sm font-medium"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Show order summary {isExpanded ? "▼" : "▲"}
        </button>
        <span className="text-lg">${data?.priceAll}</span>
      </div>

      <div
        className={`${
          isExpanded ? "block" : "hidden"
        } md:block px-4 py-8 lg:px-0`}
      >
        <h2 className="text-base font-medium mb-6 hidden lg:block">
          ORDER SUMMARY
        </h2>
        {data?.items.map((item) => {
          return (
            <div
              key={item.productId._id}
              className="flex items-start space-x-4 mb-8"
            >
              <div className="w-[100px] h-[100px] border border-gray-200 relative">
                <img
                  src={`${import.meta.env.VITE_PUBLIC_API_BASE_URL}${item.productId.image}`}
                  alt={item.productId.title}
                  className="object-cover absolute inset-0 size-full"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-normal">
                  {item.productId.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Quantity ({item.productQuantity})
                </p>
              </div>
              <span className="text-base">${item.productId.price}</span>
            </div>
          );
        })}

        <div className="mb-8">
          <p className="text-sm mb-4">
            If you have our gift card, enter the code to get discounts
          </p>
          <div className="flex flex-col md:flex-row  gap-4">
            <input
              ref={ref}
              placeholder="Gift card"
              className=" px-4  h-14 rounded-none border border-gray-400 bg-white"
            />
            <button
              onClick={() => {
                const input = ref.current as unknown as HTMLInputElement;

                applyGiftCard(input.value);
              }}
              className="bg-black h-14 flex justify-center items-center text-white rounded-none hover:bg-black/90 px-8"
            >
              {discountGift ? "APPLY" : <Check />}
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${data?.priceAll}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <span>Total</span>
            <span className="text-xl">${data?.priceAll}</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 mt-6 text-sm text-gray-600">
          <LockIcon className="w-4 h-4" />
          <span>Secure Checkout</span>
        </div>
      </div>
    </div>
  );
}
