import React, { useEffect, useState } from 'react';
import { Link, ScrollRestoration } from 'react-router-dom';
import axios from 'axios';

import LandingNav from '../../components/navbar/LandingNav';
import backgroundImage from '../../../src/assets/Fernando-Amorsolo-Women-Bathing-and-Washing Clothes-7463.png';

// Example municipality list
const municipalities = [
  "Basud", "Capalonga", "Daet", "Jose Panganiban", "Labo",
  "Mercedes", "Paracale", "San Lorenzo Ruiz", "San Vicente", 
  "Santa Elena", "Talisay", "Vinzons"
];

const BASE_URL = 'http://localhost:5000';  
const token = localStorage.getItem('token'); // Remove if public

const Content = () => {
  const [articles, setArticles]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  // Optional filters
  const [keyword, setKeyword]       = useState('');
  const [category, setCategory]     = useState('');
  const [municipality, setMunicipality] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  // Fetch articles (similar to admin logic, but in a “landing” style)
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/auth/articles`, {
        headers: {
          Authorization: `Bearer ${token}`, // remove if not needed
        },
        withCredentials: true,
      });
      setArticles(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Failed to load articles. (Unauthorized or server error)");
      setLoading(false);
    }
  };

  // Filter logic for demonstration: title, author, category, address
  const filteredArticles = articles.filter((article) => {
    const matchesKeyword =
      !keyword ||
      article.title?.toLowerCase().includes(keyword.toLowerCase()) ||
      article.author?.toLowerCase().includes(keyword.toLowerCase());
    const matchesCategory =
      !category ||
      article.article_category?.toLowerCase() === category.toLowerCase();
    const matchesMunicipality =
      !municipality ||
      article.address?.toLowerCase().includes(municipality.toLowerCase());

    return matchesKeyword && matchesCategory && matchesMunicipality;
  });

  return (
    <>
      <ScrollRestoration />
      <div className="bg-[#1C1B19] flex flex-col gap-y-4 w-screen pt-7 h-fit min-h-fit">
        {/* Top Nav */}
        <LandingNav />

        {/* Background + Search UI */}
        <div
          className="w-screen h-[40rem] bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="grid grid-cols-4 w-[90%] max-w-6xl h-15">

              {/* Keyword Input */}
              <div className="flex items-center justify-center bg-white text-black border-r border-black">
                <input
                  type="text"
                  placeholder="Enter keyword"
                  className="w-full h-full px-4 text-4xl lg:text-5xl bg-transparent focus:outline-none"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              {/* Category Dropdown */}
              <div className="relative flex items-center justify-center bg-white text-black border-r border-black">
                <select
                  className="w-full h-full px-4 text-4xl lg:text-5xl bg-transparent appearance-none focus:outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Category</option>
                  <option value="Education">Education</option>
                  <option value="Exhibit">Exhibit</option>
                  <option value="Contents">Contents</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  {/* more if needed */}
                </select>
                <div className="pointer-events-none absolute right-2">
                  <svg
                    className="h-8 w-8 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </div>
              </div>

              {/* Municipality Dropdown */}
              <div className="relative flex items-center justify-center bg-white text-black border-r border-black">
                <select
                  className="w-full h-full px-4 text-4xl lg:text-5xl bg-transparent appearance-none focus:outline-none"
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                >
                  <option value="">Municipality</option>
                  {municipalities.map((mun) => (
                    <option key={mun} value={mun}>
                      {mun}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2">
                  <svg
                    className="h-8 w-8 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </div>
              </div>

              {/* Search Button */}
              <button
                className="flex items-center justify-center text-4xl lg:text-5xl border-2 border-transparent bg-black text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 cursor-pointer"
                onClick={fetchArticles}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid Section (similar design as your existing Content.jsx) */}
      <div className="bg-[#1C1B19] min-h-screen py-15">
        <div className="w-full px-4 mx-auto flex justify-around">
          {loading && (
            <div className="text-center text-white text-xl">
              Loading articles...
            </div>
          )}
          {error && (
            <div className="text-center text-red-500 text-xl">
              {error}
            </div>
          )}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 gap-x-20">
              {filteredArticles.map((article, index) => {
                // Construct an image URL if only filename is stored
                const imageSrc = article.images
                  ? `${BASE_URL}/uploads/${article.images}`
                  : "https://via.placeholder.com/300x200?text=No+Image";
                
                const displayDate = article.upload_date
                  ? new Date(article.upload_date).toLocaleDateString()
                  : "No Date";

                return (
                  <Link
                    key={article.article_id || index}
                    to={`/article/${article.article_id}`}
                    className="flex flex-col items-center text-center hover:opacity-90 transition duration-300"
                  >
                    {/* Thumbnail */}
                    <img
                      src={imageSrc}
                      alt={`Article ${article.article_id}`}
                      className="w-[300px] h-auto"
                    />

                    {/* Category */}
                    <p className="text-[#F05454] text-base uppercase mt-2">
                      {article.article_category || 'No Category'}
                    </p>

                    {/* Title */}
                    <h2 className="text-white text-2xl font-bold mt-1">
                      {article.title || 'Untitled'}
                    </h2>

                    {/* Date */}
                    <p className="text-gray-300 text-base mt-1">
                      {displayDate}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Content;
