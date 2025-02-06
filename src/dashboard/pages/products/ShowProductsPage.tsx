import { NavLink } from "react-router-dom";
import ProductsTable from "../../components/ProductsTable";

const ShowProductsPage = () => {
  return (
    <>
      <>
        <div className="flex justify-end">
          <NavLink
            to={"/dashboard/products/add"}
            className="bg-primary rounded p-4 font-bold mb-6"
          >
            Add Products
          </NavLink>
        </div>
        <div>
          <ProductsTable />
        </div>
      </>
    </>
  );
};

export default ShowProductsPage;
