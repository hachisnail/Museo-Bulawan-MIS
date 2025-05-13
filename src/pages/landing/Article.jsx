// src/pages/Article.jsx
import React, { useEffect, useState } from 'react';
import { useParams, ScrollRestoration } from 'react-router-dom';
import LandingNav from '../../components/navbar/LandingNav';

const API_URL = import.meta.env.VITE_API_URL;

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  // Decode the base64 param (e.g., "13::My Title")
  const decodeId = (encoded) => {
    try {
      const decoded = atob(encoded);
      const [decId, decName] = decoded.split('::');
      return { id: decId, name: decName };
    } catch (err) {
      console.error('Decode error:', err);
      return { id: null, name: null };
    }
  };

  const { id: articleId, name: articleName } = decodeId(id);

  // Fetch a specific public article, including its thumbnail and description
  const fetchArticle = async (aid) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/public-article/${aid}`, {
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
    }
  };

  useEffect(() => {
    if (!articleId) {
      console.log('No articleId provided.');
      return;
    }
    fetchArticle(articleId);
  }, [articleId]);

  // If no article is loaded yet, show a loading indicator
  if (!article) {
    return (
      <>
        <ScrollRestoration />
        <LandingNav />
        <div className="flex items-center justify-center h-screen">
          <p>Loading article...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <ScrollRestoration />

      {/* Top Nav + Main Title */}
      <div className="bg-white flex flex-col gap-y-4 min-h-fit h-fit w-screen pt-7">
        <div className="min-h-[10%] w-screen">
          <LandingNav />
        </div>
        <div className="w-screen h-[20rem] font-hina">
          <span className="flex w-auto h-full text-center items-center justify-center text-[7rem]">
            {articleName || article.title}
          </span>
        </div>

        {/* Info Bar (Date, Author, Address, Category) */}
        <div className="flex w-auto justify-center my-[5rem]">
          <div className="flex w-[70rem] h-auto items-center justify-center text-center text-[2rem]">
            {/* Date */}
            <span className="w-1/4 h-[13rem] border border-black flex flex-col items-center justify-center">
              <h1 className="text-[1.5rem]">Date</h1>
              <p>
                {article.upload_date
                  ? new Date(article.upload_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </span>

            {/* Author */}
            <span className="w-1/4 h-[13rem] border border-black flex flex-col items-center justify-center">
              <h1 className="text-[1.5rem]">Author</h1>
              <p>{article.author || 'N/A'}</p>
            </span>

            {/* Address */}
            <span className="w-1/4 h-[13rem] border border-black flex flex-col items-center justify-center">
              <h1 className="text-[1.5rem]">Address</h1>
              <p>{article.address || 'N/A'}</p>
            </span>

            {/* Category */}
            <span className="w-1/4 h-[13rem] border border-black flex flex-col items-center justify-center">
              <h1 className="text-[1.5rem]">
                {article.article_category || 'N/A'}
              </h1>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content: Thumbnail + Tiptap HTML */}
      <div className="w-screen h-auto min-h-[79rem] mx-auto font-hina">
        <div className="max-w-[140rem] 3xl:max-w-[180rem] mx-auto text-[3rem]">
          {/* If there's an uploaded thumbnail, show it */}
          {article.images && (
            <div className="flex justify-center p-[2rem]">
              <img
                src={`${API_URL}/uploads/${article.images}`}
                alt="Article Thumbnail"
                className="max-h-64 object-contain"
              />
            </div>
          )}

          {/* Tiptap-generated HTML from `article.description` */}
          <div className="p-4 prose max-w-none">
            {article.description ? (
              <div
                className="editor-content-preview"
                dangerouslySetInnerHTML={{ __html: article.description }}
              />
            ) : (
              <p className="text-gray-400 italic text-xl">
                No article content available.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Article;
