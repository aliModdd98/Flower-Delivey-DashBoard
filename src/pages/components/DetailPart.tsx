import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const DetailPart = ({
  title,
  dir,
  id
}: {
  title: string;
  dir: "left" | "right";
  id: string
}) => {
  return (
    <div className="aj-detail flex flex-col h-full items-center justify-center">
      <h2 className="font-medium text-[26px] md:text-[38px] leading-[31.2px] md:leading-[45.6px]">{title}</h2>
      <Link to={`/category/${id}`} className="absolute bottom-6 text-sm md:text-base flex items-center gap-[7px] font-semibold leading-[19.2px] tracking-[0.025em] text-[#121212]">
        {dir == "right" ? (
          <>
            Shop now <ArrowRight />
          </>
        ) : (
          <><ArrowLeft /> Shop now</>
        )}
      </Link>
    </div>
  );
};

export default DetailPart;