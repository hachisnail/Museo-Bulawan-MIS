// Updated ArticleModal.jsx
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
  setContentImages
}) => {
  const imageInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  
  // State to track if thumbnail should be removed
  const [removeThumbnail, setRemoveThumbnail] = useState(false);
  // State to track if a thumbnail is selected
  const [hasThumbnail, setHasThumbnail] = useState(!!thumbnail || !!previewImage);

  // Update hasThumbnail when thumbnail or previewImage changes
  useEffect(() => {
    setHasThumbnail(!!thumbnail || !!previewImage);
  }, [thumbnail, previewImage]);

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

        // Optional: store the filename if needed
        setContentImages((prev) => [...prev, uploadedFilename]);
      }
    } catch (err) {
      console.error('Error uploading content image:', err);
      alert('Failed to upload image');
    }
  };

  // Apply selected font size to the editor
  const handleFontSizeChange = (e) => {
    const fontSize = e.target.value;
    editor?.chain().focus().setFontSize(fontSize).run();
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
  };

  // Modified form submission to include thumbnail removal state
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Add removeThumbnail to the form submission data
    onSubmit(e, removeThumbnail);
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
      <div className="flex w-[85rem] gap-4">
        {/* LEFT SIDE - Editor + Form */}
        <div className="bg-white w-[40rem] p-6 rounded-lg shadow-xl relative max-h-[90vh] overflow-auto">
          <button
            onClick={resetForm}
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
                <label>Title</label>
                <input
                  className="w-full border px-2 py-1 rounded"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              {/* Author */}
              <div>
                <label>Author</label>
                <input
                  className="w-full border px-2 py-1 rounded"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              
              {/* Category */}
              <div>
                <label>Category</label>
                <select
                  className="w-full border px-2 py-1 rounded"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                <label>Address</label>
                <input
                  className="w-full border px-2 py-1 rounded"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              
              {/* Date */}
              <div>
                <label>Date</label>
                <input
                  className="w-full border px-2 py-1 rounded"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
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
              <label className="font-bold">Body</label>
              
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-2 p-2 bg-[#d6c2ad] rounded border border-blue-400">
                {/* Headings */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        editor?.chain().focus().toggleHeading({ level }).run();
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
                
                {/* Font Size Selector */}
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      editor?.chain().focus().toggleBold().run();
                    }}
                    className={`p-1 border rounded ${
                      editor?.isActive('bold') ? 'bg-white' : ''
                    }`}
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      editor?.chain().focus().toggleUnderline().run();
                    }}
                    className={`p-1 border rounded ${
                      editor?.isActive('underline') ? 'bg-white' : ''
                    }`}
                  >
                    <UnderlineIcon size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      editor?.chain().focus().toggleItalic().run();
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      editor?.chain().focus().setTextAlign('left').run();
                    }}
                    className={`p-1 border rounded ${
                      editor?.isActive({ textAlign: 'left' }) ? 'bg-white' : ''
                    }`}
                  >
                    <AlignLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      editor?.chain().focus().setTextAlign('center').run();
                    }}
                    className={`p-1 border rounded ${
                      editor?.isActive({ textAlign: 'center' }) ? 'bg-white' : ''
                    }`}
                  >
                    <AlignCenter size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      editor?.chain().focus().setTextAlign('right').run();
                    }}
                    className={`p-1 border rounded ${
                      editor?.isActive({ textAlign: 'right' }) ? 'bg-white' : ''
                    }`}
                  >
                    <AlignRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      editor?.chain().focus().setTextAlign('justify').run();
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      editor?.chain().focus().insertTwoColumnBlock().run();
                    }}
                    className="p-1 border rounded"
                    title="Insert Two Column Layout"
                  >
                    <ColumnsIcon size={16} />
                  </button>
                  
                  {/* Image Upload Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
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
              
              {/* Editor area - scroll internally */}
              <div
                className="border rounded p-4 min-h-[150px] max-h-[50vh] overflow-auto prose"
                onClick={(e) => e.stopPropagation()}
              >
                <EditorContent editor={editor} />
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                type="button"
                onClick={resetForm}
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
        <div className="bg-white w-[40rem] p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
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
                <p className="text-sm">
                  {selectedDate
                    ? new Date(selectedDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'month dd, yyyy'}
                </p>
              </span>
              <span className="w-1/4 h-24 border border-gray-300 flex flex-col items-center justify-center p-2">
                <h4 className="text-lg font-medium">Author</h4>
                <p className="text-sm">{author || 'Name of the Author'}</p>
              </span>
              <span className="w-1/4 h-24 border border-gray-300 flex flex-col items-center justify-center p-2">
                <h4 className="text-lg font-medium">Address</h4>
                <p className="text-sm">{address || 'Location'}</p>
              </span>
              <span className="w-1/4 h-24 border border-gray-300 flex flex-col items-center justify-center p-2">
                <h4 className="text-lg font-medium">Category</h4>
                <p className="text-sm">{category || '[placeholder]'}</p>
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
    </div>
  );
};

export default ArticleModal;
