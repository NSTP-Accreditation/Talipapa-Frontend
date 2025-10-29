import React from 'react';
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
    <div className="group bg-white rounded-xl overflow-hidden border-2 border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br ">
        {item.image ? (
          <img
            src={item.image.url}
            alt={item.title}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Trophy className="w-20 h-20 text-yellow-500" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-500 text-white mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
          <Trophy className="w-5 h-5" />
        </div>

        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-green-600 transition-colors leading-tight">
          {item.title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3 flex-1">
          {item.description}
        </p>

        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-600 text-sm font-semibold hover:text-green-700 hover:gap-3 transition-all mb-3"
          >
            <span>View Details</span>
            <span>→</span>
          </a>
        )}

        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit(index)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-semibold text-sm"
            title="Edit"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(item._id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-semibold text-sm"
            title="Delete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
