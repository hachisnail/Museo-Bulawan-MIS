// components/modals/ImagePreview.jsx
import React from 'react';

const ImagePreview = ({ isOpen, onClose, imageSrc, fileName }) => {
  if (!isOpen) return null;

  // Extract real filename from path
  const getFileName = () => {
    const parts = imageSrc.split('/');
    return fileName || parts[parts.length - 1];
  };

  // Handle download
  const handleDownload = () => {
    // Create an anchor element and set properties
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = getFileName();
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[60]" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg p-2" onClick={e => e.stopPropagation()}>
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <button 
            onClick={handleDownload}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            title="Download image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button 
            onClick={onClose}
            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
            title="Close preview"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="max-h-[85vh] overflow-auto">
          <img 
            src={imageSrc} 
            alt="Full size preview" 
            className="max-w-full max-h-[85vh] object-contain mx-auto"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.png';
            }}
          />
        </div>
        
    
      </div>
    </div>
  );
};

export default ImagePreview;
