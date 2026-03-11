import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  backgroundImage?: string;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, backgroundImage, className = '' }) => {
  return (
    <div className={`relative min-h-screen ${className}`}>
      {backgroundImage && (
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.06]"
          style={{ backgroundImage: `url(${backgroundImage})`, filter: 'blur(2px)' }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default PageContainer;
