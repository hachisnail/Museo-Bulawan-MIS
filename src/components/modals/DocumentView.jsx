// components/modals/DocumentView.jsx
import React, { useState, useEffect } from 'react';

const DocumentView = ({ documentKeys }) => {
  const [documents, setDocuments] = useState([]);
  
  useEffect(() => {
    // Fetch documents from localStorage based on keys
    if (documentKeys && documentKeys.length) {
      const docs = documentKeys.map(key => {
        // Handle both string keys and object keys
        const keyString = typeof key === 'object' ? key.key : key;
        try {
          const docData = localStorage.getItem(keyString);
          if (docData) {
            const parsed = JSON.parse(docData);
            return {
              key: keyString,
              name: parsed.name,
              type: parsed.type,
              size: parsed.size,
              downloadUrl: parsed.data,
              uploadDate: parsed.uploadDate
            };
          }
          return null;
        } catch (error) {
          console.error('Error parsing document:', error);
          return null;
        }
      }).filter(Boolean); // Remove nulls
      
      setDocuments(docs);
    } else {
      setDocuments([]);
    }
  }, [documentKeys]);

  const handleDownload = (doc) => {
    const link = document.createElement('a');
    link.href = doc.downloadUrl;
    link.download = doc.name || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!documents.length) {
    return <p className="text-gray-500 italic">No documents available</p>;
  }

  return (
    <div className="document-view mt-4">
     
      
        <ul className="space-y-2">
          {documents.map((doc, index) => (
            <li key={index} className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <i className="far fa-file-alt mr-2 text-blue-600"></i>
                <span className="truncate max-w-xs">{doc.name}</span>
                <span className="text-sm text-gray-500 ml-2">({Math.round(doc.size/1024)} KB)</span>
              </div>
              <button 
                onClick={() => handleDownload(doc)}
                className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
              >
                <i className="fas fa-download mr-1"></i> Download
              </button>
            </li>
          ))}
        </ul>
      </div>
  
  );
};

export default DocumentView;
