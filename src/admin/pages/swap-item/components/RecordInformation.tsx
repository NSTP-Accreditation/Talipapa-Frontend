import { formatName, formatPoints } from "@/utils/formatter";
import { RecordInformationProps } from "../SwapItem.types";

const RecordInformation = ({
  recordData,
  findProducts,
}: RecordInformationProps) => {
  
  const confirmRecord = async () => {
    await findProducts();
  };

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
        onClick={confirmRecord}
      >
        Confirm Record
      </button>
    </div>
  );
};

export default RecordInformation;