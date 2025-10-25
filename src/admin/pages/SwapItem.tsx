import { useCallback, useMemo, useState } from 'react';
import { formatName, formatPoints } from '@/utils/formatter';
import { useAuthFetch } from '../hooks/useAuthFetch';
import { useToast } from '@/hooks/useToast';
import { sanitizeName, validateName } from '@/utils/validation';
import FloatingLabelInput from '../components/FloatingLabelInput';
import {
  Spinner,
  InlineLoader,
  FormTablePageSkeleton,
} from '@/components/LoadingSkeletons';
import { useLoadingState } from '@/hooks/useLoadingState';
import { ArrowLeftRight, Search } from 'lucide-react';
import { ImageInt } from '../components/OfficialsPanel';

interface Product {
  _id: string;
  name: string;
  description: string;
  image: ImageInt;
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
  // Add loading state with 1 second display
  const { isLoading: pageLoading } = useLoadingState(1000);

  const [redeemInProgress, setRedeemInProgress] = useState(false);
  const [searchingRecord, setSearchingRecord] = useState(false);
  // Store only the editable part (suffix) of the Record ID, fixed prefix is 'BT-'
  const [recordIdRest, setRecordIdRest] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [isLastNameValid, setIsLastNameValid] = useState(false);
  const [recordData, setRecordData] = useState<RecordData | null>(null);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [quantityInputs, setQuantityInputs] = useState<Record<string, number>>(
    {}
  );
  const authFetch = useAuthFetch();
  const { success, error: showError } = useToast();

  const handleFindRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    // validate last name before searching
    const { valid, message } = validateName(lastName, true);
    if (!valid) {
      setLastNameError(message);
      showError(message || 'Invalid Last Name', { title: 'Invalid' });
      return;
    }

    setSearchingRecord(true);
    await findRecord();
    setSearchingRecord(false);
  };

  const findRecord = async () => {
    try {
      const updatedRecord = await authFetch(
        `/records/BT-${recordIdRest}?lastName=${lastName}`
      );
      setRecordData(updatedRecord);
    } catch (err) {
      console.error('Error finding record:', err);
      showError('No Record Found', { title: 'Not Found' });
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
      showError('Invalid Quantity', { title: 'Invalid' });
      setRedeemInProgress(false);
      return;
    }

    const totalRequiredPoints = quantity * product.requiredPoints;

    if (totalRequiredPoints > recordData.points) {
      showError('Not Enough Points to Redeem Product', {
        title: 'Insufficient Points',
      });
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
      const data = await authFetch(`/records/BT-${recordIdRest}`, {
        method: 'PATCH',
        body: JSON.stringify(requestBody),
      });

      success(
        `${data.message}: Current Points: ${recordData.points - totalRequiredPoints}`,
        { title: 'Redemption Successful' }
      );

      // Refresh data after successful redemption
      const updatedRecord = await authFetch(
        `/records/BT-${recordIdRest}?lastName=${lastName}`
      );
      setRecordData(updatedRecord);
      await findProducts(updatedRecord);

      // Reset quantity input for this product
      setQuantityInputs((prev) => ({
        ...prev,
        [product._id]: 0,
      }));
    } catch (error) {
      const { error: showError } = useToast();
      showError(error instanceof Error ? error.message : 'An error occurred', {
        title: 'Error',
      });
    } finally {
      setRedeemInProgress(false);
    }
  };

  // Show loading skeleton while loading
  if (pageLoading) {
    return <FormTablePageSkeleton />;
  }

  return (
    <main className="flex flex-col gap-4 sm:gap-8 p-4 sm:p-8">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-2 sm:gap-3">
          <ArrowLeftRight className="w-6 h-6 sm:w-10 sm:h-10 text-green-600" />
          <h1 className="font-bold text-2xl sm:text-4xl tracking-wide text-gray-900">
            Trade Points
          </h1>
        </div>
        <div className="mt-2 sm:mt-3">
          <p className="text-sm sm:text-lg" style={{ color: '#838383' }}>
            Exchange accumulated points for community products and rewards
          </p>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleFindRecord}>
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-8">
          <h5
            className="text-base sm:text-lg font-semibold mb-4 sm:mb-6"
            style={{ color: '#1a4d2e' }}
          >
            Find Resident Record
          </h5>
          <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-5 w-full">
            {/* Record ID with BT- prefix using FloatingLabelInput */}
            <FloatingLabelInput
              label="Record ID"
              value={recordIdRest}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, '');
                const limited = digitsOnly.slice(0, 4);
                setRecordIdRest(limited);
              }}
              required
              prefix="BT-"
              inputClassName="placeholder:text-gray-400"
            />

            <FloatingLabelInput
              label="Last Name"
              value={lastName}
              onChange={(e) => {
                const filtered = sanitizeName(e.target.value);
                setLastName(filtered);
                // live-validate
                const { valid, message } = validateName(filtered, true);
                setIsLastNameValid(valid);
                setLastNameError(valid ? '' : message || 'Invalid Last Name');
              }}
              required
            />
            {lastNameError ? (
              <p className="text-xs sm:text-sm text-red-600 mt-1">
                {lastNameError}
              </p>
            ) : null}

            <button
              className="text-sm sm:text-lg font-semibold text-white px-6 sm:px-10 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: '#1a4d2e' }}
              type="submit"
              disabled={searchingRecord}
            >
              {searchingRecord ? (
                <>
                  <Spinner size="sm" color="#ffffff" />
                  <span className="text-sm sm:text-base">Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Find Record</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Content Section */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
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
    <div className="flex flex-col gap-4 sm:gap-8 w-full lg:max-w-md">
      <div
        className="p-6 sm:p-10 bg-white rounded-lg shadow-md"
        style={{ color: '#1a4d2e' }}
      >
        <h1 className="font-bold text-xl sm:text-3xl mb-4 sm:mb-8">
          Record Information
        </h1>

        <div className="flex flex-col gap-2 sm:gap-4 text-sm sm:text-lg">
          <p className="break-words">
            <span className="font-semibold">Record ID:</span>{' '}
            <span>{recordData._id}</span>
          </p>
          <p className="break-words">
            <span className="font-semibold">Name:</span>{' '}
            <span>{formatName(recordData)}</span>
          </p>
          <p className="break-words">
            <span className="font-semibold">Address:</span>{' '}
            <span>{recordData.address}</span>
          </p>
          <p className="break-words">
            <span className="font-semibold">Contact:</span>{' '}
            <span>{recordData.contact_number}</span>
          </p>
          <p className="text-xl sm:text-3xl font-bold mt-2 sm:mt-4">
            <span className="font-semibold">Points:</span>{' '}
            <span>{formatPoints(recordData.points)}</span>
          </p>
        </div>
      </div>

      <button
        className="py-3 sm:py-4 px-4 sm:px-6 text-base sm:text-lg font-semibold text-white rounded-lg shadow-md hover:opacity-80 transition-opacity duration-300"
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
      className="grow bg-white shadow-md p-4 sm:p-10 rounded-lg"
      style={{ color: '#1a4d2e' }}
    >
      <h1 className="font-bold text-xl sm:text-3xl mb-4 sm:mb-8">
        Available Products based on points from record:
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
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

export default SwapItem;
