
import React from 'react';
import { ShoutoutPackage } from '../../types';
import Button from '../common/Button';
import { GiftIcon } from '../../constants';

interface PackageCardProps {
  packageInfo: ShoutoutPackage;
  onSelect: (packageId: string) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ packageInfo, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
      <img src={packageInfo.image} alt={packageInfo.name} className="w-full h-48 object-cover"/>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-semibold text-indigo-700 mb-2">{packageInfo.name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{packageInfo.description}</p>
        <div className="mb-4">
          <span className="text-4xl font-bold text-pink-500">${packageInfo.price.toFixed(2)}</span>
        </div>
        <ul className="space-y-2 mb-6 text-sm text-gray-700">
          {packageInfo.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <Button 
          onClick={() => onSelect(packageInfo.id)} 
          variant="primary" 
          className="w-full mt-auto"
          leftIcon={<GiftIcon className="w-5 h-5"/>}
        >
          Seleccionar Paquete
        </Button>
      </div>
    </div>
  );
};

export default PackageCard;
