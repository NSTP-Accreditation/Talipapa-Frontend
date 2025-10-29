import { AvailableProductCardProps } from '../SwapItem.types';

const AvailableProductCard = ({
  product,
  quantity,
  onQuantityInput,
  onRedeem,
  redeemInProgress,
}: AvailableProductCardProps) => {

  return (
    <div
      className="px-4 sm:px-6 py-4 sm:py-6 rounded-lg text-white shadow-md"
      style={{ backgroundColor: '#1a4d2e' }}
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mb-3 sm:mb-5">
        <div
          className="shrink-0 p-2 sm:p-3 rounded-lg grid place-items-center max-h-24 sm:max-h-32 mx-auto sm:mx-0"
          style={{ backgroundColor: '#F6F6F6' }}
        >
          <img
            src={product.image?.url || '/placeholder.png'}
            alt={product.name}
            className="h-16 w-20 sm:h-20 sm:w-24 object-contain rounded"
          />
        </div>

        <div className="flex flex-col justify-start gap-1 sm:gap-2 grow text-center sm:text-left">
          <h1 className="font-bold text-lg sm:text-xl">{product.name}</h1>
          <p className="text-sm sm:text-base opacity-90">
            {product.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4 text-sm sm:text-base">
        <label
          htmlFor={`quantity-${product._id}`}
          className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 font-semibold"
        >
          <span>Quantity:</span>
          <input
            id={`quantity-${product._id}`}
            type="number"
            placeholder="0"
            min="0"
            className="w-full sm:w-20 px-2 py-1 placeholder:text-center bg-white/10 border-2 border-white rounded text-center outline-none"
            value={quantity || ''}
            onChange={(e) => onQuantityInput(product._id, e.target.value)}
          />
        </label>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-base sm:text-lg">
          <p className="font-bold text-center sm:text-left">
            {product.requiredPoints} points
          </p>
          <button
            className="font-semibold py-2 px-4 sm:px-6 rounded-lg bg-white shadow-md hover:opacity-80 transition-opacity duration-300 text-sm sm:text-base"
            style={{ color: '#1a4d2e' }}
            onClick={() => onRedeem(product)}
            disabled={redeemInProgress}
          >
            Redeem
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailableProductCard;
