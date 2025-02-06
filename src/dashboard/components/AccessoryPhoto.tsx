import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

const flowerAccessories = [
  "https://www.globalkitchenjapan.com/cdn/shop/articles/Harekutani_single-flower_vase_that_colors_daily_life_with_pop_1_1600x.jpg?v=1654849147",
  "https://s.alicdn.com/@sc04/kf/Hdd153afdd76346a3a5459b5c9fc9a71f0.jpg_720x720q50.jpg",
  "https://m.media-amazon.com/images/I/71nnlBlG4dL.jpg",
  "https://www.klong.com/pub_images/original/zz5_0375-square.jpg",
  "https://www.thecraftydecorator.com/wp-content/uploads/2023/04/DIY-Dollar-Tree-Textured-Vas-Transformed-Three-Ways-12.jpg",
  "https://ae-pic-a1.aliexpress-media.com/kf/S007a13dbf898489888fa7c827a6025bdF/60cm-tall-10pcs-Clear-Crystal-Embellishment-Trumpet-Table-Centerpiece-Reversible-Plastic-Flower-Vase.jpg_640x640Q90.jpg_.webp",
  "https://cdn11.bigcommerce.com/s-d41d6stp/images/stencil/1280w/products/1866/8069/RED_VALUE__02783.1708453777.jpg",
];

const AccessoryPhoto = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-6 relative">
      <Swiper
        loop={true}
        speed={600}
        autoplay={{ delay: 3000 }}
        slidesPerView="auto"
        centeredSlides={true}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 5,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          1200: {
            slidesPerView: 5,
            spaceBetween: 10,
          },
        }}
        modules={[Autoplay]}
        className="gallery-swiper"
      >
        {flowerAccessories.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              className="rounded-lg h-[100px] shadow-lg"
              alt={`Gallery ${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AccessoryPhoto;
