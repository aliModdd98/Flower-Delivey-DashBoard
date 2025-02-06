import { ArrowBigLeft } from "lucide-react";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getProduct } from "../../../store/slices/productSlice";
import { useReduxDispatch, useReduxSelector } from "../../../store/store";
import Loader from "../../components/Loader";

const ShowProductDetails = () => {
  const { id } = useParams();
  const dispatch = useReduxDispatch();
  const { product, loading } = useReduxSelector((state) => state.product);

  useEffect(() => {
    if (id) {
      dispatch(getProduct(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  const { title, price, description, stock, discount, quantity, category_id } =
    product;
  return (
    <div className="min-h-screen text-white p-5">
      <NavLink to="/dashboard/products" className="mb-5 inline-block">
        <ArrowBigLeft
          size={40}
          className="cursor-pointer text-black dark:text-white"
        />
      </NavLink>
      <div className="text-[#020817] dark:text-white dark:bg-[#020817] shadow-lg w-full mx-auto rounded p-5 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 w-full">
          <img
            className="w-full lg:h-full object-cover rounded-lg"
            src={`${import.meta.env.VITE_PUBLIC_API_BASE_URL}${product.image}`}
            alt={title || "Product"}
          />
        </div>
        <div className="lg:w-1/2 w-full flex flex-col justify-between">
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Product Name: {title}
            </h3>
            <div className="flex justify-between mb-4">
              <h3 className="text-lg lg:text-xl font-bold">Price: {price}$</h3>
            </div>
            {discount && (
              <h3 className="text-lg lg:text-xl font-bold mb-4">
                Discount: {discount}
              </h3>
            )}
            <h3 className="text-lg lg:text-xl font-bold mb-4">
              Quantity: {quantity}
            </h3>
            <h3 className="text-lg lg:text-xl font-bold mb-4">
              Stock: {stock}
            </h3>
            <h3 className="text-lg lg:text-xl font-bold mb-4">
              Description: {description}
            </h3>
            <h3 className="text-lg lg:text-xl font-bold mb-4">
              Category Name:{" "}
              {
                //@ts-expect-error types conflict
                category_id.title
              }
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProductDetails;
