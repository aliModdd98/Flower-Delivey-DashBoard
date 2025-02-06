import { Link } from "react-router-dom"

const BouquetsPromoSection = () => {
  return (
    <section className="py-20 text-center">
        <h2 className="font-semibold text-[50px] pb-4 text-[#121212]">Discover Our Beautiful Bouquets</h2>
        <p className="font-medium text-[18px] leading-[25.2px] text-[#121212E5] max-w-[608px] md:max-w-[638px] mx-auto pb-[56px]">Explore our collection of exquisite bouquets and surprise your loved ones with the perfect gift. Click the button below to start shopping</p>
        <Link to={"/"} className="py-[18px] px-[90.5px] bg-[#121212] text-white font-medium leading-[19.2px]">SHOP NOW</Link>
    </section>
  )
}

export default BouquetsPromoSection
