import { Cog } from 'lucide-react';

const SettingsHeader = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
          <Cog className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Settings
          </h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1 font-medium">
            Manage system configuration and preferences
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsHeader;
