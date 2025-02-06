import { ArrowBigLeft } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { useReduxDispatch, useReduxSelector } from "../../../store/store";
import {
  addSubscribePlan,
  updateSubscribePlan,
} from "../../../store/slices/subscribePlansSlice";
import PopoverInfo from "../../components/PopoverInfo";
import { Switch } from "../../components/switch";

const AddEditSubscribePlan = () => {
  const file = useRef<HTMLInputElement | null>(null);
  const [previewImage, setpreviewImage] = useState<string>("");
  const [loading, setloading] = useState(false);
  const [title, settitle] = useState<string>("");
  const [isFreeDelivery, setIsFreeDelivery] = useState<string>("0");

  const [price, setprice] = useState<string>("");
  // const [deliveryFrequency, setDeliveryFrequency] = useState<string>('');
  // const [deliveryCount, setDeliveryCount] = useState<string>('');
  const [features, setFeatures] = useState("");

  const [image, setimage] = useState<string | File>("");
  const dispatch = useReduxDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { subscribePlansData } = useReduxSelector(
    (state) => state.subscribePlans
  );

  const oldDataUpdated = useMemo(() => {
    const oldDataSubscribe = subscribePlansData?.subscribePlans.find(
      (item) => item._id === id
    );
    console.log(oldDataSubscribe, "subscribePlansData");

    if (oldDataSubscribe) {
      setIsFreeDelivery(oldDataSubscribe.isFreeDelivery);
      settitle(oldDataSubscribe.title);
      setprice(oldDataSubscribe.price);
      // setDeliveryCount(oldDataSubscribe.deliveryCount)
      // setDeliveryFrequency(oldDataSubscribe.deliveryFrequency)
      setFeatures(oldDataSubscribe.features?.join(","));

      setpreviewImage(
        `${import.meta.env.VITE_PUBLIC_API_BASE_URL}${oldDataSubscribe.image}`
      );
    }

    return oldDataSubscribe;
  }, [id]);

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
    setloading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    // formData.append("deliveryCount", deliveryCount);
    // formData.append("deliveryFrequency", deliveryFrequency);
    formData.append("isFreeDelivery", isFreeDelivery);

    if (features) {
      const featureToArray = features?.split(",");

      featureToArray.forEach((value, index) =>
        formData.append(`features[${index}]`, value)
      );
    }

    formData.append("image", image);

    if (id) {
      dispatch(updateSubscribePlan({ data: formData, id })).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          setloading(false);
          navigate("/dashboard/subscribe-plans");
        } else {
          setloading(false);
        }
      });
    } else {
      dispatch(addSubscribePlan(formData)).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          setloading(false);
          navigate("/dashboard/subscribe-plans");
        } else {
          setloading(false);
        }
      });
    }
  };

  return (
    <>
      <div>
        <NavLink to={"/dashboard/subscribe-plans"}>
          <ArrowBigLeft size={40} />
        </NavLink>
        {loading ? (
          <div className="w-full flex justify-center items-center h-full">
            <Loader />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6  ">
            <section className="grid sm:grid-cols-3 grid-cols-1 gap-4 ">
              <div>
                <label htmlFor="title" className="block mb-2 ">
                  Title :
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  onChange={(e) => settitle(e.target.value)}
                  defaultValue={oldDataUpdated?.title}
                  placeholder="Title"
                  className="w-full p-2  dark:bg-gray-800 font-semibold border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block mb-2">
                  Price :
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  onChange={(e) => setprice(e.target.value)}
                  defaultValue={oldDataUpdated?.price}
                  placeholder="Price"
                  className="w-full p-2 dark:bg-gray-800 font-semibold border border-gray-300 rounded"
                  required
                />
              </div>
              {/* <div>
              <label htmlFor="deliveryFrequency" className="block mb-2">
              Delivery Frequency :
              </label>
              <input
                type="number"
                id="deliveryFrequency"
                name="deliveryFrequency"
                onChange={(e) => setDeliveryFrequency(e.target.value)}
                defaultValue={oldDataUpdated?.deliveryFrequency}
                placeholder="Delivery Frequency"
                className="w-full p-2 dark:bg-gray-800 font-semibold border border-gray-300 rounded"
                required
              />
            </div> */}
              {/* <div>
              <label htmlFor="deliveryCount" className="block mb-2">
              Delivery Count :
              </label>
              <input
                type="number"
                id="deliveryCount"
                name="deliveryCount"
                onChange={(e) => setDeliveryCount(e.target.value)}
                defaultValue={oldDataUpdated?.deliveryCount}

                placeholder="Delivery Count"
                className="w-full p-2 dark:bg-gray-800 font-semibold border border-gray-300 rounded"
                required
              />
            </div> */}

              <div>
                <div className="flex gap-3">
                  <label htmlFor="features" className="block mb-2">
                    Features :
                  </label>
                  <PopoverInfo
                    title="Note"
                    text="You have to add comma ( , ) in the text if have multiple features . For example : fetaure1 , feature 2"
                  />
                </div>

                <textarea
                  id="features"
                  name="features"
                  placeholder="Features"
                  defaultValue={oldDataUpdated?.features?.join(",")}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="w-full p-2 dark:bg-gray-800 font-semibold border border-gray-300 rounded"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label htmlFor="isFreeDelivery" className="block mb-2">
                  Is Free Delivery :
                </label>

                <Switch
                  id="isFreeDelivery"
                  name="isFreeDelivery"
                  checked={Boolean(isFreeDelivery === "0" ? "" : "1")}
                  onClick={(e) => {
                    const target = e.target as HTMLElement; // Ensure it's cast as an HTMLElement
                    const ariaChecked = target.getAttribute("aria-checked"); // Use getAttribute
                    setIsFreeDelivery(ariaChecked === "true" ? "0" : "1");
                  }}
                />
              </div>
              <div>
                <label htmlFor="image" className="block mb-2">
                  Image :
                </label>
                <button
                  type="button"
                  className="flex p-5 border bg-white border-dashed dark:border-white border-gray-300 border-2 w-full dark:bg-gray-800 items-center justify-center rounded"
                  onClick={handleClick}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Selected Preview"
                      className="w-[400px] h-[200px]  rounded-md"
                    />
                  ) : (
                    <img
                      src="/assets/images/UploadIcon.png"
                      alt="Upload Icon"
                    />
                  )}
                  <input
                    ref={file}
                    className="sr-only"
                    type="file"
                    name="image"
                    id="image"
                    onChange={(e) => handleFile(e)}
                  />
                </button>
              </div>
            </section>

            <div className="mt-4 text-center">
              <button
                type="submit"
                className="bg-primary text-white py-3 px-16 font-semibold rounded"
              >
                {id ? "Edit Subscribe Plan" : "Add Subscribe Plan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default AddEditSubscribePlan;
