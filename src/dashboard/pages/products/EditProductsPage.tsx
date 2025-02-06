import { ArrowBigLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getCategories } from "../../../store/slices/categorySlice";
import { getProduct, updateProduct } from "../../../store/slices/productSlice";
import { useReduxDispatch, useReduxSelector } from "../../../store/store";
import Loader from "../../components/Loader";

const EditProductsPage = () => {
  const { id } = useParams();
  const dispatch = useReduxDispatch();
  const { product, loading } = useReduxSelector((state) => state.product);
  const { categories } = useReduxSelector((state) => state.category);
  console.log(id);
  const file = useRef<HTMLInputElement | null>(null);
  const [previewImage, setpreviewImage] = useState<string>("");
  // const [loading, setloading] = useState(false);
  const [title, settitle] = useState<string>("");
  const [description, setdescription] = useState<string>("");
  const [stock, setstock] = useState<string | number>("");
  const [price, setprice] = useState<string | number>("");
  const [quantity, setQuantity] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [image, setimage] = useState<string | File>("");
  const navigate = useNavigate();
  // const [size, setSize] = useState(1);

  const handleClick = () => {
    file.current?.click();
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files ? e.target.files[0] : null;
    if (image) {
      setimage(image);
      const imageUrl = URL.createObjectURL(image);
      setpreviewImage(imageUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(title, description, stock, price, image);
    const formData = new FormData();
    if (title) {
      formData.append("title", title);
    }
    if (description) {
      formData.append("description", description);
    }
    if (price) {
      formData.append("price", `${price}`);
    }

    if (quantity) {
      formData.append("quantity", quantity);
    }

    if (categoryId) {
      formData.append("category_id", categoryId);
    }

    if (stock) {
      formData.append("stock", `${stock}`);
    }
    if (image) {
      formData.append("image", image);
    }
    dispatch(updateProduct({ data: formData, id })).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        navigate("/dashboard/products");
      }
    });
  };

  useEffect(() => {
    dispatch(getProduct(id)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        console.log(product);
        settitle(product.title);
        setdescription(product.description);
        setstock(product.stock);
        setprice(product.price);
        setQuantity(product.quantity);
        //@ts-expect-error types conflict
        setCategoryId(product.category_id._id);
        setpreviewImage(
          `${import.meta.env.VITE_PUBLIC_API_BASE_URL}${product.image}`
        );
      }
    });
  }, []);
  useEffect(() => {
    dispatch(getCategories({})).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        console.log(categories);
      }
    });
  }, []);
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    setCategoryId(event.target.value);
  };

  return (
    <>
      <div className="dark:text-white">
        <NavLink to={"/dashboard/products"}>
          <ArrowBigLeft size={40} />
        </NavLink>
        {loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* Row 1: Title, Quantity, Stock */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="title" className="block mb-2">
                  Title :
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => settitle(e.target.value)}
                  placeholder="Title"
                  className="w-full h-12 px-3 dark:bg-gray-800 font-semibold border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="quantity" className="block mb-2">
                  Quantity :
                </label>
                <input
                  type="text"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Quantity"
                  className="w-full h-12 px-3 dark:bg-gray-800 font-semibold border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="stock" className="block mb-2">
                  Stock :
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={stock}
                  onChange={(e) => setstock(e.target.value)}
                  placeholder="Stock"
                  className="w-full h-12 px-3 dark:bg-gray-800 font-semibold border border-gray-300 rounded"
                  required
                />
              </div>
            </div>

            {/* Row 2: Price, Price After Discount, Category Id */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="price" className="block mb-2">
                  Price :
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={price}
                  onChange={(e) => setprice(e.target.value)}
                  placeholder="Price"
                  className="w-full h-12 px-3 dark:bg-gray-800 font-semibold border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <label htmlFor="category_id" className="block mb-2">
                  Category name :
                </label>
                <select
                  className="w-full h-12 px-3 dark:text-white dark:bg-gray-800 font-semibold border border-gray-300 rounded"
                  id="category-select"
                  value={categoryId}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Description and Image */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[300px]">
                <label htmlFor="description" className="block mb-2">
                  Description :
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setdescription(e.target.value)}
                  placeholder="Description"
                  className="w-full h-48 px-3 py-2 dark:bg-gray-800 font-semibold border border-gray-300 rounded resize-none"
                  required
                />
              </div>
              <div className="flex-1 min-w-[300px]">
                <label htmlFor="image" className="block mb-2">
                  Image :
                </label>
                <div
                  className="w-full h-48 border bg-white border-dashed dark:border-white border-gray-300 border-2 dark:bg-gray-800 rounded overflow-hidden cursor-pointer"
                  onClick={handleClick}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Selected Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src="/assets/images/UploadIcon.png"
                        alt="Upload Icon"
                        className="w-12 h-12"
                      />
                    </div>
                  )}
                  <input
                    ref={file}
                    className="hidden"
                    type="file"
                    name="image"
                    id="image"
                    onChange={(e) => handleFile(e)}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="bg-primary text-white py-3 px-16 font-semibold rounded hover:bg-opacity-90 transition-colors"
              >
                Edit Product
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default EditProductsPage;
