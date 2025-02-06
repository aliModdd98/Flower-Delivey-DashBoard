import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { api } from "../../../../lib/ajax/api";
import { handleApiError } from "../../../../lib/utils";
import { getProducts } from "../../../../store/slices/productSlice";
import { useReduxDispatch, useReduxSelector } from "../../../../store/store";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import LoadingSpinner from "../../../components/LoadingSpinner";

export interface Accessory {
  _id: number;
  title: string;
  image: File | string;
  stock: number;
  description: string;
  price: number;
}

interface AddPopupProps {
  setAccessories: React.Dispatch<React.SetStateAction<Accessory[]>>;
  setPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
  newAccessory: Accessory;
  setNewAccessory: React.Dispatch<React.SetStateAction<Accessory>>;
}

const AddPopup: React.FC<AddPopupProps> = ({
  setAccessories,
  setPopupVisible,
  newAccessory,
  setNewAccessory,
}) => {
  const { products, loading } = useReduxSelector((state) => state.product);
  const [selectedProducts, setSelectedProducts] = useState<
    { label: string; value: Product }[]
  >([]);

  const dispatch = useReduxDispatch();

  useEffect(() => {
    dispatch(getProducts({}));
  }, [dispatch]);

  const handleAddAccessory = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      const selectedProductIds = selectedProducts.map((el) => el.value._id);

      const formData = new FormData();
      formData.append("title", newAccessory.title);
      formData.append(
        "image",
        newAccessory.image instanceof File ? newAccessory.image : ""
      );
      formData.append("stock", newAccessory.stock.toString());
      formData.append("description", newAccessory.description);
      formData.append("price", newAccessory.price.toString());
      formData.append("products_array", JSON.stringify(selectedProductIds));

      const response = await api.post("/accessory", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const addedAccessory = response.data.data;
      addedAccessory.products_array = selectedProducts.map((el) => el.value);

      setAccessories((prev) => [...prev, addedAccessory]);
      setPopupVisible(false);
      setNewAccessory({
        _id: 0,
        title: "",
        image: "",
        stock: 0,
        description: "",
        price: 0,
      });

      toast.success("accessory added successfully");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAccessory({ ...newAccessory, image: file });
    }
  };

  const productOptions = products.map((product) => ({
    value: product,
    label: product.title,
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4">Add New Accessory</h2>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleAddAccessory}>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-2">Title :</label>
                <Input
                  required
                  placeholder="Title"
                  value={newAccessory.title}
                  onChange={(e) =>
                    setNewAccessory({ ...newAccessory, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-2">Select Products:</label>
                <Select
                  isMulti
                  //@ts-expect-error types conflict
                  options={productOptions}
                  value={selectedProducts}
                  onChange={(newValue) => setSelectedProducts([...newValue])}
                  placeholder="Search and select products..."
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                      maxHeight: "300px", // Set max height for the dropdown
                      overflowY: "auto", // Enable scrolling
                    }),
                    control: (provided) => ({
                      ...provided,
                      cursor: "text", // Set cursor to text
                    }),
                  }}
                />
              </div>

              <div>
                <label className="block mb-2">Image :</label>
                <input
                  required
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                />
              </div>

              <div>
                <label className="block mb-2">Stock :</label>
                <Input
                  required
                  placeholder="Stock"
                  type="number"
                  onChange={(e) =>
                    setNewAccessory({
                      ...newAccessory,
                      stock: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="block mb-2">
                <label className="block mb-2">Description :</label>
                <Input
                  required
                  placeholder="Description"
                  onChange={(e) =>
                    setNewAccessory({
                      ...newAccessory,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block mb-2">Price :</label>
                <Input
                  required
                  placeholder="Price"
                  type="number"
                  onChange={(e) =>
                    setNewAccessory({
                      ...newAccessory,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setPopupVisible(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add</Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddPopup;
