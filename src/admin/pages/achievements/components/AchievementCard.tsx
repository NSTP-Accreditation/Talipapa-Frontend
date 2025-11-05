import { Trophy } from 'lucide-react';

type Props = {
  item: any;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (id: string) => void;
};

export default function AchievementCard({
  item,
  index,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {item.image ? (
          <img
            src={item.image.url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
            <Trophy className="w-20 h-20 text-green-600" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white mb-4 shadow-lg ring-4 ring-green-100 group-hover:scale-110 transition-transform duration-300">
          <Trophy className="w-6 h-6" />
        </div>

        <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-3 group-hover:text-green-600 transition-colors leading-tight">
          {item.title}
        </h3>

        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 line-clamp-3 flex-1">
          {item.description}
        </p>

        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-600 text-sm font-bold hover:text-green-700 hover:gap-3 transition-all mb-4"
          >
            <span>View Details</span>
            <span>→</span>
          </a>
        )}

        <div className="flex gap-2 sm:gap-3 mt-auto pt-4 border-t-2 border-gray-100">
          <button
            onClick={() => onEdit(index)}
            className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-sm"
            title="Edit Achievement"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>

          <button
            onClick={() => onDelete(item._id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 border-2 border-red-300 hover:border-red-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-sm"
            title="Delete Achievement"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
