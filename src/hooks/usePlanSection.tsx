/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import { RootState, useReduxDispatch, useReduxSelector } from '../store/store';
import { addUserSubscribePlan, deleteUserSubsciblePlan, getSubscribePlans } from '../store/slices/subscribePlansSlice';
import { toast } from 'react-toastify';

export const usePlanSection = () => {
  const [count, setCount] = useState<number>(0);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [selectedDelieveryFrequency, setSelectedDelieveryFrequency] = useState<string>("");
  const [shouldDisableCreate, setShouldDiableCreate] = useState<boolean>(false);

  const dispatch = useReduxDispatch();
  const { subscribePlansData, loading, loading_delete } = useReduxSelector(
    (state: RootState) => state.subscribePlans
  );

  useEffect(() => {
    dispatch(getSubscribePlans({ page: -1 })).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        const userId_Plan = JSON.parse(localStorage.getItem("user") ?? "{}")?.subscribe_id;

        const ObjectValuesUser = result.payload.subscribePlans.find((item: any) =>
          item._id === userId_Plan
        );

        if (ObjectValuesUser) {
          const currentUser = ObjectValuesUser.users_id.find((item: any) =>
            item.user === JSON.parse(localStorage.getItem("user") ?? "{}")?._id
          );

          if (currentUser) {
            setShouldDiableCreate(true);

            if (currentUser.deliveryCount) {
              setCount(+currentUser.deliveryCount);
            }

            if (currentUser.deliveryFrequency) {
              setSelectedDelieveryFrequency(currentUser.deliveryFrequency);
            }
          }
        }
      }
    });
  }, [dispatch]);

  const handleCountChange = (delta: number) => {
    setCount((prev) => prev + delta);
  };

  const handleSelectedIdPlan = (id: string) => {
    setSelectedPlanId(id);
  };

  const handleSelectedFrequency = (value: string) => {
    setSelectedDelieveryFrequency(value);
  };

  const handleCreateUserPlan = () => {
    if (count <= 0) {
      toast.error("Delivery Count must be bigger than 0");
      return;
    }
    if (!selectedDelieveryFrequency) {
        toast.error("Delivery Frequency must be selected");
      return;
    }

    dispatch(addUserSubscribePlan({
      data: {
        deliveryCount: count.toString(),
        deliveryFrequency: selectedDelieveryFrequency,
      },
      id_subscibe: selectedPlanId
    })).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        const user = JSON.parse(localStorage.getItem("user") ?? "{}");
        user.subscribe_id = selectedPlanId;
        localStorage.setItem("user", JSON.stringify(user));
        setShouldDiableCreate(true);
        setSelectedPlanId("")

        dispatch(getSubscribePlans({ page: -1 }));
      }
    });
  };

  const handleDeleteUserPlan = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    event.stopPropagation();
    dispatch(deleteUserSubsciblePlan(id)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        const user = JSON.parse(localStorage.getItem("user") ?? "{}");
        user.subscribe_id = "";
        localStorage.setItem("user", JSON.stringify(user));
        setShouldDiableCreate(false);
        setSelectedDelieveryFrequency("");
        setCount(0);

        dispatch(getSubscribePlans({ page: -1 }));
      }
    });
  };

  const whichSelectedCard = useMemo(() => {
    return subscribePlansData?.subscribePlans?.some((item: any) => item._id === selectedPlanId);
  }, [selectedPlanId]);

  const whichUserHasPlan = useMemo(() => {
    if (!subscribePlansData?.subscribePlans) return false;
    const userId_Plan = JSON.parse(localStorage.getItem("user") ?? "{}")?.subscribe_id;
    return subscribePlansData.subscribePlans.some(item =>
      item._id === userId_Plan
    );
  }, [subscribePlansData]);

  return {
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
  };
};
