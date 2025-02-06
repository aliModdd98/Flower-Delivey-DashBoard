import { useNavigate, useParams } from "react-router-dom";
import { ProductDetails } from "./components/product-details";
import { RelatedProducts } from "../../Components/RelatedProducts/RelatedProducts";

export default function ProductPage() {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  if (!id) {
    navigate("not-found");
    return;
  }

  return (
    <>
      <ProductDetails productId={id} />
      <RelatedProducts productId={id} />
    </>
  );
}
