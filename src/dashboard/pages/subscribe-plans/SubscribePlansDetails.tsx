import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useReduxDispatch, useReduxSelector } from "../../../store/store";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Card, CardContent } from "../../components/card";
import { getSubscribePlan } from "../../../store/slices/subscribePlansSlice";

export const SubscribePlansDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { subscribePlanData, loading } = useReduxSelector(
    (state) => state.subscribePlans
  );
  const dispatch = useReduxDispatch();

  useEffect(() => {
    if (!params.id) {
      navigate("/not-found");
      return;
    }
    dispatch(getSubscribePlan({ id: params.id }));
  }, [dispatch, navigate, params.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!subscribePlanData) {
    navigate("/not-found");
    return null;
  }

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen  p-6"
    >
      <Card className="max-w-4xl mx-auto overflow-hidden">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-6 ">SubScribe Plan Details</h1>

          <Section title="Recipient Information">
            <InfoItem
              label="Name"
              value={
                subscribePlanData?.title ? subscribePlanData?.title : "No Title"
              }
            />
            <InfoItem
              label="Price"
              value={
                subscribePlanData?.price
                  ? `${subscribePlanData?.price}$`
                  : "No Price"
              }
            />
            <InfoItem
              label="Is Free Delivery"
              value={subscribePlanData?.isFreeDelivery === "1" ? "Yes" : "No"}
            />
          </Section>

          <Section title="Features">
            <InfoItem
              label="Features"
              value={
                Array.isArray(subscribePlanData?.features)
                  ? subscribePlanData?.features.join(", ").length > 50
                    ? `${subscribePlanData?.features.slice(0, 47).join(",")}...`
                    : subscribePlanData?.features.join(", ")
                  : "_"
              }
            />
          </Section>

          <Section title="Users">
            <InfoItem
              label="Users"
              value={
                Array.isArray(subscribePlanData?.users_id)
                  ? `${subscribePlanData?.users_id.map(
                      (item) =>
                        `Email: ${item?.user?.email}  - 
                  Delivery Count: ${item?.deliveryCount} - 
                  Delivery Frequency: ${item?.deliveryFrequency} ${subscribePlanData?.users_id?.length > 1 ? " , " : ""}\n`
                    )}`
                  : "No Users"
              }
            />
          </Section>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <motion.section
    className="mb-8 bg-muted rounded-md p-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl font-semibold mb-4 ">{title}</h2>
    <div className="p-4 rounded-md">{children}</div>
  </motion.section>
);

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <p className="mb-2">
    <span className="font-medium ">{label}:</span>{" "}
    <span className="">{value}</span>
  </p>
);

export default SubscribePlansDetails;
