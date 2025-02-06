import { Copyright } from "lucide-react";
import { useEffect } from "react";
import LoadingSpinner from "../../../dashboard/components/LoadingSpinner";
import { getCategories } from "../../../store/slices/categorySlice";
import {
  RootState,
  useReduxDispatch,
  useReduxSelector,
} from "../../../store/store";
import DetailPart from "../DetailPart";
import ImagePart from "../ImagePart";
import HeroImage from "./../../../assets/hero.jpeg";

const Hero = () => {
  const { categories, loading, error } = useReduxSelector(
    (state: RootState) => state.category
  );
  const dispatch = useReduxDispatch();

  useEffect(() => {
    dispatch(getCategories({}));
  }, [dispatch]);

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>Failed to get categories</p>
      </div>
    );
  }

  return (
    <div className="aj-hero">
      <div className="flex flex-col lg:flex-row">
        {/* Left Column */}
        <div className="w-full lg:w-1/2 border border-[#121212] px-4 py-10 md:p-[80px]">
          <h2 className="text-[40px] md:text-[67px] leading-[48px] md:leading-[80.4px] font-semibold flex flex-col mb-4">
            Kyiv{" "}
            <span className="flex items-center">
              LuxeBouquets{" "}
              <sup>
                <Copyright />
              </sup>
            </span>
          </h2>
          <p className="font-normal text-sm md:text-lg leading-[19.6px] md:leading-[25.2px] text-[#121212E5]">
            Discover Uniquely Crafted Bouquets and Gifts for Any Occasion:
            Spread Joy with Our{" "}
            <span className="italic">Online Flower Delivery Service</span>
          </p>
          <div className="down-part flex pt-4 md:pt-6 mt-6 md:mt-[54px] items-end border-t border-t-[#121212]">
            <div className="img-container w-full h-[256px] pr-4 md:pr-6 mr-4 md:mr-6 border-r border-r-[#121212]">
              <img
                src={HeroImage}
                alt="girl"
                className="grayscale min-w-[155.5px] w-full h-full object-cover"
              />
            </div>
            <p className="text-sm leading-[16.8px]">
              Experience the joy of giving with our modern floral studio. Order
              online and send fresh flowers, plants and gifts today.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col">
          {loading ? (
            <LoadingSpinner />
          ) : (
            categories.map((el, index) => {
              return (
                <div
                  className={`flex flex-grow ${
                    index % 2 ? "flex-row-reverse" : ""
                  }`}
                  key={index}
                >
                  <div className="relative w-1/2  aspect-square border border-t-[#121212] p-4">
                    <DetailPart
                      id={el._id}
                      title={el.title}
                      dir={`${index % 2 ? "left" : "right"}`}
                    />
                  </div>
                  <div className="w-1/2  aspect-square border border-[#121212] border-b-0">
                    <ImagePart
                      image={`${import.meta.env.VITE_PUBLIC_API_BASE_URL}${el.image}`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
