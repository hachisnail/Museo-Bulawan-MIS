import React, { useState, useEffect } from 'react'
import AdminNav from '../../components/navbar/AdminNav'
import axios from "axios";
import CustomDatePicker from '../../components/function/CustomDatePicker'
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Button from "@/components/ui/button"

import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

const ArticleForm = () => {
  // Form state
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [category, setCategory] = useState("")
  const [address, setAddress] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [thumbnail, setThumbnail] = useState(null)
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Articles state
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  const Categories = ['Education', 'Exhibit', 'Contents', 'Other'];
  const token = localStorage.getItem('token');
  
  // Define path to your uploads folder - important for displaying images in the modal
  const BASE_URL = "http://localhost:5000";
  const UPLOAD_PATH = `${BASE_URL}/uploads/`;

  const editor = useEditor({
    extensions: [StarterKit],
    content: "", // Initial content
  });

  // Fetch articles on component mount
  useEffect(() => {
    fetchArticles();
  }, []);

  // Fetch articles from the server
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/auth/articles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      
      setArticles(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Failed to load articles. Check that the API server is running.");
      setLoading(false);
    }
  };

  // Handle form submission for new or edited articles
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("article_category", category);
    formData.append("description", editor?.getHTML() || "");
    formData.append("user_id", 1);
    formData.append("author", author);
    formData.append("address", address);
    formData.append("selectedDate", selectedDate);
  
    // Only append thumbnail if it's a File object (not a string from existing image)
    if (thumbnail && thumbnail instanceof File) {
      formData.append("thumbnail", thumbnail);
    }
  
    try {
      let response;
      
      if (isEditing) {
        
        response = await axios.put(
          `${BASE_URL}/api/auth/article/${editingArticleId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log("Article updated successfully!", response.data);
      } else {
        // Create new article
        response = await axios.post(
          `${BASE_URL}/api/auth/article`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log("Article created successfully!", response.data);
      }
      
      // Reset form and state
      resetForm();
      
      // Refresh articles list
      fetchArticles();
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} article:`, error.response?.data || error.message);
    }
  };

  // Reset form fields and editing state
  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setCategory("");
    setAddress("");
    setSelectedDate("");
    setThumbnail(null);
    setPreviewImage(null);
    editor?.commands.setContent("");
    setShowModal(false);
    setIsEditing(false);
    setEditingArticleId(null);
  };

  // Handle row click to edit article
  const handleRowClick = (article) => {
    setIsEditing(true);
    setEditingArticleId(article.article_id);
    
    // Set form values from article data
    setTitle(article.title || "");
    setAuthor(article.author || "");
    setCategory(article.article_category || "");
    setAddress(article.address || "");
    
    // Format date for the input field (YYYY-MM-DD)
    if (article.upload_date) {
      const date = new Date(article.upload_date);
      const formattedDate = date.toISOString().split('T')[0];
      setSelectedDate(formattedDate);
    } else {
      setSelectedDate("");
    }
    
    // Set content in the editor
    if (editor && article.description) {
      editor.commands.setContent(article.description);
    }
    
    // Handle thumbnail preview for editing
    if (article.images) {
      // If the image exists, we need to construct a URL to it
      const imageUrl = `${UPLOAD_PATH}${article.images}`;
      setPreviewImage(imageUrl);
      
      // Store just the filename as a string (not a File object)      setThumbnail(article.images);
    } else {
      setPreviewImage(null);
      setThumbnail(null);
    }
    
    // Show the modal with populated data
    setShowModal(true);
  };

  // Handle file input change
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Filter articles based on search term
  const filteredArticles = articles.filter(article => {
    // Filter by search term
    const searchMatch = !searchTerm || 
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.article_category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return searchMatch;
  });

  // Calculate counts
  const postedCount = articles.filter(article => article.status === 'posted').length;
  const pendingCount = articles.filter(article => article.status === 'pending').length;
  const totalCount = articles.length;
  
  return (
    <>
      <div className='w-screen min-h-[79.8rem] h-screen bg-[#F0F0F0] select-none flex pt-[7rem]'>
        <div className='bg-[#1C1B19] w-auto min-h-full h-full min-w-[6rem] sm:min-w-auto'>
          <AdminNav />
        </div>
        <div className='w-full min-h-full h-full flex flex-col gap-y-10 px-7 pb-7 pt-[4rem] overflow-scroll'>
          <span className='text-5xl font-semibold'>Article Management</span>
          <div className='w-full h-full flex flex-col xl:flex-row gap-y-5 xl:gap-y-0 xl:gap-x-5 '>
            <div className='min-w-[34rem] h-full flex flex-col gap-y-7'>
              {/* info bar */}
              <div className='w-full max-w-[35rem] text-gray-500 min-h-[5rem] flex justify-start py-2 gap-x-2'>
                <button className='px-4 h-full border-1 border-gray-500 rounded-lg cursor-pointer'>
                  <span className='text-2xl font-semibold'>Artifact</span>
                </button>
              </div>

              <div className='w-full h-full flex flex-col gap-y-[5rem]'>
                <div className='bg-[#161616] px-4 h-[5rem] flex justify-between items-center rounded-sm'>
                  <span className='text-2xl text-white font-semibold'>Articles</span>
                  <div className='w-[6rem] h-[3rem] bg-[#D4DBFF] flex items-center justify-center rounded-md'>
                    <span className='text-2xl text-black font-semibold'>{totalCount || 0}</span>
                  </div>
                </div>

                <div className='w-full h-auto flex flex-col gap-y-7'>
                  {/* Date */}
                  <span className='text-2xl font-semibold text-[#727272]'>
                    {new Date().toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
                  </span>
                  <div className='w-full h-fit flex justify-between items-center'>
                    <span className='text-2xl font-semibold'>Posted</span>
                    <div className='w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center'>
                      <span className='text-2xl font-semibold'>{postedCount || 0}</span>
                    </div>
                  </div>

                  <div className='w-full h-fit flex justify-between items-center'>
                    <span className='text-2xl font-semibold'>Pending</span>
                    <div className='w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center'>
                      <span className='text-2xl font-semibold'>{pendingCount || 0}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      resetForm();
                      setShowModal(true);
                    }}
                    className="cursor-pointer flex items-center justify-between w-full px-6 py-4 bg-[#6BFFD5] text-black font-medium"
                  >
                    <span className='text-2xl font-semibold'>Add New Article</span>
                    <span className="border-2 border-black rounded-full p-2 flex items-center justify-center">
                      <i className="fas fa-plus text-xl"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className='w-full h-full flex flex-col gap-y-7 overflow-x-scroll overflow-y-scroll'>
              {/* table */}
              <div className='min-w-[94rem] min-h-[5rem] py-2 flex items-center gap-x-2'>
                {/* Date Filter */}
                <div className='flex-shrink-0'>
                  <CustomDatePicker
                    selected={filterDate}
                    onChange={(date) => setFilterDate(date)}
                    popperPlacement="bottom-start"
                    popperClassName="z-50"
                    customInput={
                      <button className='px-3 h-16 rounded-lg border-1 border-gray-500 cursor-pointer'>
                        <i className="text-gray-500 fa-regular fa-calendar text-4xl"></i>
                      </button>
                    }
                  />
                </div>

                {/* Search Box */}
                <div className="relative h-full min-w-[20rem]">
                  <i className="text-2xl fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"></i>
                  <input
                    type="text"
                    placeholder="Search Articles"
                    className="h-full pl-10 pr-3 py-2 border-1 border-gray-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filter by Category */}
                <div className="relative h-full min-w-48">
                  <select 
                    className="appearance-none border-1 border-gray-500 h-full text-2xl rounded-lg text-gray-500 w-full py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {Categories.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <i className="text-2xl fas fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"></i>
                </div>

                {/* Filter by Status */}
                <div className="relative h-full min-w-48">
                  <select className="appearance-none border-1 border-gray-500 h-full text-2xl rounded-lg text-gray-500 w-full py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Status</option>
                    <option value="posted">Posted</option>
                    <option value="pending">Pending</option>
                  </select>
                  <i className="text-2xl fas fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"></i>
                </div>
              </div>

              {/* Article Table Header */}
              <div className='min-w-[94rem] w-full font-semibold h-fit grid grid-cols-5 justify-between'>
                <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>
                  Date
                </div>
                <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>
                  Title
                </div>
                <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>
                  Author
                </div>
                <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>
                  Category
                </div>
                <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>
                  Status
                </div>
              </div>

              {/* Article Table Data */}
              <div className='w-full min-w-[94rem] h-auto flex flex-col border-t-1 border-t-gray-400'>
                {loading ? (
                  <div className="col-span-5 py-8 text-center text-2xl text-gray-500">
                    Loading articles...
                  </div>
                ) : error ? (
                  <div className="col-span-5 py-8 text-center text-2xl text-red-500">
                    {error}
                    <div className="mt-4">
                      <button 
                        onClick={fetchArticles}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <div
                      key={article.article_id}
                      className='min-w-[94rem] text-xl h-fit font-semibold grid grid-cols-5 hover:bg-gray-300 cursor-pointer'
                      onClick={() => handleRowClick(article)}
                    >
                      <div className='px-4 pt-1 pb-3 border-b-1 border-gray-400'>
                        {article.upload_date ? new Date(article.upload_date).toLocaleDateString() : new Date(article.created_at).toLocaleDateString()}
                      </div>
                      <div className='px-4 pt-1 pb-3 border-b-1 border-gray-400 truncate'>
                        {article.title}
                      </div>
                      <div className='px-4 pt-1 pb-3 border-b-1 border-gray-400'>
                        {article.author || 'Unknown'}
                      </div>
                      <div className='px-4 pt-1 pb-3 border-b-1 border-gray-400'>
                        {article.article_category}
                      </div>
                      <div className='px-4 py-1 border-b-1 border-gray-400'>
                        <span className={`text-white rounded-md px-4 py-1 ${
                          article.status === 'posted' ? 'bg-[#4CAF50]' : 'bg-[#5C4624]'
                        }`}>
                          {article.status === 'posted' ? 'Posted' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-5 py-8 text-center text-2xl text-gray-500">
                    No articles found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Article Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
            <div className="flex w-[85rem] gap-4">
              {/* Left Side - Article Editor Form */}
              <div className="bg-white w-[40rem] p-6 rounded-lg shadow-xl relative">
                <button
                  onClick={resetForm}
                  className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-black"
                >
                  &times;
                </button>
                    
                <h2 className="text-3xl font-bold mb-6">
                  {isEditing ? 'Edit Article' : 'Add New Article'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label>Title</label>
                      <input
                        className="w-full border px-2 py-1 rounded"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Author</label>
                      <input
                        className="w-full border px-2 py-1 rounded"
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Category</label>
                      <select
                        className="w-full border px-2 py-1 rounded"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="" disabled={category !== ""}>
                          Select a category
                        </option>
                        {Categories.map((cat, index) => (
                          <option key={index} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Address</label>
                      <input
                        className="w-full border px-2 py-1 rounded"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Date</label>
                      <input
                        className="w-full border px-2 py-1 rounded"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Thumbnail</label>
                      <input
                        className="w-full border px-2 py-1 rounded"
                        type="file"
                        name="thumbnail"
                        onChange={handleThumbnailChange}
                      />
                      
                      {/* Display current thumbnail name if editing */}
                      {isEditing && thumbnail && typeof thumbnail === 'string' && (
                        <div className="mt-1 text-sm text-gray-600">
                          Current image: {thumbnail}
                        </div>
                      )}
                      
                      
                    </div>
                  </div>

                  {/* Tiptap Rich Text Editor */}
                  <div className="space-y-2">
                    <label className="font-bold">Body</label>
                    <div className="flex items-center gap-2 p-2 bg-[#d6c2ad] rounded border border-blue-400">
                      {/* Heading buttons */}
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
                              className="text-sm px-1 hover:underline"
                            >
                              H{level}
                            </button>
                          ))}
                        </div>

                        {/* Font size input */}
                        <input
                          type="number"
                          min="10"
                          max="72"
                          onChange={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            editor?.chain().focus().setFontSize(`${e.target.value}px`).run();
                          }}
                          defaultValue={20}
                          className="w-12 text-center text-sm px-1 py-0.5 rounded border border-gray-300 bg-white"
                          style={{
                            appearance: "textfield",
                            MozAppearance: "textfield",
                            WebkitAppearance: "none",
                          }}
                        />

                      {/* Divider */}
                      <div className="border-l h-6 mx-2" />
                      
                      {/* Formatting buttons */}
                      <div className="flex gap-1 ml-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            editor?.chain().focus().toggleBold().run();
                          }}
                          className={`p-1 border rounded ${editor?.isActive("bold") ? "bg-white" : ""}`}
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
                          className={`p-1 border rounded ${editor?.isActive("underline") ? "bg-white" : ""}`}
                        >
                          <Underline size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            editor?.chain().focus().toggleItalic().run();
                          }}
                          className={`p-1 border rounded ${editor?.isActive("italic") ? "bg-white" : ""}`}
                        >
                          <Italic size={16} />
                        </button>
                      </div>
                      
                      {/* Divider */}
                      <div className="border-l h-6 mx-2" />
                      
                      {/* Text alignment buttons */}
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            editor?.chain().focus().setTextAlign("left").run();
                          }}
                          className={`p-1 border rounded ${editor?.isActive({ textAlign: "left" }) ? "bg-white" : ""}`}
                        >
                          <AlignLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            editor?.chain().focus().setTextAlign("center").run();
                          }}
                          className={`p-1 border rounded ${editor?.isActive({ textAlign: "center" }) ? "bg-white" : ""}`}
                        >
                          <AlignCenter size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            editor?.chain().focus().setTextAlign("right").run();
                          }}
                          className={`p-1 border rounded ${editor?.isActive({ textAlign: "right" }) ? "bg-white" : ""}`}
                        >
                          <AlignRight size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            editor?.chain().focus().setTextAlign("justify").run();
                          }}
                          className={`p-1 border rounded ${editor?.isActive({ textAlign: "justify" }) ? "bg-white" : ""}`}
                        >
                          <AlignJustify size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Editor body */}
                    <div className="border rounded p-4 min-h-[150px]" onClick={(e) => e.stopPropagation()}>
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
              
              {/* Right Side - Article Preview */}
              <div className="bg-white w-[40rem] p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
                <h3 className="text-2xl font-bold mb-4">Article Preview</h3>
                
                {/* Title Section */}
                <div className='border border-gray-200 p-4 mb-4 rounded'>
                  <h1 className='text-center text-3xl font-bold'>{title || "Title of the News or Event"}</h1>
                </div>
                
                {/* Info Section */}
                <div className="flex w-full justify-center mb-6">
                  <div className="flex w-full items-center justify-center text-center text-base">
                    <span className="w-1/4 h-24 border border-gray-300 flex flex-col items-center justify-center p-2">
                      <h4 className='text-lg font-medium'>Date</h4>
                      <p className="text-sm">{selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'}) : "month dd, yyyy"}</p>
                    </span>
                    <span className="w-1/4 h-24 border border-gray-300 flex flex-col items-center justify-center p-2">
                      <h4 className='text-lg font-medium'>Author</h4>
                      <p className="text-sm">{author || "Name of the Author"}</p>
                    </span>
                    <span className="w-1/4 h-24 border border-gray-300 flex flex-col items-center justify-center p-2">
                      <h4 className='text-lg font-medium'>Address</h4>
                      <p className="text-sm">{address || "Location of the event or news"}</p>
                    </span>
                    <span className="w-1/4 h-24 border border-gray-300 flex flex-col items-center justify-center p-2">
                      <h4 className='text-lg font-medium'>Category</h4>
                      <p className="text-sm">{category || "[placeholder]"}</p>
                    </span>
                  </div>
                </div>
                
                {/* Article Content Preview */}
                <div className="border border-gray-200 p-4 rounded min-h-[300px]">
                  {/* Thumbnail Preview */}
                  {previewImage && (
                    <div className="flex justify-center mb-4">
                      <img 
                        src={previewImage}
                        alt="Article thumbnail" 
                        className="max-h-64 object-contain"
                      />
                    </div>
                  )}
                  
                  <div className="prose max-w-none">
                    {editor?.getHTML() ? (
                      <div dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />
                    ) : (
                      <p className="text-gray-400 italic">Article content will appear here...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ArticleForm
