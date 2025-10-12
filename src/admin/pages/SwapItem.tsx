import { useCallback, useMemo, useState } from 'react';
import { formatName, formatPoints } from '@/utils/formatter';
import { useAuthFetch } from '../hooks/useAuthFetch';
import FloatingLabelInput from '../components/FloatingLabelInput';

interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  requiredPoints: number;
}

interface RecordData {
  _id: string;
  lastName: string;
  address: string;
  contact_number: string;
  points: number;
}

const SwapItem = () => {
  const [redeemInProgress, setRedeemInProgress] = useState(false);
  const [recordId, setRecordId] = useState('');
  const [lastName, setLastName] = useState('');
  const [recordData, setRecordData] = useState<RecordData | null>(null);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [quantityInputs, setQuantityInputs] = useState<Record<string, number>>(
    {}
  );
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const authFetch = useAuthFetch();

  const handleFindRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    await findRecord();
  };

  const findRecord = async () => {
    try {
      const updatedRecord = await authFetch(
        `/records/${recordId}?lastName=${lastName}`
      );
      setRecordData(updatedRecord);
      await findProducts(updatedRecord);
    } catch (error) {
      console.error('Error finding record:', error);
      setRecordData(null);
    }
  };

  const filterAvailableProducts = useCallback(
    (products: Product[], record: RecordData | null) => {
      if (!record) return [];
      const filtered = products.filter(
        (product) => product.requiredPoints <= record.points
      );
      setAvailableProducts(filtered);
      return filtered;
    },
    []
  );

  const findProducts = async (recordOverride?: RecordData) => {
    try {
      const products = await authFetch('/products');
      const recordToUse = recordOverride || recordData;
      filterAvailableProducts(products, recordToUse);
    } catch (error) {
      console.error('Error fetching products:', error);
      setRecordData(null);
    }
  };

  const confirmRecord = async () => {
    await findProducts();
  };

  const handleQuantityInput = (productId: string, value: string) => {
    const parsedValue = parseInt(value, 10) || 0;

    setQuantityInputs((prev) => ({
      ...prev,
      [productId]: parsedValue,
    }));
  };

  const handleRedeem = async (product: Product) => {
    if (redeemInProgress || !recordData) return;

    setRedeemInProgress(true);

    const quantity = quantityInputs[product._id] || 0;

    if (quantity <= 0) {
      alert('Invalid Quantity');
      setRedeemInProgress(false);
      return;
    }

    const totalRequiredPoints = quantity * product.requiredPoints;

    if (totalRequiredPoints > recordData.points) {
      alert('Not Enough Points to Redeem Product');
      setRedeemInProgress(false);
      return;
    }

    const requestBody = {
      record_id: recordData._id,
      lastName: recordData.lastName,
      product_id: product._id,
      points: -totalRequiredPoints,
    };

    try {
      const data = await authFetch(`/records/${recordId}`, {
        method: 'PATCH',
        body: JSON.stringify(requestBody),
      });

      alert(
        `${data.message}: Current Points: ${
          recordData.points - totalRequiredPoints
        }`
      );

      // Refresh data after successful redemption
      const updatedRecord = await authFetch(
        `/records/${recordId}?lastName=${lastName}`
      );
      setRecordData(updatedRecord);
      await findProducts(updatedRecord);

      // Reset quantity input for this product
      setQuantityInputs((prev) => ({
        ...prev,
        [product._id]: 0,
      }));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setRedeemInProgress(false);
    }
  };

  return (
    <main className="flex flex-col gap-5">
      <div className="flex flex-col items-start text-green-600">
        <h1 className="font-bold text-2xl tracking-wide">Trade Points</h1>
        <p>Trade accumulated points to ...</p>
      </div>

      <form onSubmit={handleFindRecord}>
        <h5 className="text-sm text-green-600 font-medium mb-2.5">
          Enter Record's Information
        </h5>
        <div className="flex flex-col sm:flex-row items-stretch gap-5 w-full">
          <FloatingLabelInput
            label="Record ID"
            value={recordId}
            onChange={(e) => setRecordId(e.target.value)}
            required
          />

          <FloatingLabelInput
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <button
            className="bg-green-600 text-base text-white px-10 py-2 rounded-lg hover:bg-green-primary/80 duration-300 cursor-pointer"
            type="submit"
          >
            Find Record
          </button>
        </div>
      </form>

      <div className="flex flex-col md:flex-row gap-5">
        {recordData && (
          <RecordInformation
            recordData={recordData}
            onConfirmRecord={confirmRecord}
          />
        )}

        <AvailableProductsSection
          availableProducts={availableProducts}
          quantityInputs={quantityInputs}
          onQuantityInput={handleQuantityInput}
          onRedeem={handleRedeem}
          redeemInProgress={redeemInProgress}
        />
      </div>
    </main>
  );
};

