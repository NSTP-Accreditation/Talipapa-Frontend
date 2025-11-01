import { useCallback, useState } from 'react';
import { useAuthFetch } from '../../hooks/useAuthFetch';
import { useToast } from '@/hooks/useToast';
import { sanitizeName, validateName } from '@/utils/validation';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import { Spinner, InlineLoader } from '@/components/LoadingSkeletons';
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
  const [availableProducts, setAvailableProducts] = useState<
    ProductInterface[]
  >([]);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-3 sm:p-5 lg:p-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-600 rounded-full -ml-24 -mb-24"></div>
          </div>

          <div className="relative p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 shadow-lg ring-4 ring-green-100 animate-pulse-slow">
                <ArrowLeftRight className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Trade Points
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-medium">
                  Exchange accumulated points for community products and rewards
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleFindRecord}>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-8">
            <h5 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-green-700">
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
                className="text-sm sm:text-lg font-semibold text-white px-6 sm:px-10 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
      </div>
    </div>
  );
};

export default SwapItem;
