import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../../../lib/ajax/api";
import { handleApiError } from "../../../../lib/utils";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";

interface Product {
  _id: string;
  title: string;
}

interface EditPopupProps {
  accessory: {
    _id: number;
    title: string;
    imageFiles: File[];
    stock: number;
    description: string;
    price: number;
    productIds: string[];
  };
  setPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
  updateAccessory: (updatedAccessory: unknown) => void;
}

const EditPopup: React.FC<EditPopupProps> = ({
  accessory,
  setPopupVisible,
  updateAccessory,
}) => {
  const [updatedAccessory, setUpdatedAccessory] = useState({
    ...accessory,
    imageFiles: [] as File[],
  });
  const [, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setUpdatedAccessory({
      ...accessory,
      imageFiles: [] as File[],
    });
    const fetchProducts = async () => {
      try {
        const response = await api.get("http://localhost:3000/api/v1/product");
        setProducts(response.data.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [accessory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedAccessory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUpdatedAccessory((prev) => ({
        ...prev,
        //@ts-expect-error file type conflict
        imageFiles: Array.from(e.target.files),
      }));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("title", updatedAccessory.title);
      formData.append("stock", updatedAccessory.stock.toString());
      formData.append("description", updatedAccessory.description);
      formData.append("price", updatedAccessory.price.toString());

      updatedAccessory.imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await api.put(
        `/accessory/${updatedAccessory._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status !== 200) {
        throw new Error("Error updating accessory");
      }

      toast.success("Accessory updated successfully!");
      updateAccessory(response.data);
      setPopupVisible(false);
    } catch (error) {
      handleApiError(error);
      console.error("Error saving accessory:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4">Edit Accessory</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Title :</label>
            <Input
              name="title"
              value={updatedAccessory.title}
              onChange={handleInputChange}
              placeholder="Title"
            />
          </div>

          <div>
            <label className="block mb-2">Stock :</label>
            <Input
              name="stock"
              type="number"
              value={updatedAccessory.stock}
              onChange={handleInputChange}
              placeholder="Stock"
            />
          </div>

          <div>
            <label className="block mb-2">Description :</label>
            <Input
              name="description"
              value={updatedAccessory.description}
              onChange={handleInputChange}
              placeholder="Description"
            />
          </div>

          <div>
            <label className="block mb-2">Price :</label>
            <Input
              name="price"
              type="number"
              value={updatedAccessory.price}
              onChange={handleInputChange}
              placeholder="Price"
            />
          </div>

          <div>
            <label className="block mb-2">Upload Images :</label>
            <input
              required
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setPopupVisible(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPopup;
