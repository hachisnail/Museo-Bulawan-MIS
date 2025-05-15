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

  // State for removing or replacing the current thumbnail
  const [removeThumbnail, setRemoveThumbnail] = useState(false);
  // Track if a thumbnail is present
  const [hasThumbnail, setHasThumbnail] = useState(!!thumbnail || !!previewImage);

  // For form validation and error display
  const [errors, setErrors] = useState({});

  // Confirmation states (whether to show them or not)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Update hasThumbnail if thumbnail changes
  useEffect(() => {
    setHasThumbnail(!!thumbnail || !!previewImage);
  }, [thumbnail, previewImage]);

  // Font sizes for editor
  const fontSizes = [
    { label: 'Small', value: '12px' },
    { label: 'Normal', value: '16px' },
    { label: 'Medium', value: '20px' },
    { label: 'Large', value: '24px' },
    { label: 'XL', value: '28px' },
    { label: '2XL', value: '32px' }
  ];

  // Handle inline image upload in editor
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

        // Insert into Tiptap editor
        if (editor) {
          editor
            .chain()
            .focus()
            .setImage({ src: fullImageUrl, alt: file.name })
            .run();
        }

        // Optionally update contentImages state
        setContentImages((prev) => [...prev, uploadedFilename]);
      }
    } catch (err) {
      console.error('Error uploading content image:', err);
      alert('Failed to upload image');
    }
  };

  // Font size selection
  const handleFontSizeChange = (e) => {
    const fontSize = e.target.value;
    editor?.chain().focus().setMark('textStyle', { fontSize }).run();
  };

  // Remove the chosen thumbnail
  const handleRemoveThumbnail = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
    setRemoveThumbnail(true);
    setHasThumbnail(false);
  };

  // Wrap the original thumbnail change
  const handleCustomThumbnailChange = (e) => {
    if (removeThumbnail) {
      setRemoveThumbnail(false);
    }
    handleThumbnailChange(e);
    setHasThumbnail(!!e.target.files && e.target.files.length > 0);
  };

  // Validate required fields
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!author.trim()) {
      newErrors.author = 'Author is required';
    }
    if (!category.trim()) {
      newErrors.category = 'Category is required';
    }
    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!selectedDate.trim()) {
      newErrors.selectedDate = 'Date is required';
    }
    // Check editor content
    const editorContent = editor?.getHTML().replace(/<[^>]+>/g, '').trim() || '';
    if (!editorContent) {
      newErrors.description = 'Body content is required';
    }
    return newErrors;
  };

  // Click "Cancel" => check if there's content; if so, confirm
  const handleCancelClick = () => {
    const newErrors = validateForm();
    const userTypedSomething =
      title || author || category || address || selectedDate || editor?.getHTML();

    if (userTypedSomething?.trim()) {
      setShowCancelConfirm(true);
    } else {
      resetForm();
    }
  };

  // Handle actual form submit:
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Clean up errors and show the confirm modal
      setErrors({});
      setShowSubmitConfirm(true);
    }
  };

  // Called once user confirms submission
  const confirmSubmit = () => {
    // Perform the actual onSubmit function
    onSubmit({ preventDefault: () => {} }, removeThumbnail);
    setShowSubmitConfirm(false);
  };

  // If modal is not shown, return nothing
  if (!showModal) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
        <div className="flex w-[85rem] gap-4">
          {/* LEFT SIDE - Editor + Form */}
          <div className="bg-white w-[40rem] p-6 rounded-lg shadow-xl relative max-h-[90vh] overflow-auto">
            {/* Cancel (X) in top-right corner */}
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
                  <label
                    className={`block mb-1 font-semibold ${
                      errors.title ? 'text-red-600' : ''
                    }`}
                  >
                    Title {errors.title && '*'}
                  </label>
                  <input
                    className={`w-full border px-2 py-1 rounded ${
                      errors.title ? 'border-red-600' : ''
                    }`}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Author */}
                <div>
                  <label
                    className={`block mb-1 font-semibold ${
                      errors.author ? 'text-red-600' : ''
                    }`}
                  >
                    Author {errors.author && '*'}
                  </label>
                  <input
                    className={`w-full border px-2 py-1 rounded ${
                      errors.author ? 'border-red-600' : ''
                    }`}
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                  {errors.author && (
                    <p className="text-red-600 text-sm mt-1">{errors.author}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label
                    className={`block mb-1 font-semibold ${
                      errors.category ? 'text-red-600' : ''
                    }`}
                  >
                    Category {errors.category && '*'}
                  </label>
                  <select
                    className={`w-full border px-2 py-1 rounded ${
                      errors.category ? 'border-red-600' : ''
                    }`}
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
                  {errors.category && (
                    <p className="text-red-600 text-sm mt-1">{errors.category}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label
                    className={`block mb-1 font-semibold ${
                      errors.address ? 'text-red-600' : ''
                    }`}
                  >
                    Address {errors.address && '*'}
                  </label>
                  <input
                    className={`w-full border px-2 py-1 rounded ${
                      errors.address ? 'border-red-600' : ''
                    }`}
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  {errors.address && (
                    <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label
                    className={`block mb-1 font-semibold ${
                      errors.selectedDate ? 'text-red-600' : ''
                    }`}
                  >
                    Date {errors.selectedDate && '*'}
                  </label>
                  <input
                    className={`w-full border px-2 py-1 rounded ${
                      errors.selectedDate ? 'border-red-600' : ''
                    }`}
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                  {errors.selectedDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.selectedDate}</p>
                  )}
                </div>

                {/* Thumbnail with a remove button */}
                <div>
                  <label className="block mb-1 font-semibold">Thumbnail</label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={thumbnailInputRef}
                      className="w-full border px-2 py-1 rounded"
                      type="file"
                      name="thumbnail"
                      onChange={handleCustomThumbnailChange}
                    />
                    {hasThumbnail && !removeThumbnail && (
                      <button
                        type="button"
                        onClick={handleRemoveThumbnail}
                        className="p-1 border rounded bg-red-50 hover:bg-red-100 text-red-600"
                        title="Remove thumbnail"
                      >
                        <XIcon size={16} />
                      </button>
                    )}
                  </div>
                  {isEditing && thumbnail && typeof thumbnail === 'string' && !removeThumbnail && (
                    <div className="mt-1 text-sm text-gray-600">
                      Current image: {thumbnail}
                    </div>
                  )}
                </div>
              </div>

              {/* Body / Tiptap Editor */}
              <div className="space-y-2">
                <label
                  className={`font-bold ${
                    errors.description ? 'text-red-600' : ''
                  }`}
                >
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
                      onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
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
                      onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
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
                      onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
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
                      onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
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
                      onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
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
                      onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
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
                      onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
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
                      onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
                        editor?.chain().focus().insertTwoColumnBlock().run();
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

                {/* Editor content */}
                <div
                  className={`border rounded p-4 min-h-[150px] max-h-[50vh] overflow-auto prose ${
                    errors.description ? 'border-red-600' : ''
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <EditorContent editor={editor} />
                </div>
                {errors.description && (
                  <p className="text-red-600 text-sm">{errors.description}</p>
                )}
              </div>

              {/* Form buttons */}
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
      </div>

      {/* Cancel Confirmation */}
      <ConfirmDialog
        visible={showCancelConfirm}
        title="Discard Changes?"
        message="You have unsaved changes. Discard them?"
        onConfirm={() => {
          resetForm();
          setShowCancelConfirm(false);
        }}
        onCancel={() => setShowCancelConfirm(false)}
      />

      {/* Submit Confirmation */}
      <ConfirmDialog
        visible={showSubmitConfirm}
        title={isEditing ? 'Save Changes?' : 'Submit Article?'}
        message="Are you sure you want to proceed?"
        onConfirm={confirmSubmit}
        onCancel={() => setShowSubmitConfirm(false)}
      />
    </>
  );
};

export default ArticleModal;
