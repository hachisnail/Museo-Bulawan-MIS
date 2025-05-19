// components/modals/SelectedDonatorModal.jsx
import React, { useState } from 'react';
import DocumentView from './DocumentView';
import ImagePreview from './ImagePreview';

const SelectedDonatorModal = ({ isOpen, onClose, selectedDonationForm }) => {
  const [previewImage, setPreviewImage] = useState(null);

  if (!isOpen || !selectedDonationForm) return null;

  const getDocumentKeys = (form) => {
    if (!form || !form.documents) return [];
    try {
      let docs = form.documents;
      if (typeof docs === 'string') {
        try {
          docs = JSON.parse(docs);
        } catch (e) {
          return docs.split(',').filter(Boolean);
        }
      }
      if (Array.isArray(docs)) return docs;
      if (typeof docs === 'object') return [docs];
      return [];
    } catch (error) {
      console.error('Error parsing documents:', error);
      return [];
    }
  };

  const documentKeys = getDocumentKeys(selectedDonationForm);

  const handleOpenPreview = (imagePath) => {
    setPreviewImage(imagePath);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white w-[60rem] p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center text-2xl mb-4">
            <div className="text-4xl font-bold">
              <span>{selectedDonationForm.ContributionType?.accession_type}</span>
              <span> Form</span>
            </div>
            <button
              className="px-4 py-2 text-black rounded-lg hover:bg-gray-300"
              onClick={onClose}
            >
              X
            </button>
          </div>

          {/* Lending Info */}
          {selectedDonationForm.ContributionType?.accession_type === 'Lending' && (
            <div className="mb-6 border-t pt-4">
              <span className="text-3xl font-semibold">Reason For Lending</span>
              <div className="flex flex-col gap-4 mt-4">
                <div>
                  <span className="text-2xl">Proposed duration of the loan:</span>
                  <div className="text-xl text-[#4E84D4]">{selectedDonationForm.ContributionType?.duration_period || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-2xl">Handling requirements:</span>
                  <div className="text-xl text-[#4E84D4]">{selectedDonationForm.ContributionType?.condition || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-2xl">Liability concerns:</span>
                  <div className="text-xl text-[#4E84D4]">{selectedDonationForm.ContributionType?.remarks || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-2xl">Lending reason:</span>
                  <div className="text-xl text-[#4E84D4]">{selectedDonationForm.ContributionType?.reason || 'N/A'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Artifact Info */}
          <div className="border-t pt-4">
            <span className="text-3xl font-semibold">About the Artifact</span>
            <div className="flex flex-col gap-4 mt-4">
              <div>
                <span className="text-2xl">Title/Name:</span>
                <div className="text-xl text-[#4E84D4]">{selectedDonationForm.artifact_name}</div>
              </div>
              <div>
                <span className="text-2xl">Description:</span>
                <div className="text-xl text-[#4E84D4] break-words">{selectedDonationForm.description}</div>
              </div>
              <div>
                <span className="text-2xl">Acquisition details:</span>
                <div className="text-xl text-[#4E84D4] break-words">{selectedDonationForm.acquired}</div>
              </div>
              <div>
                <span className="text-2xl">Additional info:</span>
                <div className="text-xl text-[#4E84D4] break-words">{selectedDonationForm.additional_info}</div>
              </div>
              <div>
                <span className="text-2xl">Narrative/Story:</span>
                <div className="text-xl text-[#4E84D4] break-words">{selectedDonationForm.narrative}</div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="mt-6 border-t pt-4">
            <span className="text-2xl font-semibold">Artifact Images</span>
            <div className="flex flex-wrap gap-3 mt-3 max-h-80 overflow-y-auto">
              {(() => {
                try {
                  const images = JSON.parse(selectedDonationForm.images || '[]');
                  return images.length ? images.map((img, i) => (
                    <img
                      key={i}
                      src={`/${img}`}
                      alt={`Artifact ${i}`}
                      className="h-40 w-auto border rounded shadow cursor-pointer"
                      onClick={() => handleOpenPreview(`/${img}`)}
                      onError={(e) => { e.target.src = '/placeholder-image.png'; }}
                    />
                  )) : <p className="text-gray-500">No images available</p>;
                } catch {
                  return <p className="text-red-500">Error loading images</p>;
                }
              })()}
            </div>
          </div>

          {/* Related Images */}
          <div className="mt-6 border-t pt-4">
            <span className="text-2xl font-semibold">Related Images</span>
            <div className="flex flex-wrap gap-3 mt-3 max-h-80 overflow-y-auto">
              {(() => {
                try {
                  const images = JSON.parse(selectedDonationForm.related_images || '[]');
                  return images.length ? images.map((img, i) => (
                    <img
                      key={i}
                      src={`/${img}`}
                      alt={`Related ${i}`}
                      className="h-40 w-auto border rounded shadow cursor-pointer"
                      onClick={() => handleOpenPreview(`/${img}`)}
                      onError={(e) => { e.target.src = '/placeholder-image.png'; }}
                    />
                  )) : <p className="text-gray-500">No related images available</p>;
                } catch {
                  return <p className="text-red-500">Error loading related images</p>;
                }
              })()}
            </div>
          </div>

          {/* Documents */}
          <div className="mt-6 border-t pt-4">
            <span className="text-2xl font-semibold">Documents</span>
            {documentKeys.length > 0 ? (
              <div className="mt-3 bg-gray-100 p-4 rounded">
                <DocumentView documentKeys={documentKeys} />
              </div>
            ) : (
              <p className="text-xl text-[#FF0000]">No documents available</p>
            )}
          </div>
        </div>
      </div>

      {/* Optional: Image preview modal */}
      <ImagePreview
        isOpen={!!previewImage}
        onClose={handleClosePreview}
        imageSrc={previewImage}
      />
    </>
  );
};

export default SelectedDonatorModal;
