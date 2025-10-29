import { useCallback, useState } from 'react';
import { useAuthFetch } from '../../hooks/useAuthFetch';
import { useToast } from '@/hooks/useToast';
import { sanitizeName, validateName } from '@/utils/validation';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import {
  Spinner,
  InlineLoader,
} from '@/components/LoadingSkeletons';
import { ResponsiveSkeleton } from '../../../components/ResponsiveSkeleton';
import { useLoadingState } from '@/hooks/useLoadingState';
import { ArrowLeftRight, Search } from 'lucide-react';
import RecordInformation from './components/RecordInformation';
import Availableproducts from './components/AvailableProducts';
import { ProductInterface, RecordInterface } from '@/types/global.types';

const SwapItem = () => {
  // Add loading state with 1 second display
  const [redeemInProgress, setRedeemInProgress] = useState(false);
  const [searchingRecord, setSearchingRecord] = useState(false);
  // Store only the editable part (suffix) of the Record ID, fixed prefix is 'BT-'
  const [recordIdRest, setRecordIdRest] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [recordData, setRecordData] = useState<RecordInterface | null>(null);
  const [availableProducts, setAvailableProducts] = useState<ProductInterface[]>([]);
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
    (products: ProductInterface[], record: RecordInterface | null) => {
      if (!record) return [];
      const filtered = products.filter(
        (product) => product.requiredPoints <= record.points
      );
      setAvailableProducts(filtered);
      return filtered;
    },
    []
  );

  const findProducts = async (recordOverride?: RecordInterface) => {
    try {
      const products = await authFetch('/products');
      const recordToUse = recordOverride || recordData;
      filterAvailableProducts(products, recordToUse);
    } catch (error) {
      console.error('Error fetching products:', error);
      setRecordData(null);
    }
  };

  const handleQuantityInput = (productId: string, value: string) => {
    const parsedValue = parseInt(value, 10) || 0;

    setQuantityInputs((prev) => ({
      ...prev,
      [productId]: parsedValue,
    }));
  };

  const handleRedeem = async (product: ProductInterface) => {
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
                findProducts={findProducts}
              />
            )}

            <Availableproducts
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

export default SwapItem;
