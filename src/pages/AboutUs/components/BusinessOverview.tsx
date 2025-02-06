
type BusinessOverviewProps = {
    title: string,
    pargraph: string,
    imgPath: string,
    //if "reverse" prop is 0 then image will be in left and content in right
    //if "reverse" prop is 1 then image will be in right and content in left
    reverse?: boolean 
}

const BusinessOverview = ({title, pargraph, imgPath, reverse = false} : BusinessOverviewProps) => {
  return (
    <section className={`md:flex ${reverse ? "flex-row-reverse" : ""}`}>
         <div className="md:w-1/2 bg-[#12121240]">
          <img
            src={imgPath}
            className="h-[500px] md:h-[720px] w-full object-cover"
          />
        </div>
        <div className="md:w-1/2 md:h-[720px] px-20 py-20 text-left text-[#121212]">
          <h3 className="font-medium text-[38px] leading-[45.6px] pb-4">{title}</h3>
          <p className="leading-[22.4px] text-[#121212E5]">{pargraph}</p>
        </div>

      </section>
  )
}


export default BusinessOverview