interface RecordInformationProps {
  recordData: RecordData;
  onConfirmRecord: () => void;
}

const RecordInformation = ({
  recordData,
  onConfirmRecord,
}: RecordInformationProps) => {
  return (
    <div className="flex flex-col gap-5 w-full md:max-w-96">
      <div className="px-5 py-8 bg-white rounded-md text-green-600 shadow">
        <h1 className="font-bold text-xl mb-3">Record Information</h1>

        <div className="flex flex-col gap-1 font-medium">
          <p>
            Record ID: <span>{recordData._id}</span>
          </p>
          <p>
            Name: <span>{formatName(recordData)}</span>
          </p>
          <p>
            Address: <span>{recordData.address}</span>
          </p>
          <p>
            Contact: <span>{recordData.contact_number}</span>
          </p>
          <p className="text-2xl font-semibold">
            Points: <span>{formatPoints(recordData.points)}</span>
          </p>
        </div>
      </div>

      <button
        className="bg-green-600 text-white py-2 px-3 self-center w-full sm:self-start rounded-md hover:bg-green-primary/80 duration-300 cursor-pointer"
        onClick={onConfirmRecord}
      >
        Confirm Record
      </button>
    </div>
  );
};

interface AvailableProductsSectionProps {
  availableProducts: Product[];
  quantityInputs: Record<string, number>;
  onQuantityInput: (productId: string, value: string) => void;
  onRedeem: (product: Product) => void;
  redeemInProgress: boolean;
}

const AvailableProductsSection = ({
  availableProducts,
  quantityInputs,
  onQuantityInput,
  onRedeem,
  redeemInProgress,
}: AvailableProductsSectionProps) => {
  if (availableProducts.length === 0) {
    return null;
  }

  return (
    <div className="grow bg-white shadow p-5 rounded-lg text-green-primary">
      <h1 className="font-semibold text-xl mb-5">
        Available Products based on points from record:
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {availableProducts.map((product) => (
          <ProductCard
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

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityInput: (productId: string, value: string) => void;
  onRedeem: (product: Product) => void;
  redeemInProgress: boolean;
}

const ProductCard = ({
  product,
  quantity,
  onQuantityInput,
  onRedeem,
  redeemInProgress,
}: ProductCardProps) => {
  return (
    <div className="bg-green-600/90 px-4 py-4 rounded-lg text-white">
      <div className="flex xs:flex-row gap-3 mb-2">
        <div className="bg-white shrink-0 p-2 rounded-md">
          <img
            src={product.image || '/placeholder.png'}
            alt={product.name}
            className="h-16 w-20 sm:h-20 sm:w-24 p-2 bg-gray-1 rounded-md object-contain"
          />
        </div>

        <div className="flex flex-col justify-start gap-0.5 h-full text-xs md:text-sm grow">
          <h1 className="font-semibold">{product.name}</h1>
          <p className="opacity-90">{product.description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm md:text-base">
        <label
          htmlFor={`quantity-${product._id}`}
          className="flex items-center gap-2 font-medium grow mt-auto"
        >
          <span>Quantity:</span>
          <input
            id={`quantity-${product._id}`}
            type="number"
            placeholder="0"
            min="0"
            className="w-14 placeholder:text-center bg-transparent border-b border-b-white text-center outline-none"
            value={quantity || ''}
            onChange={(e) => onQuantityInput(product._id, e.target.value)}
          />
        </label>

        <div className="flex items-center justify-between text-xs md:text-base">
          <p>{product.requiredPoints} points</p>
          <button
            className="font-medium py-0.5 px-4 rounded-md bg-white text-green-600 self-end hover:bg-green-50 transition"
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

export default SwapItem;
