import React, { useRef, useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import { EditorContent } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Columns as ColumnsIcon,
  Image as ImageIcon,
  Type as TypeIcon,
  X as XIcon
} from 'lucide-react';
import axios from 'axios';
import ConfirmDialog from './ConfirmDialog.jsx';
import '../../index.css';
const ArticleModal = ({
  showModal,
  editor,
  isEditing,
  title,
  author,
  category,
  address,
  selectedDate,
  thumbnail,
  previewImage,
  Categories,
  onSubmit,
  handleThumbnailChange,
  setTitle,
  setAuthor,
  setCategory,
  setAddress,
  setSelectedDate,
  resetForm,
  contentImages,
  setContentImages,
  onClose
}) => {
  const imageInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  
  // State for tracking the "dirty" state of form
  const [isDirty, setIsDirty] = useState(false);
  
  // State for confirmation dialogs
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  
  // State for validation
  const [errors, setErrors] = useState({});
  
  const BASE_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  
  // State for removing or replacing the current thumbnail
  const [removeThumbnail, setRemoveThumbnail] = useState(false);
  // Track if a thumbnail is present
  const [hasThumbnail, setHasThumbnail] = useState(!!thumbnail || !!previewImage);


  
  // Update hasThumbnail when thumbnail changes
  useEffect(() => {
    setHasThumbnail(!!thumbnail || !!previewImage);
  }, [thumbnail, previewImage]);
  
  // Reset errors when clicking on fields with errors
  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Reset form and error states when modal is closed
  useEffect(() => {
    if (!showModal) {
      setErrors({});
      setIsDirty(false);
    }
  }, [showModal]);

  // Available font sizes for the dropdown
  const fontSizes = [
    { label: 'Small', value: '12px' },
    { label: 'Normal', value: '16px' },
    { label: 'Medium', value: '20px' },
    { label: 'Large', value: '24px' },
    { label: 'XL', value: '28px' },
    { label: '2XL', value: '32px' }
  ];

  // For uploading inline images from the editor
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('contentImages', file);

      const response = await axios.post(
        `${BASE_URL}/api/auth/article/content-images`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.data && response.data.images && response.data.images.length > 0) {
        const uploadedFilename = response.data.images[0];
        const fullImageUrl = `${BASE_URL}/uploads/${uploadedFilename}`;

        // Insert <img> into Tiptap
        if (editor) {
          editor.chain().focus().setImage({ src: fullImageUrl, alt: file.name }).run();
        }

        // Store the filename if needed
        setContentImages((prev) => [...prev, uploadedFilename]);
        
        // Mark form as dirty since we added content
        setIsDirty(true);
      }
    } catch (err) {
      console.error('Error uploading content image:', err);
      alert('Failed to upload image');
    }
  };

  // Apply selected font size to the editor
  const handleFontSizeChange = (e) => {
    const fontSize = e.target.value;
    editor?.chain().focus().setMark('textStyle', { fontSize }).run();
    setIsDirty(true);
  };
  
  // Handle removing the thumbnail
  const handleRemoveThumbnail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset file input
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
    
    // Set state to indicate thumbnail should be removed
    setRemoveThumbnail(true);
    setHasThumbnail(false);
    setIsDirty(true);
  };
  
  // Custom thumbnail change handler that wraps the original handler
  const handleCustomThumbnailChange = (e) => {
    // If we previously removed a thumbnail, reset that flag
    if (removeThumbnail) {
      setRemoveThumbnail(false);
    }
    
    // Call the original handler
    handleThumbnailChange(e);
    
    // Update hasThumbnail based on if a file was selected
    setHasThumbnail(!!e.target.files && e.target.files.length > 0);
    
    // Mark form as dirty if a file was selected
    if (e.target.files && e.target.files.length > 0) {
      setIsDirty(true);
    }
  };

  // Validate the form fields
  const validateForm = () => {
    const newErrors = {};
    
    // Check required fields
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!author.trim()) {
      newErrors.author = 'Author is required';
    }
    if (!category) {
      newErrors.category = 'Category is required';
    }
    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!selectedDate) {
      newErrors.selectedDate = 'Date is required';
    }
    
    // Check editor content
    if (!editor?.getHTML() || editor.getHTML() === '<p></p>') {
      newErrors.description = 'Body content is required';
    }
    
    return newErrors;
  };

  // Handle cancel button click
  const handleCancelClick = () => {
    // If form is dirty (has changes), show confirmation
    if (isDirty) {
      setShowCancelConfirm(true);
    } else {
      // If no changes, just close the modal
      resetForm();
    }
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // First validate the form
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      // If there are errors, show them
      setErrors(newErrors);
    } else {
      // If form is valid, show confirm dialog
      setShowSubmitConfirm(true);
    }
  };


  

  if (!showModal) {
    return null;
  }

  return (
    <>
      <div className=" gap-y-2 font-semibold flex flex-col">
        <span className="text-5xl">Add New Article</span>
        <div className="text-2xl flex items-center text-center">
          <span
            onClick={onClose}
            className="cursor-pointer text-gray-700 hover:text-black"
          >
            Article{' '}
          </span>
          <span className='text-2xl font-extrabold text-amber-900'>&nbsp; &gt; &nbsp;</span>
          <span> Insert </span>
        </div>


      </div>
        <div className="flex w-full h-full gap-4 pt-5 border-t-1 ">
          {/* LEFT SIDE - Editor + Form */}
          <div className="bg-white w-1/2 p-6 rounded-lg shadow-xl relative max-h-[90vh] overflow-auto">
            <button
              onClick={handleCancelClick}
              className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-black"
            >
              &times;
            </button>
            
            <h2 className="text-3xl font-bold mb-6">
              {isEditing ? 'Edit Article' : 'Add New Article'}
            </h2>
            
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className={`${errors.title ? 'text-red-600' : ''}`}>
                    Title {errors.title && '*'}
                  </label>
                  <input
                    className="w-full border px-2 py-1 rounded"
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setIsDirty(true);
                      clearFieldError('title');
                    }}
                    onClick={() => clearFieldError('title')}
                  />
                </div>
                
                {/* Author */}
                <div>
                  <label className={`${errors.author ? 'text-red-600' : ''}`}>
                    Author {errors.author && '*'}
                  </label>
                  <input
                    className="w-full border px-2 py-1 rounded"
                    type="text"
                    value={author}
                    onChange={(e) => {
                      setAuthor(e.target.value);
                      setIsDirty(true);
                      clearFieldError('author');
                    }}
                    onClick={() => clearFieldError('author')}
                  />
                </div>
                
                {/* Category */}
                <div>
                  <label className={`${errors.category ? 'text-red-600' : ''}`}>
                    Category {errors.category && '*'}
                  </label>
                  <select
                    className="w-full border px-2 py-1 rounded"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setIsDirty(true);
                      clearFieldError('category');
                    }}
                    onClick={() => clearFieldError('category')}
                  >
                    <option value="" disabled={category !== ''}>
                      Select a category
                    </option>
                    {Categories.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Address */}
                <div>
                  <label className={`${errors.address ? 'text-red-600' : ''}`}>
                    Address {errors.address && '*'}
                  </label>
                  <input
                    className="w-full border px-2 py-1 rounded"
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setIsDirty(true);
                      clearFieldError('address');
                    }}
                    onClick={() => clearFieldError('address')}
                  />
                </div>
                
                {/* Date */}
                <div>
                  <label className={`${errors.selectedDate ? 'text-red-600' : ''}`}>
                    Date {errors.selectedDate && '*'}
                  </label>
                  <input
                    className="w-full border px-2 py-1 rounded"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setIsDirty(true);
                      clearFieldError('selectedDate');
                    }}
                    onClick={() => clearFieldError('selectedDate')}
                  />
                </div>
                
                {/* Thumbnail with Remove Button */}
                <div>
                  <label>Thumbnail</label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={thumbnailInputRef}
                      className="w-full border px-2 py-1 rounded"
                      type="file"
                      name="thumbnail"
                      onChange={handleCustomThumbnailChange}
                    />
                    {hasThumbnail && !removeThumbnail ? (
                      <button
                        type="button"
                        onClick={handleRemoveThumbnail}
                        className="p-1 border rounded bg-red-50 hover:bg-red-100 text-red-600"
                        title="Remove thumbnail"
                      >
                        <XIcon size={16} />
                      </button>
                    ) : null}
                  </div>
                  
                  {isEditing && thumbnail && typeof thumbnail === 'string' && !removeThumbnail && (
                    <div className="mt-1 text-sm text-gray-600">
                      Current image: {thumbnail}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tiptap Rich Text Editor */}
              <div className="space-y-2">
                <label className={`font-bold ${errors.description ? 'text-red-600' : ''}`}>
                  Body {errors.description && '*'}
                </label>
                
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-2 p-2 bg-[#d6c2ad] rounded border border-blue-400">
                  {/* Headings */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={(evt) => {
                          evt.preventDefault();
                          evt.stopPropagation();
                          editor?.chain().focus().toggleHeading({ level }).run();
                          setIsDirty(true);
                        }}
                        className={`text-sm px-2 py-1 border rounded-sm ${
                          editor?.isActive('heading', { level }) ? 'bg-white' : ''
                        }`}
                      >
                        H{level}
                      </button>
                    ))}
                  </div>
                  
                  <div className="border-l h-6 mx-2" />
                  
                  {/* Font Size */}
                  <div className="flex items-center gap-1">
                    <TypeIcon size={16} className="text-gray-600" />
                    <select
                      onChange={handleFontSizeChange}
                      className="px-1 py-1 border rounded text-sm"
                      defaultValue="16px"
                    >
                      {fontSizes.map((size) => (
                        <option key={size.value} value={size.value}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="border-l h-6 mx-2" />
                  
                  {/* Bold, Underline, Italic */}
                  <div className="flex gap-1 ml-2">
                    <button
                      type="button"
                      onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
                        editor?.chain().focus().toggleBold().run();
                        setIsDirty(true);
                      }}
                      className={`p-1 border rounded ${
                        editor?.isActive('bold') ? 'bg-white' : ''
                      }`}
                    >
                      <Bold size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
                        editor?.chain().focus().toggleUnderline().run();
                        setIsDirty(true);
                      }}
                      className={`p-1 border rounded ${
                        editor?.isActive('underline') ? 'bg-white' : ''
                      }`}
                    >
                      <UnderlineIcon size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
                        editor?.chain().focus().toggleItalic().run();
                        setIsDirty(true);
                      }}
                      className={`p-1 border rounded ${
                        editor?.isActive('italic') ? 'bg-white' : ''
                      }`}
                    >
                      <Italic size={16} />
                    </button>
                  </div>
                  
                  <div className="border-l h-6 mx-2" />
                  
                  {/* Alignment */}
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
                        editor?.chain().focus().setTextAlign('left').run();
                        setIsDirty(true);
                      }}
                      className={`p-1 border rounded ${
                        editor?.isActive({ textAlign: 'left' }) ? 'bg-white' : ''
                      }`}
                    >
                      <AlignLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
                        editor?.chain().focus().setTextAlign('center').run();
                        setIsDirty(true);
                      }}
                      className={`p-1 border rounded ${
                        editor?.isActive({ textAlign: 'center' }) ? 'bg-white' : ''
                      }`}
                    >
                      <AlignCenter size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
                        editor?.chain().focus().setTextAlign('right').run();
                        setIsDirty(true);
                      }}
                      className={`p-1 border rounded ${
                        editor?.isActive({ textAlign: 'right' }) ? 'bg-white' : ''
                      }`}
                    >
                      <AlignRight size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
                        editor?.chain().focus().setTextAlign('justify').run();
                        setIsDirty(true);
                      }}
                      className={`p-1 border rounded ${
                        editor?.isActive({ textAlign: 'justify' }) ? 'bg-white' : ''
                      }`}
                    >
                      <AlignJustify size={16} />
                    </button>
                  </div>
                  
                  <div className="border-l h-6 mx-2" />
                  
                  {/* Two Column / Insert Image */}
                  <div className="flex gap-1">
                    <button
  type="button"
  onClick={(evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    editor.chain().focus().insertContent({
      type: 'columnBlock',
      content: [
        { type: 'column', content: [{ type: 'paragraph' }] },
        { type: 'column', content: [{ type: 'paragraph' }] },
      ],
    }).run();
  }}
  className="p-1 border rounded"
  title="Insert Two Column Layout"
