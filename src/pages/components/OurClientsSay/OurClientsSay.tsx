import React, { useEffect } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { getReviews } from "../../../store/slices/reviewSlice";
import {
  RootState,
  useReduxDispatch,
  useReduxSelector,
} from "../../../store/store";
import SectionTitle from "../SectionTitle/SectionTitle";
import GoogleImage from "./../../../assets/google-logo.png";

const OurClientsSay: React.FC = () => {
  const { reviews, loading, error } = useReduxSelector(
    (state: RootState) => state.review
  );
  const dispatch = useReduxDispatch();

  useEffect(() => {
    dispatch(getReviews({}));
  }, [dispatch]);

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>Failed to get reviews</p>
      </div>
    );
  }

  return (
    <div className="aj-our-clients-say p-10 md:p-[80px]">
      <div className="testimonials-header flex flex-col gap-2 mb-6 justify-center items-center">
        <img src={GoogleImage} alt="Google logo" />
        <h4 className="uppercase">Reviews</h4>
      </div>
      <div className="text-center mb-4">
        <SectionTitle title="Our Clients say" />
      </div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>Loading reviews...</p>
        </div>
      ) : !reviews || reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>No reviews available at the moment.</p>
        </div>
      ) : (
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Navigation, Pagination, Autoplay]}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 1,
              spaceBetween: 40,
            },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div style={{ textAlign: "center" }}>
                <p className="flex flex-col">
                  <span className="text-[22px] md:text-[28px] italic font-[400] leading-[26.4px] md:leading-[33.6px]">
                    {review.text}
                  </span>
                  <span className="mt-4 font-[500] leading-[16px] md:leading-[19.2px]">
                    - {review.name}
                  </span>
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {/* <button className="leading-[19.2px] w-full md:w-[180px] h-[56px] border border-black mt-16 tracking-[0.03em] uppercase">Read reviews</button> */}
    </div>
  );
};

export default OurClientsSay;
