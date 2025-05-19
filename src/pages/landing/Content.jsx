// src/pages/Content.jsx
import React, { useEffect, useState } from 'react';
import { Link, ScrollRestoration } from 'react-router-dom';
import axios from 'axios';
import LandingNav from '../../components/navbar/LandingNav';
import backgroundImage from '../../../src/assets/Fernando-Amorsolo-Women-Bathing-and-Washing Clothes-7463.png';
import { FaImage } from 'react-icons/fa'; 

// Example municipality list
const municipalities = [
  "Basud", "Capalonga", "Daet", "Jose Panganiban", "Labo",
  "Mercedes", "Paracale", "San Lorenzo Ruiz", "San Vicente",
  "Santa Elena", "Talisay", "Vinzons"
];

const API_URL = import.meta.env.VITE_API_URL;

const Content = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Optional filters
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [municipality, setMunicipality] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/auth/public-articles`);
      const articlesList = response.data;

      // Fetch details for each article to get the address
      const detailedArticles = await Promise.all(
        articlesList.map(async (article) => {
          try {
            const detailRes = await axios.get(`${API_URL}/api/auth/public-article/${article.article_id}`);
            return { ...article, address: detailRes.data.address };
          } catch {
            return article; // fallback if detail fetch fails
          }
        })
      );

      setArticles(detailedArticles);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Failed to load articles. (Unauthorized or server error)");
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter((article) => {
  const matchesKeyword = !keyword ||
    article.title?.toLowerCase().includes(keyword.toLowerCase()) ||
    article.author?.toLowerCase().includes(keyword.toLowerCase());

  const matchesCategory = !category ||
    article.article_category?.toLowerCase() === category.toLowerCase();

  // Updated: Match municipality exactly (case-insensitive)
  const matchesMunicipality = !municipality ||
    (article.address && article.address.toLowerCase().includes(municipality.toLowerCase()));

  return matchesKeyword && matchesCategory && matchesMunicipality;
});


  // Encode (ID :: Title) into base64
  const encoded = (id, name) => {
    const encodedString = `${id}::${name}`;
    return btoa(encodedString);
  };

  // Check if image exists and is valid
  const isValidImage = (url) => {
    return url && url !== "" && url !== "undefined" && url !== "null";
  };

  return (
    <>
      <ScrollRestoration />

      <div className="bg-[#1C1B19] flex flex-col gap-y-4 w-screen pt-7 h-fit min-h-fit">
        <LandingNav />

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
                  <option value="Contests">Contests</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
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

      {/* Articles Grid */}
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
                const hasValidImage = isValidImage(article.images);
                const displayDate = article.upload_date
                  ? new Date(article.upload_date).toLocaleDateString()
                  : "No Date";

                return (
                  <Link
                    key={article.article_id || index}
                    to={`/article/${encoded(article.article_id, article.title)}`}
                    className="flex flex-col items-center text-center hover:opacity-90 transition duration-300"
                  >
                    <div className="w-full aspect-square overflow-hidden bg-gray-700 flex items-center justify-center">
                      {hasValidImage ? (
                        <img
                          src={article.images}
                          alt={`Article ${article.article_id}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.classList.add('flex', 'items-center', 'justify-center');
                            e.target.parentNode.innerHTML = '<div class="flex flex-col items-center justify-center"><FaImage class="text-gray-300 text-5xl" /><p class="text-gray-300 mt-2">No Image</p></div>';
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <FaImage className="text-gray-300 text-5xl" />
                          <p className="text-gray-300 mt-2">No Image</p>
                        </div>
                      )}
                    </div>
                    <p className="text-[#F05454] text-base uppercase mt-2">
                      {article.article_category || 'No Category'}
                    </p>
                    <h2 className="text-[#E5D2AC] italic text-[3rem] font-semibold mt-1">
                      {article.title || 'Untitled'}
                    </h2>

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
