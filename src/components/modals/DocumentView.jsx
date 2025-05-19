import React from 'react';

const DocumentView = ({ documentKeys }) => {
  const renderDocumentItem = (doc, index) => {
    // Handle different document formats
    if (typeof doc === 'string') {
      // It's just a path or key
      return (
        <li key={index} className="text-blue-600 hover:underline cursor-pointer">
          <a href={`/${doc}`} target="_blank" rel="noopener noreferrer">
            Document {index + 1}
          </a>
        </li>
      );
    } else if (typeof doc === 'object') {
      // It's an object with metadata
      return (
        <li key={index} className="text-blue-600 hover:underline cursor-pointer">
          <a href={`/${doc.path}`} target="_blank" rel="noopener noreferrer">
            {doc.originalName || `Document ${index + 1}`} 
            {doc.size && <span className="text-gray-500 text-sm ml-2">
              ({Math.round(doc.size / 1024)} KB)
            </span>}
          </a>
        </li>
      );
    }
    return null;
  };

  return (
    <ul className="list-disc pl-5 space-y-2">
      {documentKeys.length > 0 ? (
        documentKeys.map(renderDocumentItem)
      ) : (
        <li className="text-gray-500">No documents available</li>
      )}
    </ul>
  );
};

export default DocumentView;
