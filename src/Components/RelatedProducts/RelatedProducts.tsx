import { useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../dashboard/components/LoadingSpinner";
import { getRelatedProduct } from "../../store/slices/productSlice";
import { useReduxDispatch, useReduxSelector } from "../../store/store";

export function RelatedProducts({ productId }: { productId: string }) {
  const dispatch = useReduxDispatch();
  const { products, loading, error } = useReduxSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getRelatedProduct(productId));
  }, [dispatch, productId]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        No Related Products Found
      </div>
    );
  }

  return (
    <div>
      <div className="text-center p-4 md:p-8 border-y border-black">
        <h2 className="text-xl md:text-2xl">You may also like...</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {products.map((product, index) => {
          return (
            <Link
              to={`/product/${product._id}`}
              key={product.id + "-" + index}
              className={`block group border-t sm:first:border-t-0 sm:nth-2:border-t-0 md:border-t-0 ${
                index < products.length - 1 ? "md:border-r border-black" : ""
              }`}
            >
              <div className="aspect-square relative">
                <img
                  src={`${import.meta.env.VITE_PUBLIC_API_BASE_URL}${
                    product.image
                  }`}
                  alt={product.title}
                  className="object-cover absolute inset-0 w-full h-full"
                />
              </div>
              <div className="text-center p-4">
                <h3 className="text-base">{product.title}</h3>
                <p className="text-sm text-gray-600">price {product.price}$</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
