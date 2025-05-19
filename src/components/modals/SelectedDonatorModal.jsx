// components/modals/SelectedDonatorModal.jsx
import React, { useState } from 'react';
import DocumentView from './DocumentView';
import ImagePreview from './ImagePreview';

const SelectedDonatorModal = ({ isOpen, onClose, selectedDonationForm }) => {
    const [previewImage, setPreviewImage] = useState(null);
    
    if (!isOpen || !selectedDonationForm) return null;

    // Helper function to parse document keys
    const getDocumentKeys = (form) => {
        if (!form || !form.documents) return [];
        
        try {
            let docs = form.documents;
            
            // Handle string format (from database)
            if (typeof docs === 'string') {
                try {
                    docs = JSON.parse(docs);
                } catch (e) {
                    // If not valid JSON, it might be a comma-separated string
                    return docs.split(',').filter(Boolean);
                }
            }
            
            // Handle array or object format
            if (Array.isArray(docs)) {
                return docs;
            } else if (typeof docs === 'object') {
                return [docs];
            }
            
            return [];
        } catch (error) {
            console.error('Error parsing documents:', error);
            return [];
        }
    };

    // Get document keys for the current form
    const documentKeys = getDocumentKeys(selectedDonationForm);

    // Open image preview
    const handleOpenPreview = (imagePath) => {
        setPreviewImage(imagePath);
    };

    // Close image preview
    const handleClosePreview = () => {
        setPreviewImage(null);
    };

    return (
        <>
            <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                <div className="bg-white w-[60rem] p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center text-2xl">
                        <div className="text-4xl font-bold">
                            <span>{selectedDonationForm.ContributionType.accession_type}</span>
                            <span> Form</span>
                        </div>
                        <button
                            className="mt-6 px-2 py-2 text-black rounded-lg hover:bg-gray-400"
                            onClick={onClose} 
                        >
                            X
                        </button>
                    </div>

                    <div className="w-full bg-white max-h-[60em] px-12 flex flex-col overflow-auto mt-4">
                        {/* First section for lending forms */}
                        {selectedDonationForm.ContributionType?.accession_type === 'Lending' && (
                            <div className="w-full h-auto flex flex-col gap-5 border-t-2 border-gray-300 pt-6">
                                {/* Content unchanged */}
                                <span className="text-3xl font-semibold">Reason For Lending</span>
                                <div className="w-full h-auto flex flex-col items-start gap-6">
                                    <div className="w-full h-auto flex flex-col">
                                        <span className="text-2xl">Proposed duration of the loan.</span>
                                        <span className="text-xl text-[#4E84D4]">
                                            {selectedDonationForm.ContributionType?.duration_period || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="w-full h-auto flex flex-col">
                                        <span className="text-2xl">Specific conditions or requirements for handling of the artifact.</span>
                                        <span className="text-xl text-[#4E84D4]">
                                            {selectedDonationForm.ContributionType?.condition || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="w-full h-auto flex flex-col">
                                        <span className="text-2xl">Specific liability concerns or requirements regarding the artifact.</span>
                                        <span className="text-xl text-[#4E84D4]">
                                            {selectedDonationForm.ContributionType?.remarks || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="w-full h-auto flex flex-col">
                                        <span className="text-2xl">Reason for lending.</span>
                                        <span className="text-xl text-[#4E84D4]">
                                            {selectedDonationForm.ContributionType?.reason || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* About the Artifact section */}
                        <span className="text-3xl font-semibold border-t-2 border-gray-300 mt-6 pt-6">About the Artifact</span>
                        <div className="w-full h-auto flex flex-col items-start mt-8 gap-6">
                            {/* Other content unchanged */}
                            <div className="w-full h-auto flex flex-col">
                                <span className="text-2xl">Title/Name of the Artifact.</span>
                                <span className="text-xl text-[#4E84D4]">{selectedDonationForm.artifact_name}</span>
                            </div>
                            <div className="w-full h-auto flex flex-col">
                                <span className="text-2xl">Artifact Description</span>
                                <span className="text-xl text-[#4E84D4] break-words">{selectedDonationForm.description}</span>
                            </div>
                            <div className="w-full h-auto flex flex-col">
                                <span className="text-2xl">How and where the artifact is acquired.</span>
                                <span className="text-xl text-[#4E84D4] break-words">{selectedDonationForm.acquired}</span>
                            </div>
                            <div className="w-full h-auto flex flex-col">
                                <span className="text-2xl">Information about the artifact that the museum should know.</span>
                                <span className="text-xl text-[#4E84D4] break-words">{selectedDonationForm.additional_info}</span>
                            </div>
                            <div className="w-full h-auto flex flex-col">
                                <span className="text-2xl">Brief narrative or story related to the artifact.</span>
                                <span className="text-xl text-[#4E84D4] break-words">{selectedDonationForm.narrative}</span>
                            </div>
                            
                            {/* Image section - UPDATED with preview and download */}
                            <div className="w-full h-auto flex flex-col gap-2">
                                <span className="text-2xl">Image/s of the artifact.</span>
                                <div className="w-full min-h-32 px-4 border-2 border-gray-400">
                                    {selectedDonationForm.images && (
                                        <div className="flex flex-wrap gap-3 py-3 overflow-x-auto max-h-80 overflow-y-auto">
                                            {(() => {
                                                try {
                                                    const imagePaths = JSON.parse(selectedDonationForm.images);
                                                    return imagePaths.map((imagePath, index) => (
                                                        <div key={index} className="relative flex-shrink-0 group">
                                                            <img
                                                                src={`/${imagePath}`}
                                                                alt={`Artifact image ${index + 1}`}
                                                                className="h-52 w-auto object-contain border border-gray-200 rounded shadow-sm cursor-pointer hover:opacity-90"
                                                                onClick={() => handleOpenPreview(`/${imagePath}`)}
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = '/placeholder-image.png';
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <div className="flex gap-2">
                                                                    {/* Preview button */}
                                                                    <button 
                                                                        onClick={() => handleOpenPreview(`/${imagePath}`)}
                                                                        className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700"
                                                                        title="Preview image"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                    
                                                                    {/* Download button */}
                                                                    <a 
                                                                        href={`/${imagePath}`} 
                                                                        download
                                                                        className="bg-green-600 text-white p-1.5 rounded-full hover:bg-green-700"
                                                                        title="Download image"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ));
                                                } catch (error) {
                                                    console.error("Error parsing images:", error);
                                                    return <p className="text-red-500 py-4 text-center">Error loading images</p>;
                                                }
                                            })()}
                                        </div>
                                    )}
                                    {(!selectedDonationForm.images || selectedDonationForm.images === '[]') && (
                                        <p className="text-gray-500 py-4 text-center">No images available</p>
                                    )}
                                </div>
                            </div>
                            
                            {/* Document section unchanged */}
                            <div className="w-full h-auto flex flex-col">
                                <span className="text-2xl">Relevant documentation or research about the artifact.</span>
                                {documentKeys.length > 0 ? (
                                    <div className="mt-2 border rounded-lg p-3 bg-gray-50">
                                        <DocumentView documentKeys={documentKeys} />
                                    </div>
                                ) : (
                                    <span className="text-xl text-[#FF0000]">No documents available</span>
                                )}
                            </div>
                            
                            {/* Related images section - UPDATED with preview and download */}
                            <div className="w-full h-auto flex flex-col gap-2">
                                <span className="text-2xl">Related image/s about the artifact.</span>
                                <div className="w-full min-h-32 px-4 border-2 border-gray-400">
                                    {selectedDonationForm.related_images && (
                                        <div className="flex flex-wrap gap-3 py-3 overflow-x-auto max-h-80 overflow-y-auto">
                                            {(() => {
                                                try {
                                                    const imagePaths = JSON.parse(selectedDonationForm.related_images);
                                                    return imagePaths.map((imagePath, index) => (
                                                        <div key={index} className="relative flex-shrink-0 group">
                                                            <img
                                                                src={`/${imagePath}`}
                                                                alt={`Related image ${index + 1}`}
                                                                className="h-52 w-auto object-contain border border-gray-200 rounded shadow-sm cursor-pointer hover:opacity-90"
                                                                onClick={() => handleOpenPreview(`/${imagePath}`)}
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = '/placeholder-image.png';
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <div className="flex gap-2">
                                                                    {/* Preview button */}
                                                                    <button 
                                                                        onClick={() => handleOpenPreview(`/${imagePath}`)}
                                                                        className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700"
                                                                        title="Preview image"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                    
                                                                    {/* Download button */}
                                                                    <a 
                                                                        href={`/${imagePath}`} 
                                                                        download
                                                                        className="bg-green-600 text-white p-1.5 rounded-full hover:bg-green-700"
                                                                        title="Download image"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ));
                                                } catch (error) {
                                                    console.error("Error parsing related images:", error);
                                                    return <p className="text-red-500 py-4 text-center">Error loading related images</p>;
                                                }
                                            })()}
                                        </div>
                                    )}
                                    {(!selectedDonationForm.related_images || selectedDonationForm.related_images === '[]') && (
                                        <p className="text-gray-500 py-4 text-center">No related images available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            <ImagePreview 
                isOpen={!!previewImage} 
                onClose={handleClosePreview} 
                imageSrc={previewImage}
            />
        </>
    );
};

export default SelectedDonatorModal;
