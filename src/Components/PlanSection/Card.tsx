
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { SubscribePlan } from "../../types/subscribePlansType";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Card = ({whichUserhasPlan,whichSelectedCard,handleDeleteUserPlan,subscribePlansData,selectedPlanId,handleSelectedIdPlan}:{whichUserhasPlan:boolean,whichSelectedCard:boolean,handleDeleteUserPlan:(event:any,id:string)=>void,subscribePlansData:SubscribePlan,selectedPlanId:string,handleSelectedIdPlan:(id:string)=>void}) => {
  return (
    <div className="mb-4">
    <div className="w-full max-w-[344px] sm:max-w-full flex flex-col sm:flex-row gap-4 border border-[#D2D2D7] border-b-0">
            <img
            src={`${import.meta.env.VITE_PUBLIC_API_BASE_URL}${subscribePlansData?.image}`}
            className="h-[200px] sm:h-[225px] w-full  object-cover"
        />
        <div className="w-full p-4 sm:h-[225px] ">
            <p className="font-medium text-lg mb-4">
                {subscribePlansData?.title}
            </p>

            <ul className="list-disc px-5 pb-2 marker:text-[11px] sm:h-[150px] sm:overflow-y-auto scrollbar-w-6">
                {
                  subscribePlansData?.features?.map((item)=>(

                    <li className="text-base font-normal pb-1">
                    {item}
                    </li>
                  ))
                }
                
                {subscribePlansData?.price &&
                <li className="text-base font-normal">
                {subscribePlansData?.price+"$"}
                </li>
                }
            </ul>

          </div>

            </div>
            <button 
            disabled={whichUserhasPlan && JSON.parse(localStorage.getItem("user") ?? "{}")?.subscribe_id !== subscribePlansData?._id}
            onClick={()=>{handleSelectedIdPlan(subscribePlansData?._id)}}
            className="relative outline-none border-none uppercase w-full h-[48px] sm:h-[56px] text-sm sm:text-base bg-[#121212] text-white font-normal sm:font-medium ">
              Select

              {
                selectedPlanId===subscribePlansData?._id ?
                <FaCheckCircle className="absolute  right-[1.1rem] top-[1.1rem] text-green-500 text-[24px]"/>
                :
                whichSelectedCard?
                ""
                :
                whichUserhasPlan && JSON.parse(localStorage.getItem("user") ?? "{}")?.subscribe_id===subscribePlansData?._id?
                <IoMdCloseCircle onClick={(e)=>handleDeleteUserPlan(e,subscribePlansData?._id)} className="absolute right-4 top-4 text-red-500 text-[28px]"/>
                :
                ""
              }
              
            </button>

    </div>
  )
}

export default Card
