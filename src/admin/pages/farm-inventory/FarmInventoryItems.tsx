import ImageWithFallback from '@/components/ImageWithFallback';
import { Button, Card, CardContent } from '@/components/ui';
import { FarmItemInterface } from '@/types/global.types';
import { AlertTriangle, Edit, Plus, Sprout, Trash2 } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

type FarmInventoryItemsProps = {
  filteredFarmItems: FarmItemInterface[];
  farmItemsData: FarmItemInterface[];
  onAddItem: () => void;
  onUpdateItem: (item: FarmItemInterface) => void;
  onDeleteItem: (item: FarmItemInterface) => void;
};

const FarmInventoryItems = ({
  filteredFarmItems,
  farmItemsData,
  onAddItem,
  onUpdateItem,
  onDeleteItem
}: FarmInventoryItemsProps) => {

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full" />
            Farm Items
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 ml-3 sm:ml-4">
            Showing {filteredFarmItems?.length} of {farmItemsData?.length} items
          </p>
        </div>
        <Button
          onClick={onAddItem}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white inline-flex items-center justify-center gap-2 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40 transition-all duration-200 font-bold hover:scale-[1.02] active:scale-[0.98] text-sm lg:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add Farm Item
        </Button>
      </div>

      {/* Farm Items List */}
      <Card className="border-none shadow-xl overflow-hidden">
        <CardContent>
          <div className="divide-y divide-gray-100">
            {filteredFarmItems?.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Sprout className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No farm items found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search or add a new farm item
                </p>
              </div>
            ) : (
              filteredFarmItems?.map((item, idx) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 lg:p-6 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-transparent transition-all duration-200 group gap-3 sm:gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 lg:gap-5 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <ImageWithFallback
                        src={item.image.url}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover rounded-xl sm:rounded-2xl shadow-md group-hover:shadow-xl transition-shadow duration-200 ring-2 ring-green-100 group-hover:ring-green-200"
                      />
                      {(item.stocks || 0) === 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1 truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 line-clamp-2">
                        {item.description || 'No description'}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold bg-green-100 text-green-700">
                          <Sprout className="w-3 h-3" />
                          {item.subCategory || 'No category'}
                        </span>
                        {item.farmOrigin && (
                          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold bg-emerald-100 text-emerald-700">
                            📍 {item.farmOrigin}
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold ${
                            (item.stocks || 0) === 0
                              ? 'bg-red-100 text-red-700'
                              : (item.stocks || 0) < 10
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          Stock: {item.stocks || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col lg:flex-row items-center gap-2 sm:gap-2.5 lg:gap-3 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateItem(item)}
                      className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200"
                    >
                      <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteItem(item)}
                      className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:shadow-lg transition-all duration-200"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FarmInventoryItems;
