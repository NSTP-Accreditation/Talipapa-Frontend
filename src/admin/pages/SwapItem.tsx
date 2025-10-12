import { useCallback, useMemo, useState } from 'react';
import { formatName, formatPoints } from '@/utils/formatter';
import { useAuthFetch } from '../hooks/useAuthFetch';
import FloatingLabelInput from '../components/FloatingLabelInput';
import { Spinner, InlineLoader, PageLoadingSkeleton } from '@/components/LoadingSkeletons';
import { useLoadingState } from '@/hooks/useLoadingState';

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
  // Add loading state with minimum 2 second display
  const { isLoading: pageLoading } = useLoadingState(2000);

  const [redeemInProgress, setRedeemInProgress] = useState(false);
  const [searchingRecord, setSearchingRecord] = useState(false);
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
    setSearchingRecord(true);
    await findRecord();
    setSearchingRecord(false);
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

  // Show loading skeleton while loading
  if (pageLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <main className="flex flex-col gap-8 p-8">
      {/* Header Section */}
      <div className="flex flex-col items-start">
        <h1 className="font-bold text-4xl tracking-wide text-gray-900 mb-3">
          Trade Points
        </h1>
        <p className="text-lg" style={{ color: '#838383' }}>
          Exchange accumulated points for community products and rewards
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleFindRecord}>
        <div className="bg-white rounded-xl shadow-md p-8">
          <h5
            className="text-lg font-semibold mb-6"
            style={{ color: '#1a4d2e' }}
          >
            Find Resident Record
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
              className="text-lg font-semibold text-white px-10 py-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: '#1a4d2e' }}
              type="submit"
              disabled={searchingRecord}
            >
              {searchingRecord ? (
                <>
                  <Spinner size="sm" color="#ffffff" />
                  <span>Searching...</span>
                </>
              ) : (
                <>🔍 Find Record</>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Content Section */}
      <div className="flex flex-col lg:flex-row gap-8">
        {searchingRecord ? (
          <InlineLoader text="Searching for record..." />
        ) : null}
        {!searchingRecord && (
          <>
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
          </>
        )}
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
    <div className="flex flex-col gap-8 w-full lg:max-w-md">
      <div
        className="p-10 bg-white rounded-lg shadow-md"
        style={{ color: '#1a4d2e' }}
      >
        <h1 className="font-bold text-3xl mb-8">Record Information</h1>

        <div className="flex flex-col gap-4 text-lg">
          <p>
            <span className="font-semibold">Record ID:</span>{' '}
            <span>{recordData._id}</span>
          </p>
          <p>
            <span className="font-semibold">Name:</span>{' '}
            <span>{formatName(recordData)}</span>
          </p>
          <p>
            <span className="font-semibold">Address:</span>{' '}
            <span>{recordData.address}</span>
          </p>
          <p>
            <span className="font-semibold">Contact:</span>{' '}
            <span>{recordData.contact_number}</span>
          </p>
          <p className="text-3xl font-bold mt-4">
            <span className="font-semibold">Points:</span>{' '}
            <span>{formatPoints(recordData.points)}</span>
          </p>
        </div>
      </div>

      <button
        className="py-4 px-6 text-lg font-semibold text-white rounded-lg shadow-md hover:opacity-80 transition-opacity duration-300"
        style={{ backgroundColor: '#1a4d2e' }}
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
    <div
      className="grow bg-white shadow-md p-10 rounded-lg"
      style={{ color: '#1a4d2e' }}
    >
      <h1 className="font-bold text-3xl mb-8">
        Available Products based on points from record:
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
    <div
      className="px-6 py-6 rounded-lg text-white shadow-md"
      style={{ backgroundColor: '#1a4d2e' }}
    >
      <div className="flex gap-5 mb-5">
        <div
          className="shrink-0 p-3 rounded-lg"
          style={{ backgroundColor: '#F6F6F6' }}
        >
          <img
            src={product.image || '/placeholder.png'}
            alt={product.name}
            className="h-20 w-24 object-contain rounded"
          />
        </div>

        <div className="flex flex-col justify-start gap-2 grow">
          <h1 className="font-bold text-xl">{product.name}</h1>
          <p className="text-base opacity-90">{product.description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 text-base">
        <label
          htmlFor={`quantity-${product._id}`}
          className="flex items-center gap-3 font-semibold"
        >
          <span>Quantity:</span>
          <input
            id={`quantity-${product._id}`}
            type="number"
            placeholder="0"
            min="0"
            className="w-20 px-2 py-1 placeholder:text-center bg-white/10 border-2 border-white rounded text-center outline-none"
            value={quantity || ''}
            onChange={(e) => onQuantityInput(product._id, e.target.value)}
          />
        </label>

        <div className="flex items-center justify-between text-lg">
          <p className="font-bold">{product.requiredPoints} points</p>
          <button
            className="font-semibold py-2 px-6 rounded-lg bg-white shadow-md hover:opacity-80 transition-opacity duration-300"
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

export default SwapItem;
