
import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  titleClassName?: string;
  containerClassName?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, title, titleClassName = "text-3xl font-bold text-gray-800 mb-8", containerClassName = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" }) => {
  return (
    <div className={`min-h-[calc(100vh-80px)] bg-gray-50 ${containerClassName}`}> {/* 80px is navbar height */}
      {title && <h1 className={titleClassName}>{title}</h1>}
      {children}
    </div>
  );
};

export default PageContainer;
