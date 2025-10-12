import { Leaf } from 'lucide-react';

export function SDGBanner() {
  return (
    <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white py-4 px-6 rounded-xl shadow-lg mb-8">
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <Leaf className="w-8 h-8" />
        <div className="text-center">
          <p className="font-bold text-lg">UN Sustainable Development Goal 7: Affordable and Clean Energy</p>
          <p className="text-sm opacity-90">Using AI to predict solar energy potential and improve access to reliable electricity</p>
        </div>
      </div>
    </div>
  );
}
