import React, { useEffect, useState  } from 'react';
import LandingNav from '../../components/navbar/LandingNav'
import {useParams, ScrollRestoration } from 'react-router-dom'

import topImage from '../../../src/assets/456411725_818119137184125_1334004125955189067_n.png';
import articleImage1 from '../../../src/assets/455363415_812761527719886_1195461782753847821_n (1).png';
import articleImage2 from '../../../src/assets/456426171_818223347173704_7806646081153137378_n 2.png';

const API_URL = import.meta.env.VITE_API_URL


const Article = () => {
  const { id } = useParams(); 
  const [article, setArticle] = useState(null);

  const decodeId = (encoded) => {
    try {
      const decoded = atob(encoded);  
      const [id, name] = decoded.split('::'); 
      return { id, name };
    } catch (err) {
      console.error('Decode error:', err);
      return { id: null, name: null };
    }
  };

  const { id: articleId, name: articleName } = decodeId(id);

  // console.log(articleId + articleName)

  const fetchArticle = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/public-article/${id}`, {
        headers: { 'Accept': 'application/json' }
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
console.log(article);


const ArticleSection = ({ title, content, image, dropCap }) => {
  return (
    <div className='w-full sm:w-1/2 p-[2rem] text-justify'>
      {dropCap && (
        <span className='text-[15rem] font-bold text-black float-left leading-none mr-4'>
          {dropCap}
        </span>
      )}
      {title && <h1 className='text-[4.3rem] font-bold mb-4'>{title}</h1>}
      {image && <img src={image} alt='' className='my-[2rem]' />}
      <p>{content}</p>
    </div>
  );
};



  return (
    <>
      <ScrollRestoration />
    
    <div className='bg-white  flex flex-col gap-y-4 min-h-fit h-fit w-screen pt-7' >
      <div className='min-h-[10%] w-screen'>
        <LandingNav/>
      </div>

      <div className='w-screen h-[20rem] font-hina'>
      <span className='flex w-auto h-full text-center items-center justify-center text-[7rem]'>{articleName}</span>
      </div>
      <div className="flex w-auto justify-center my-[5rem]">
        <div className="flex w-[70rem] h-auto items-center justify-center text-center text-[2rem]">
            <span className="w-1/4 h-[13rem] border border-black flex flex-col items-center justify-center">
                <h1 className='text-[1.5rem]'>Date</h1>
                <p>{new Date(article?.upload_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</p>
            </span>
            <span className="w-1/4 h-[13rem] border border-black flex flex-col items-center justify-center">
                <h1 className='text-[1.5rem]'>Author</h1>
                <p>{article?.author}</p>
            </span>
            <span className="w-1/4 h-[13rem] border border-black flex flex-col items-center justify-center">
                <h1 className='text-[1.5rem]'>Address</h1>
                <p>{article?.address}</p>
            </span>
            <span className="w-1/4 h-[13rem] border border-black flex flex-col items-center justify-center">
                <h1 className='text-[1.5rem]'>{article?.article_category}</h1>
            </span>
        </div>
        </div>


    </div>

      <div className='w-screen h-auto min-h-[79rem] mx-auto font-hina'>
  <div className='max-w-[140rem] 3xl:max-w-[180rem] mx-auto text-[3rem]'>
    {/* Top image */}
    <div className='flex justify-center p-[2rem]'>
      <img src={topImage} alt='' />
    </div>

    {/* Article Sections */}
    <div className='flex flex-wrap'>
      <ArticleSection
        content='eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupi'
      />
      <ArticleSection
        title='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad'
        content=''
      />
      <ArticleSection
        image={articleImage1}
        content='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut '
      />
      <ArticleSection
        content='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
        image={articleImage2}
      />
      <ArticleSection
        content='orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        dropCap='L'
      />
      <ArticleSection
        title='Discovered at Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco..'
        content='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      />
      <ArticleSection
        title='Discovered at Lorem ipsum...'
      />
      <ArticleSection
        content='Lorem ipsum dolor sit amet, consectetur...'
      />
      <ArticleSection
        content='Lorem ipsum dolor sit amet, consectetur...'
        dropCap='L'
      />
      <ArticleSection
        content='Lorem ipsum dolor sit amet, consectetur...'
        image={articleImage2}
      />
      <ArticleSection
        content='Lorem ipsum dolor sit amet, consectetur...'
        dropCap='L'
      />
    </div>
  </div>
</div>

    </>
  )
}

export default Article
