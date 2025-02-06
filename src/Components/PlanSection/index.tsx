import image from "../../assets/flower-subscription.jpg";
import { usePlanSection } from "../../hooks/usePlanSection";
import Card from "./Card";
import { Minus, Plus } from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";

const SelectionPlan = () => {

  const {
    count,
    selectedPlanId,
    selectedDelieveryFrequency,
    shouldDisableCreate,
    handleCountChange,
    handleSelectedIdPlan,
    handleSelectedFrequency,
    handleCreateUserPlan,
    handleDeleteUserPlan,
    whichSelectedCard,
    whichUserHasPlan,
    loading,
    loading_delete,
    subscribePlansData
  } = usePlanSection();


  return (
<section className="flex  flex-col-reverse lg:flex-row  lg:flex ">

    <div className="border border-[#121212] lg:w-1/2  px-4 sm:px-10 py-10 sm:py-20 ">
    
    {
  //     loading && loading_delete===false? 
  //     <div className="min-h-60  h-[900px] flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
  // <div className="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
  //   <div className="flex justify-center">
  //     <div className="animate-spin inline-block size-9 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
  //       <span className="sr-only">Loading...</span>
  //     </div>
  //   </div>
  // </div>
  //     </div>
  //     :
      <>
      <p className="uppercase text-xs sm:text-sm font-medium">
          build your subscription
      </p>

      <h2 className="font-medium text-[26px] leading-[31px] sm:text-[38px] sm:leading-[45px] text-[#121212] mt-6">
          Selecting a Plan
      </h2>

      <div className="mt-[16px] text-[#121212E5]">
          <p className="text-base	font-normal">
          Enjoy free shipping on every order and save up to 30%. 
          </p>
          <p className="text-base	font-normal">
          Every bouquet we deliver is carefully curated to ensure it arrives fresh and stunning. 
          To modify, pause, or cancel your subscription, 
          simply log in to your account dashboard. You're in complete control of your flower delivery experience.
          </p>
      </div>

      {/* dynamic cards */}
      <div className=" pt-6 pb-[26px] border-b border-[#D2D2D7]">
        {
          subscribePlansData?.subscribePlans &&
          subscribePlansData.subscribePlans?.map((item)=>(
            <Card 
            whichUserhasPlan={whichUserHasPlan}
            whichSelectedCard={whichSelectedCard}
            subscribePlansData={item} 
            selectedPlanId={selectedPlanId} 
            handleSelectedIdPlan={handleSelectedIdPlan}
            handleDeleteUserPlan={handleDeleteUserPlan}/>

          ))
        }
      </div>

      {/* How often */}
      <div className="mt-10 w-full">
      <p className="mb-4 font-normal  text-[22px] leading-[22px] sm:text-[28px] sm:leading-[33px]">
      How often do you want flowers delivered ?
      </p>
      

      <p className="font-normal text-base text-[#121212E5]">
      Select the delivery frequency
      </p>

      <div className="pt-4 pb-10   border-b border-[#D2D2D7]  gap-4 flex flex-col sm:flex-row ">
      <button disabled={shouldDisableCreate}  className="relative outline-none border border-[#121212] uppercase w-full sm:w-[200px]  h-[48px] sm:h-[56px] text-sm sm:text-base  text-[#121212] font-normal sm:font-medium "
      onClick={()=>handleSelectedFrequency("monthly")}>
        Monthly
        {
          selectedDelieveryFrequency ==="monthly" && 
          <FaCheckCircle className="absolute  right-[1.1rem] top-[1.1rem] text-green-500 text-[24px]"/>
          
        }
      </button>
      <button  
      disabled={shouldDisableCreate}
      onClick={()=>handleSelectedFrequency("bi-weekly")}
      className="relative outline-none border border-[#121212] uppercase w-full sm:w-[200px]  h-[48px] sm:h-[56px] text-sm sm:text-base  text-[#121212] font-normal sm:font-medium ">
        Bi-weekly
        {
          selectedDelieveryFrequency ==="bi-weekly" && 
          <FaCheckCircle className="absolute  right-[1.1rem] top-[1.1rem] text-green-500 text-[24px]"/>
          
        }
      </button>
      <button
      disabled={shouldDisableCreate}
      onClick={()=>handleSelectedFrequency("weekly")}
      className="relative outline-none border border-[#121212] uppercase w-full sm:w-[200px]  h-[48px] sm:h-[56px] text-sm sm:text-base  text-[#121212] font-normal sm:font-medium ">
        Weekly
        {
          selectedDelieveryFrequency ==="weekly" && 
          <FaCheckCircle className="absolute  right-[1.1rem] top-[1.1rem] text-green-500 text-[24px]"/>
          
        }
      </button>
      </div>

      </div>
      
      {/* How many delievery */}
      <div className="mt-10 w-full">
      <p className="mb-4 font-normal  text-[22px] leading-[22px] sm:text-[28px] sm:leading-[33px]">
      How many deliveries would you like ?
      </p>

      <p className="font-normal text-base text-[#121212E5]">
      Pay once and do not worry about flowers, our bouquets will be beautiful and on time,
      as many times as you need 
      </p>

      <div className="pt-4 pb-10   border-b border-[#D2D2D7]  gap-4 flex flex-col sm:flex-row ">

      <div className="flex items-center justify-center outline-none border border-[#121212] uppercase w-full sm:w-[146px]  h-[44px]  text-sm sm:text-base  text-[#121212] font-normal  ">
          <button className="w-[48px] h-full flex justify-center items-center" disabled={shouldDisableCreate} onClick={() => handleCountChange(-1)} >
          <Minus className="w-[24px] h-[24px] stroke-[1.2px]"/>
          </button>
      <span className="w-[49px] h-full leading-[40px] text-center border-x border-[#121212]">{count}</span>
          <button className="w-[48px] h-full flex justify-center items-center" disabled={shouldDisableCreate} onClick={() => handleCountChange(1)} >
          <Plus className="w-[24px] h-[24px]  stroke-[1.2px]"/>
          </button>
  </div>
      </div>


      </div>
      </>
    }


        <div className="my-10 w-full">
        <button  
        onClick={handleCreateUserPlan}
        disabled={(loading ||shouldDisableCreate)?true:false}
        className=" flex items-center justify-center  outline-none border-none uppercase w-full h-[48px] sm:h-[56px] text-sm sm:text-base bg-[#121212] text-white font-normal sm:font-medium "
        >
            {!loading && !loading_delete ?
            "create"
            :
            <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
            }
        
      

        </button>
        </div>
        
    </div>
        <div className="lg:w-1/2">
          <img
            src={image}
            className="h-[420px] md:h-[500px] lg:h-[720px] w-full object-cover"
          />
        </div>
      </section>
  )
}

export default SelectionPlan
