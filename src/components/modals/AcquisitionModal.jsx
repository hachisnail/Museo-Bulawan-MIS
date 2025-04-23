    import React from 'react';
    
    const AcquisitionModal = ({ isOpen, onClose, selectedDonationForm }) => {
        if (!isOpen || !selectedDonationForm) return null;
    
        return (
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
                {selectedDonationForm.ContributionType?.accession_type === 'Lending' && (
                <div className="w-full h-auto flex flex-col gap-5 border-t-2 border-gray-300 pt-6">
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
    
                <span className="text-3xl font-semibold border-t-2 border-gray-300 mt-6 pt-6">About the Artifact</span>
                <div className="w-full h-auto flex flex-col items-start mt-8 gap-6">
                <div className="w-full h-auto flex flex-col">
                    <span className="text-2xl">Title/Name of the Artifact.</span>
                    <span className="text-xl text-[#4E84D4]">{selectedDonationForm.artifact_name}</span>
                </div>
                <div className="w-full h-auto flex flex-col">
                    <span className="text-2xl">Artifact Description</span>
                    <span className="text-xl text-[#4E84D4]">{selectedDonationForm.artifact_description}</span>
                </div>
                <div className="w-full h-auto flex flex-col">
                    <span className="text-2xl">How and where the artifact is acquired.</span>
                    <span className="text-xl text-[#4E84D4]">{selectedDonationForm.acquired}</span>
                </div>
                <div className="w-full h-auto flex flex-col">
                    <span className="text-2xl">Information about the artifact that the museum should know.</span>
                    <span className="text-xl text-[#4E84D4]">{selectedDonationForm.additional_info}</span>
                </div>
                <div className="w-full h-auto flex flex-col">
                    <span className="text-2xl">Brief narrative or story related to the artifact.</span>
                    <span className="text-xl text-[#4E84D4]">{selectedDonationForm.narrative}</span>
                </div>
                <div className="w-full h-auto flex flex-col gap-2">
                    <span className="text-2xl">Image/s of the artifact.</span>
                    <div className="w-full h-100 px-4 border-2 border-gray-400">
                    {/* Add image carousel or scrollable images here */}
                    </div>
                </div>
                <div className="w-full h-auto flex flex-col">
                    <span className="text-2xl">Relevant documentation or research about the artifact.</span>
                    <span className="text-xl text-[#FF0000]">
                    {selectedDonationForm.documents || 'N/A'}
                    </span>
                </div>
                <div className="w-full h-auto flex flex-col gap-2">
                    <span className="text-2xl">Related image/s about the artifact.</span>
                    <div className="w-full h-100 px-4 border-2 border-gray-400">
                    {/* Add image carousel or scrollable images here */}
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        );
    };
    
    
        
    export default AcquisitionModal;
