import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/navbar/AdminNav';
import axios from 'axios';
import CustomDatePicker from '../../components/function/CustomDatePicker';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import ArticleModal from '../../components/modals/ArticleModal'; 
import { TwoColumnBlock } from '../../components/articleComponents/TwoColumnBlock';
import { ColumnLeft } from '../../components/articleComponents/ColumnLeft';
import { ColumnRight } from '../../components/articleComponents/ColumnRight';
import Image from '@tiptap/extension-image';

const ArticleForm = () => {
  // Form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Track images used in article body (Tiptap)
  const [contentImages, setContentImages] = useState([]);

  // Articles state
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  const Categories = ['Education', 'Exhibit', 'Contents', 'Other'];
  const token = localStorage.getItem('token');
  
  const BASE_URL = import.meta.env.VITE_API_URL;
  const UPLOAD_PATH = `${BASE_URL}/uploads/`;

  // Set up Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      ColumnLeft,
      ColumnRight,
      TwoColumnBlock,
      Image,
    ],
    content: "", 
    onUpdate: ({ editor }) => {
      // You can track or log editor content changes here if needed
      // console.log(editor.getHTML());
    },
  });

  // Fetch articles on mount
  useEffect(() => {
    fetchArticles();
  }, []);

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

  // Create or edit article
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
    formData.append("content_images", JSON.stringify(contentImages));

    // Add thumbnail if it's a File
    if (thumbnail && thumbnail instanceof File) {
      formData.append("thumbnail", thumbnail);
    }
  
    try {
      let response;
      if (isEditing) {
        // Update existing article
        response = await axios.put(
          `${BASE_URL}/api/auth/article/${editingArticleId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
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
            },
            withCredentials: true,
          }
        );
        console.log("Article created successfully!", response.data);
      }
      
      resetForm();
      fetchArticles();
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} article:`, err.response?.data || err.message);
    }
  };

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setCategory("");
    setAddress("");
    setSelectedDate("");
    setThumbnail(null);
    setPreviewImage(null);
    setContentImages([]);
    editor?.commands.setContent("");
    setShowModal(false);
    setIsEditing(false);
    setEditingArticleId(null);
  };

  // Handle clicking on a table row to edit an article
  const handleRowClick = (article) => {
    setIsEditing(true);
    setEditingArticleId(article.article_id);
    
    setTitle(article.title || "");
    setAuthor(article.author || "");
    setCategory(article.article_category || "");
    setAddress(article.address || "");
    
    if (article.upload_date) {
      const date = new Date(article.upload_date);
      const formattedDate = date.toISOString().split('T')[0];
      setSelectedDate(formattedDate);
    } else {
      setSelectedDate("");
    }

    if (editor && article.description) {
      editor.commands.setContent(article.description);
    }

    // Thumbnail
    if (article.images) {
      const imageUrl = `${UPLOAD_PATH}${article.images}`;
      setPreviewImage(imageUrl);
      setThumbnail(article.images);
    } else {
      setPreviewImage(null);
      setThumbnail(null);
    }

    // Parse stored content images if available
    if (article.content_images) {
      try {
        const parsedImages = JSON.parse(article.content_images);
        if (Array.isArray(parsedImages)) {
          setContentImages(parsedImages);
        } else {
          setContentImages([]);
        }
      } catch {
        setContentImages([]);
      }
    } else {
      setContentImages([]);
    }

    setShowModal(true);
  };

  // Handle uploading new thumbnail
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const filteredArticles = articles.filter(article => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (article.title?.toLowerCase().includes(term)) ||
      (article.author?.toLowerCase().includes(term)) ||
      (article.article_category?.toLowerCase().includes(term))
    );
  });

  const postedCount = articles.filter(article => article.status === 'posted').length;
  const pendingCount = articles.filter(article => article.status === 'pending').length;
  const totalCount = articles.length;
  
  return (
    <>
      <div className='w-screen min-h-[79.8rem] h-screen bg-[#F0F0F0] select-none flex pt-[7rem]'>
        {/* Left Nav */}
        <div className='bg-[#1C1B19] w-auto min-h-full'>
          <AdminNav />
        </div>

        {/* Main content */}
        <div className='w-full h-full flex flex-col gap-y-10 px-7 pb-7 pt-[4rem] overflow-scroll'>
          <span className='text-5xl font-semibold'>Article Management</span>
          <div className='w-full h-full flex flex-col xl:flex-row gap-y-5 xl:gap-x-5 '>
            
            {/* Left Side: Stats, Add Button */}
            <div className='min-w-[34rem] h-full flex flex-col gap-y-7'>
              {/* Info bar */}
              <div className='w-full max-w-[35rem] text-gray-500 min-h-[5rem] flex py-2 gap-x-2'>
                <button className='px-4 h-full border-1 border-black text-white bg-black rounded-lg'>
                  <span className='text-2xl font-semibold'>Articles</span>
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
                  <span className='text-2xl font-semibold text-[#727272]'>
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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

            {/* Right Side: Table */}
            <div className='w-full h-full flex flex-col gap-y-7 overflow-x-auto overflow-y-auto'>
              {/* Filters */}
              <div className='min-w-[94rem] py-2 flex items-center gap-x-2'>
                {/* Date filter */}
                <div className='flex-shrink-0'>
                  <CustomDatePicker
                    selected={filterDate}
                    onChange={(date) => setFilterDate(date)}
                    popperPlacement="bottom-start"
                    popperClassName="z-50"
                    customInput={
                      <button className='px-3 h-16 rounded-lg border-1 border-gray-500'>
                        <i className="text-gray-500 fa-regular fa-calendar text-4xl"></i>
                      </button>
                    }
                  />
                </div>

                {/* Search box */}
                <div className="relative h-full min-w-[20rem]">
                  <i className="text-2xl fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                  <input
                    type="text"
                    placeholder="Search Articles"
                    className="h-full pl-10 pr-3 py-2 border-1 border-gray-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filter by category */}
                <div className="relative h-full min-w-48">
                  <select className="appearance-none border-1 border-gray-500 h-full text-2xl rounded-lg text-gray-500 w-full py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Categories</option>
                    {Categories.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <i className="text-2xl fas fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"></i>
                </div>

                {/* Filter by status */}
                <div className="relative h-full min-w-48">
                  <select className="appearance-none border-1 border-gray-500 h-full text-2xl rounded-lg text-gray-500 w-full py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Status</option>
                    <option value="posted">Posted</option>
                    <option value="pending">Pending</option>
                  </select>
                  <i className="text-2xl fas fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"></i>
                </div>
              </div>

              {/* Table header */}
              <div className='min-w-[94rem] grid grid-cols-5 font-semibold'>
                <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Date</div>
                <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Title</div>
                <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Author</div>
                <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Category</div>
                <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Status</div>
              </div>

              {/* Table rows */}
              <div className='w-full min-w-[94rem] flex flex-col border-t-1 border-t-gray-400'>
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
                      className='min-w-[94rem] text-xl grid grid-cols-5 border-b-1 border-gray-400 hover:bg-gray-300 cursor-pointer'
                      onClick={() => handleRowClick(article)}
                    >
                      <div className='px-4 pt-1 pb-3'>
                        {article.upload_date
                          ? new Date(article.upload_date).toLocaleDateString()
                          : new Date(article.created_at).toLocaleDateString()}
                      </div>
                      <div className='px-4 pt-1 pb-3 truncate'>
                        {article.title}
                      </div>
                      <div className='px-4 pt-1 pb-3'>
                        {article.author || 'Unknown'}
                      </div>
                      <div className='px-4 pt-1 pb-3'>
                        {article.article_category}
                      </div>
                      <div className='px-4 py-1'>
                        <span
                          className={`text-white rounded-md px-4 py-1 ${
                            article.status === 'posted' ? 'bg-[#4CAF50]' : 'bg-[#5C4624]'
                          }`}
                        >
                          {article.status === 'posted' ? 'Posted' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="min-w-[94rem] py-16 flex justify-center items-center">
                    <div className="text-2xl text-gray-500 flex flex-col items-center">
                      <i className="fas fa-inbox text-5xl mb-4"></i>
                      <p>No article found</p>
                      <p className="text-lg mt-2">
                        Try adjusting your filters or search criteria
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal for adding/editing articles */}
        <ArticleModal
          showModal={showModal}
          onClose={resetForm}
          isEditing={isEditing}
          editor={editor}
          title={title}
          setTitle={setTitle}
          author={author}
          setAuthor={setAuthor}
          category={category}
          setCategory={setCategory}
          address={address}
          setAddress={setAddress}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          thumbnail={thumbnail}
          previewImage={previewImage}
          handleThumbnailChange={handleThumbnailChange}
          Categories={Categories}
          onSubmit={handleSubmit}
          resetForm={resetForm}
          contentImages={contentImages}
          setContentImages={setContentImages}
        />
      </div>
    </>
  );
};

export default ArticleForm;
