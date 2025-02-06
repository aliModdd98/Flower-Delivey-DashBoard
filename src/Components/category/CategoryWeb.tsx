import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../dashboard/components/LoadingSpinner";
import { getCategory } from "../../store/slices/categorySlice";
import { useReduxDispatch, useReduxSelector } from "../../store/store";
// import { useParams } from "react-router-dom";

const CategoryWeb = () => {
  const dispatch = useReduxDispatch();
  const { category, loading } = useReduxSelector((state) => state.category);
  // const { id } = useParams();

  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) {
      navigate("not-found");
      return;
    }
    dispatch(getCategory(id));
  }, [dispatch, id, navigate]);

  const { image, title, products } = category;

  return (
    <>
      {loading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-wrap lg:flex-nowrap border-x border-textPrimaryColor">
          <div className="relative h-[420px] md:h-[500px] lg:h-[720px] w-full lg:w-1/2 ">
            <img
              src={`${import.meta.env.VITE_PUBLIC_API_BASE_URL}${image}`}
              alt="Fresh Flowers"
              className="h-[420px] md:h-[500px] lg:h-[720px] lg:border-0 border-b border-textPrimaryColor w-full object-cover"
            />
            <h1 className="absolute inset-0 flex items-center justify-center text-white font-semibold text-6xl z-10 drop-shadow-lg">
              {title}
            </h1>
          </div>
          <div className="w-full lg:w-1/2 border-l border-textPrimaryColor">
            <div className="flex flex-wrap">
              {products.map((product) => {
                if (product.stock === "0") return null;
                return (
                  <button
                    className="h-[360px] w-full relative md:w-1/2"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <img
                      src={`${import.meta.env.VITE_PUBLIC_API_BASE_URL}${
                        product.image
                      }`}
                      alt="error"
                      className="h-[360px] w-full object-cover border-r border-b border-textPrimaryColor"
                    />
                    <div className="absolute inset-0 mb-6 flex items-center justify-end flex flex-col">
                      <h1 className="font-medium text-textPrimaryColor">
                        {product.title}
                      </h1>
                      <p className="text-sm font-medium text-textSecondrayColor">
                        price {product.price}$
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryWeb;
