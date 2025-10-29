import { AvailableProductsProps } from "../SwapItem.types";
import AvailableProductCard from "./AvailableProductCard";

const Availableproducts = ({
  availableProducts,
  quantityInputs,
  onQuantityInput,
  onRedeem,
  redeemInProgress,
}: AvailableProductsProps) => {
  if (availableProducts.length === 0) {
    return null;
  }
  console.log('s');
  
  return (
    <div
      className="grow bg-white shadow-md p-4 sm:p-10 rounded-lg"
      style={{ color: '#1a4d2e' }}
    >
      <h1 className="font-bold text-xl sm:text-3xl mb-4 sm:mb-8">
        Available Products based on points from record:
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {availableProducts.map((product) => (
          <AvailableProductCard
            key={product._id}
            product={product}
            quantity={quantityInputs[product._id] || 0}
            onQuantityInput={onQuantityInput}
            onRedeem={onRedeem}
            redeemInProgress={redeemInProgress}
          />
        ))}
      </div>
    </div>
  );
};

export default Availableproducts;