>
  <ColumnsIcon size={16} />
</button>

                    
                    <button
                      type="button"
                      onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
                        imageInputRef.current?.click();
                      }}
                      className="p-1 border rounded"
                      title="Insert Image"
                    >
                      <ImageIcon size={16} />
                    </button>
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
                
                {/* Editor area */}
                <div
                  className="border rounded p-4 min-h-[150px] max-h-[50vh] overflow-auto prose"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFieldError('description');
                  }}
                >
                  <EditorContent 
                    editor={editor} 
                    onFocus={() => {
                      editor?.on('update', () => {
                        setIsDirty(true);
                        clearFieldError('description');
                      });
                    }}
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={handleCancelClick}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button type="submit" className="mt-4">
                  {isEditing ? 'Save Changes' : 'Submit Article'}
                </Button>
              </div>
            </form>
          </div>
          
          {/* RIGHT SIDE - Article Preview */}
          <div className="bg-white w-1/2 p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold mb-4">Article Preview</h3>
            <div className="border border-gray-200 p-4 mb-4 rounded">
              <h1 className="text-center text-3xl font-bold">
                {title || 'Title of the News or Event'}
              </h1>
            </div>
            
            <div className="flex w-full justify-center mb-6">
              <div className="flex w-full items-center justify-center text-center text-base">
                <span className="w-1/4 h-24 border border-gray-300 flex flex-col items-center justify-center p-2">
                  <h4 className="text-lg font-medium">Date</h4>
                  <p
                    className={`text-sm ${
                      !selectedDate ? 'text-gray-500 italic' : ''
                    }`}
                  >
                    {selectedDate
                      ? new Date(selectedDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : '[month dd, yyyy]'}
                  </p>
                </span>
                <span className="w-1/4 h-24 border border-gray-300 flex flex-col items-center justify-center p-2">
                  <h4 className="text-lg font-medium">Author</h4>
                  <p className={`text-sm ${!author ? 'text-gray-500 italic' : ''}`}>
                    {author || '[Name of the Author]'}
                  </p>
                </span>
                <span className="w-1/4 h-24 border border-gray-300 flex flex-col items-center justify-center p-2">
                  <h4 className="text-lg font-medium">Address</h4>
                  <p className={`text-sm ${!address ? 'text-gray-500 italic' : ''}`}>
                    {address || '[Location]'}
                  </p>
                </span>
                <span className="w-1/4 h-24 border border-gray-300 flex flex-col items-center justify-center p-2">
                  <h4 className="text-lg font-medium">Category</h4>
                  <p className={`text-sm ${!category ? 'text-gray-500 italic' : ''}`}>
                    {category || '[placeholder]'}
                  </p>
                </span>
              </div>
            </div>
            
            <div className="border border-gray-200 p-4 rounded min-h-[300px]">
              {previewImage && !removeThumbnail ? (
                <div className="flex justify-center mb-4">
                  <img
                    src={previewImage}
                    alt="Article thumbnail"
                    className="max-h-64 object-contain"
                  />
                </div>
              ) : null}
              
              <div className="prose max-w-none">
                {editor?.getHTML() ? (
                  <div
                    className="editor-content-preview"
                    dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                  />
                ) : (
                  <p className="text-gray-400 italic">
                    Article content will appear here...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        visible={showCancelConfirm}
        title="Discard Changes?"
        message="You have unsaved changes. Discard them?"
        onConfirm={() => {
          resetForm();
          setShowCancelConfirm(false);
          setErrors({});
        }}
        onCancel={() => setShowCancelConfirm(false)}
      />

      {/* Submit Confirmation Dialog */}
      <ConfirmDialog
        visible={showSubmitConfirm}
        title={isEditing ? 'Save Changes?' : 'Submit Article?'}
        message="Are you sure you want to proceed?"
        onConfirm={() => {
          onSubmit({ preventDefault: () => {} }, removeThumbnail);
          setShowSubmitConfirm(false);
          setErrors({});
        }}
        onCancel={() => setShowSubmitConfirm(false)}
      />
    </>
  );
};

export default ArticleModal;
