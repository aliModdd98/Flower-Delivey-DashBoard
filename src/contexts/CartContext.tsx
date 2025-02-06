import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, ReactNode, useContext } from "react";
import { api } from "../lib/ajax/api";
import { useReduxSelector } from "../store/store";
export type AccessoryType = {
  _id: string;
  title: string;
  image: string;
  stock: number;
  description: string;
  price: number;
};
export type ProductType = {
  image: string;
  price: string;
  title: string;
  _id: string;
};
export type CartItem = {
  productId: ProductType;
  accessoriesId?: AccessoryType[];
  productQuantity: number;
};

type CartData = {
  items: CartItem[];
  priceAll?: number;
  priceAllAfterDiscount?: number;
};

type AddItemPayload = {
  productId: string;
  accessoriesId?: string[];
  productQuantity: number;
};

type UpdateQuantityPayload = {
  productId: string;
  productQuantity: number;
};
export type UpdateCartItemPayload = {
  productId: string;
  productQuantity: number;
  accessoriesId?: string[];
};
const fetchCart = async (): Promise<CartData> => {
  const response = await api.get("/cart");
  return response.data.data;
};

const addItemToCart = async (item: AddItemPayload) => {
  await api.post("/cart", item);
};

const removeItemFromCart = async (productId: string) => {
  await api.delete(`/cart/${productId}`);
};
const removeAccessoryFromCart = async ({
  accessoryId,
  productId,
}: {
  productId: string;
  accessoryId: string;
}) => {
  await api.delete(`/cart/${productId}/${accessoryId}`);
};

const updateItemQuantity = async (payload: UpdateQuantityPayload) => {
  const { productId, productQuantity } = payload;
  await api.put(`/cart/${productId}`, { productQuantity });
};
const updateItem = async (payload: UpdateCartItemPayload) => {
  const { productId, productQuantity, accessoriesId } = payload;
  await api.put(`/cart/${productId}`, { productQuantity, accessoriesId });
};

type CartContextType = {
  data: CartData | undefined;
  isLoading: boolean;
  isError: boolean;
  addItem: (item: AddItemPayload) => void;
  removeItem: (productId: string) => void;
  removeAccessory: (productId: string, accessoryId: string) => void;
  updateQuantity: (payload: UpdateQuantityPayload) => void;
  updateCartItem: (payload: UpdateCartItemPayload) => void;
  refetch: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { user } = useReduxSelector((state) => state.auth);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: () => Boolean(user?._id),
    refetchOnMount: false,
    initialData: undefined,
  });

  const addItemMutation = useMutation({
    mutationFn: addItemToCart,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      console.log(newItem);
      const previousCart = queryClient.getQueryData<CartData>(["cart"]);

      if (previousCart) {
        queryClient.setQueryData(["cart"], {
          ...previousCart,
          items: [...previousCart.items, newItem],
        });
      }

      return { previousCart };
    },
    onError: (_err, _newItem, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: removeItemFromCart,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<CartData>(["cart"]);

      if (previousCart) {
        queryClient.setQueryData(["cart"], {
          ...previousCart,
          items: previousCart.items.filter(
            (item) => item.productId._id !== productId
          ),
        });
      }

      return { previousCart };
    },
    onError: (_err, _productId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  const removeAccessoryMutation = useMutation({
    mutationFn: removeAccessoryFromCart,
    onMutate: async ({
      accessoryId,
      productId,
    }: {
      productId: string;
      accessoryId: string;
    }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<CartData>(["cart"]);

      if (previousCart) {
        const updatedProduct = previousCart.items.find(
          (item) => item.productId._id === productId
        );
        const updatedAccessory = updatedProduct?.accessoriesId?.filter(
          (acc) => acc._id !== accessoryId
        );
        queryClient.setQueryData(["cart"], {
          ...previousCart,
          items: previousCart.items.map((item) =>
            item.productId._id === productId
              ? { ...item, accessoriesId: updatedAccessory }
              : item
          ),
        });
      }

      return { previousCart };
    },
    onError: (_err, _productId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`product/${variables.productId}`],
      });
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      queryClient.refetchQueries({
        queryKey: [`product/${variables.productId}`, "cart"],
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: updateItemQuantity,
    onMutate: async ({ productId, productQuantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<CartData>(["cart"]);

      if (previousCart) {
        queryClient.setQueryData(["cart"], {
          ...previousCart,
          items: previousCart.items.map((item) =>
            item.productId._id === productId
              ? { ...item, productQuantity }
              : item
          ),
        });
      }

      return { previousCart };
    },
    onError: (_err, _updatedItem, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  const updateCartItemMutation = useMutation({
    mutationFn: updateItem,
    onMutate: async ({
      productId,
      productQuantity,
      accessoriesId,
    }: UpdateCartItemPayload) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<CartData>(["cart"]);

      if (previousCart) {
        queryClient.setQueryData(["cart"], {
          ...previousCart,
          items: previousCart.items.map((item) =>
            item.productId._id === productId
              ? {
                  ...item,
                  productQuantity,
                  accessoriesId: accessoriesId || item.accessoriesId,
                }
              : item
          ),
        });
      }

      return { previousCart };
    },
    onError: (_err, _updatedItem, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  const addItem = (item: AddItemPayload) => addItemMutation.mutate(item);
  const removeItem = (productId: string) =>
    removeItemMutation.mutate(productId);
  const removeAccessory = (productId: string, accessoryId: string) =>
    removeAccessoryMutation.mutate({ productId, accessoryId });
  const updateQuantity = (payload: UpdateQuantityPayload) =>
    updateQuantityMutation.mutate(payload);
  const updateCartItem = (payload: UpdateCartItemPayload) =>
    updateCartItemMutation.mutate(payload);

  return (
    <CartContext.Provider
      value={{
        data,
        isLoading,
        isError,
        addItem,
        removeItem,
        removeAccessory,
        updateQuantity,
        refetch,
        updateCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
