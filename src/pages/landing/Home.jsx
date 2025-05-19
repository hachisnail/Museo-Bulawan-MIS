import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom'
import LandingNav from '../../components/navbar/LandingNav'
import { ScrollRestoration } from 'react-router-dom'
import CalendarComponent from '../../components/function/CalendarComponent';
// import NewsEvents from '../../components/modals/NewsEvents'; // adjust the path as needed
import axios from 'axios';


import bgImage1 from '../../../src/assets/06-AfternoonMealOfTheWorker 1.png'
import bgImage2 from '../../../src/assets/bghome2.png'
import img1 from '../../../src/assets/nae_img_1.png'
import img2 from '../../../src/assets/nae_img_2.png'
import img3 from '../../../src/assets/nae_img_3.png'
import img4 from '../../../src/assets/nae_img_4.png'
import bgImage3 from '../../../src/assets/img_1.png'
import dhome2 from '../../../src/assets/dhome2.png'

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const learnMore = useRef(null)
  const calendar = useRef(null)
  const events = useRef(null)
  const support = useRef(null)
  const home = useRef(null)
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysArticles = articles.filter(a => a.upload_date && a.upload_date.split('T')[0] === todayStr);


useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/auth/public-articles`);
      setArticles(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load events.');
      setLoading(false);
    }
  };
  
const encoded = (id, name) => {
  const encodedString = `${id}::${name}`;
  return btoa(encodedString);
};

const getImageUrl = (img) => {
  if (!img) return '';
  if (img.startsWith('http')) return img;
  return `${API_URL}/uploads/${img}`;
};

let displayArticles = todaysArticles;
if (displayArticles.length === 0) {
  // Find the soonest future date
  const futureArticles = articles
    .filter(a => a.upload_date && a.upload_date.split('T')[0] > todayStr)
    .sort((a, b) => a.upload_date.localeCompare(b.upload_date));
  if (futureArticles.length > 0) {
    const nextDate = futureArticles[0].upload_date.split('T')[0];
    displayArticles = futureArticles.filter(a => a.upload_date.split('T')[0] === nextDate);
  }
}

displayArticles = displayArticles.slice(0, 2);

  return (
    <>
      <ScrollRestoration />

      <div
       ref={home}
        className="bg-cover bg-center bg-no-repeat  min-h-[79rem] h-auto xl:h-screen w-screen pt-7"
        style={{ backgroundImage: `url(${bgImage1})` }}
      >
        <div className="min-h-[10%] w-screen">
          <LandingNav />
        </div>

        <div className="max-w-[140rem] 3xl:max-w-[180rem] mx-auto flex min-h-[89%] ">
          <div className="hidden text-white w-10 sm:flex flex-col h-auto justify-around">
            <a
              href="https://www.facebook.com/museobulawancn"
              target="_blank"
              rel="noopener noreferrer"
              className="[writing-mode:vertical-rl]"
            >
              <div className="w-10 h-auto  flex items-center text-xl font-bold  ">
                <i className="fa-solid fa-circle text-sm mr-2"></i>
                <i className="mx-3 rotate-90 fa-brands fa-square-facebook mr-2"></i>
                <span>Museo Bulawan</span>
              </div>
            </a>

            <a
              href="https://www.instagram.com/museobulawanofficial/"
              target="_blank"
              rel="noopener noreferrer"
              className="[writing-mode:vertical-rl]"
            >
              <div className="w-10 h-auto flex items-center text-xl font-bold">
                <i className="fa-solid fa-circle text-sm mr-2"></i>
                <i className="mx-3 rotate-90 fa-brands fa-instagram mr-2"></i>
                <span>museobulawanofficial</span>
              </div>
            </a>
          </div>

          <div className="flex sm:hidden text-white w-10  flex-col h-auto justify-center gap-y-4 font-bold text-3xl">
            <a
              href="https://www.facebook.com/museobulawancn"
              target="_blank"
              rel="noopener noreferrer"
              className="[writing-mode:vertical-rl]"
            >
              <div className="w-10 h-auto  flex items-center justify-center">
                {/* <i className="fa-solid fa-circle text-sm mr-2"></i> */}
                <i className="fa-brands fa-square-facebook mx-auto"></i>
              </div>
            </a>

            <a
              href="https://www.instagram.com/museobulawanofficial/"
              target="_blank"
              rel="noopener noreferrer"
              className="[writing-mode:vertical-rl]"
            >
              <div className="w-10 h-auto flex items-center">
                {/* <i className="fa-solid fa-circle text-sm mr-2"></i> */}
                <i className="fa-brands fa-instagram mx-auto"></i>
              </div>
            </a>
            <a
              href="https://www.tiktok.com/@museobulawan"
              target="_blank"
              rel="noopener noreferrer"
              className="[writing-mode:vertical-rl]"
            >
              <div className="w-10 h-auto flex items-center">
                {/* <i className="fa-solid fa-circle text-sm mr-2"></i> */}
                <i className="fa-brands fa-brands fa-tiktok mx-auto"></i>
              </div>
            </a>

            <a
              href="https://www.youtube.com/@museobulawanofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="[writing-mode:vertical-rl]"
            >
              <div className="w-10 h-auto flex items-center">
                {/* <i className="fa-solid fa-circle text-sm mr-2"></i> */}
                <i className="fa-brands fa-youtube mx-auto"></i>
              </div>
            </a>
          </div>

          <div className="w-full pt-35 h-fit flex flex-col">
            <div className="w-fit h-fit flex flex-col ml-8">
              <span className="text-4xl xl:text-5xl w-full font-bold text-[#DAB765]  drop-shadow-[3px_3px_0px_black] ">
                WELCOME TO
              </span>

              <span className="text-8xl xl:text-9xl font-bold text-white drop-shadow-[3px_3px_0px_black] -mt-3">
                MUSEO
                <br />
                BULAWAN
              </span>
            </div>

            <div className="w-fit h-fit text-2xl flex gap-x-5 ml-11 my-10 sm:my-20">
              <button
                onClick={() =>
                  learnMore.current?.scrollIntoView({ behavior: 'smooth' })
                }
                className="w-48 h-16 hover:outline-3 hover:outline-black bg-white flex items-center justify-center font-medium text-black transition duration-300 hover:shadow-lg cursor-pointer outline-3 outline-white"
              >
                Learn More
              </button>

              <NavLink to="/appointment">
                <button className="w-48 h-16 hover:outline-3 hover:outline-black bg-transparent flex items-center justify-center outline-3 outline-white text-2xl font-medium text-white transition duration-300 hover:bg-white hover:text-black cursor-pointer">
                  BOOK A VISIT
                </button>
              </NavLink>
            </div>

            <div className="ml-11 flex flex-col gap-y-5">
              <div className="w-auto h-auto text-white flex items-start gap-2">
                <i className="fa-solid fa-clock text-xl relative mt-1.5 mr-2 w-5"></i>
                <div>
                  <span className="block text-xl font-bold">Museum Hours</span>
                  <span className="text-md font-normal leading-tight">
                    Open Daily 9:00am-5:00pm, Monday-Friday,
                  </span>
                </div>
              </div>

              <div className="w-auto h-auto text-white flex items-start gap-2">
                <i className="fa-solid fa-location-dot text-xl relative mt-1 mr-2 w-5"></i>
                <div>
                  <span className="block text-xl font-bold">
                    Museum Location
                  </span>
                  <span className="text-md font-normal leading-tight">
                    Camarines Norte Provincial Capitol Grounds, Daet Philippines
                  </span>
                </div>
              </div>

              {/* <div className='w-auto h-auto flex flex-col gap-x-2'>
                <span className='text-xl font-normal hover:underline leading-tight text-white'><i class="fa-solid fa-greater-than"></i>  Calendar</span>
                <span className='text-xl font-normal hover:underline leading-tight text-white'><i class="fa-solid fa-greater-than"></i>  Calendar</span>
                <span className='text-xl font-normal hover:underline leading-tight text-white'><i class="fa-solid fa-greater-than"></i>  Calendar</span>

              </div> */}
            </div>
          </div>

          <div className="hidden text-white  w-10 sm:flex flex-col h-auto justify-around">
            <a
              href="https://www.tiktok.com/@museobulawan"
              target="_blank"
              rel="noopener noreferrer"
              className="[writing-mode:vertical-rl]"
            >
              <div className="w-10 h-auto flex items-center text-xl font-bold">
                <i className="fa-solid fa-circle text-sm mr-2"></i>
                <i className="mx-3 rotate-90 fa-brands fa-brands fa-tiktok mr-2"></i>
                <span>museobulawan</span>
              </div>
            </a>

            <a
              href="https://www.youtube.com/@museobulawanofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="[writing-mode:vertical-rl]"
            >
              <div className="w-10 h-auto flex items-center text-xl font-bold">
                <i className="fa-solid fa-circle text-sm mr-2"></i>
                <i className="mx-3 rotate-90 fa-brands fa-youtube mr-2"></i>
                <span>Museo Bulawan (Abel C. Icatlo)</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div
        ref={learnMore}
        id="learn_more"
        className="w-screen h-screen min-h-[79rem] bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage2})` }}
      >
        <div className="h-full w-full py-34 flex flex-col">
          <div className="h-full w-full flex flex-col xl:pl-30 xl:py-12 ">
            <div className="flex items-center gap-2 px-4">
              {' '}
              <h1 className="w-10 h-0.5 bg-[#63635C]"></h1>
              <span className="text-2xl text-[#63635C]">
                {' '}
                About Museo Bulawan
              </span>
            </div>
            <div className="h-[65em] w-full flex flex-col xl:flex-row gap-10 items-center justify-end ">
              <div className="xl:w-1/2 w-full h-[22em] flex flex-col pt-14 xl:gap-y-5 xl:gap-x-3 px-4 xl:h-auto">
                <span className="text-3xl font-hina">
                  <span className="text-4xl font-semibold xl:text-6xl">
                    Museo Bulawan
                  </span>
                  ,{' '}
                  <span className="xl:text-5xl leading-snug xl:tracking-wider">
                    known as the “Golden Museum,” is the leading and the most
                    viewer-friendly community museum that serves as the nerve
                    center for education and communication of the rich cultural,
                    artistic and natural heritage and history of Camarines
                    Norte, the ultimate medium for preservation, exhibition of
                    significant objects that strengthen the values of the people
                    and deepen their patriotism and sense of identity.
                  </span>
                </span>
                <NavLink to="/about">
                  <span className="text-2xl cursor-pointer hover:underline">
                    Learn More <i className="fa-solid fa-arrow-right "></i>
                  </span>
                </NavLink>
              </div>
              <div className="xl:w-1/2 h-[60em] w-full">
                <img
                  src={dhome2}
                  className="w-full h-full object-contain"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="w-full h-full flex mt-20 justify-end px-20">
            <span
              onClick={() =>
                calendar.current?.scrollIntoView({ behavior: 'smooth' })
              }
              className="text-3xl hover:underline cursor-pointer font-semibold"
            >
              Calendar <i className="fa-solid fa-arrow-right"></i>
            </span>
          </div>
        </div>
        
      
      </div>

      <div ref={calendar} className="w-screen h-auto xl:h-screen min-h-[79rem] flex flex-col xl:flex-row border-t-1 border-gray-400 overflow-hidden ">
          <div className='w-full xl:max-w-[80rem] xl:min-w-[80rem] xl:h-full h-[60rem] bg-[#FFF6E1] border-r-1 border-b-1 flex justify-center flex-col px-5 md:px-20 items-center border-gray-400'>
              <CalendarComponent/>
          </div>
          <div className='w-full h-full flex flex-col items-center justify-between gap-y-5'>
            <div className='w-fit min-h-[10rem] flex items-end'>
                <div className='hidden sm:flex w-1 h-full  flex-col'>
                  <div className='relative right-[90rem] top-[7rem] w-[90rem] h-9 flex flex-col items-end justify-between overflow-hidden'>
                    <div className='w-full h-3 bg-black'></div>
                    <div className='w-[70rem] h-3 bg-black'></div>

                  </div>
                </div>
                <span className='text-8xl font-hina'>
                  Whats On?
                </span>
            </div>
            <div className='w-[55rem] h-full flex flex-col justify-start gap-y-5'>
            {displayArticles.length > 0 ? (
              displayArticles.map((article, idx) => (
                <NavLink
                  key={article.article_id}
                  to={`/article/${encoded(article.article_id, article.title)}`}
                  className='w-[33rem] mx-auto h-[20rem] md:w-[55rem] md:h-[30rem] bg-cover bg-center bg-no-repeat rounded-lg shadow-lg hover:opacity-90 transition'
                  style={{ backgroundImage: `url('${article.images}')` }}
                  title={article.title}
                >
                  <div className="w-full h-full flex flex-col justify-end bg-opacity-30 p-4">
                    <span className="text-white text-2xl font-bold drop-shadow">{article.title}</span>
                    <span className="text-white text-lg">{article.upload_date ? new Date(article.upload_date).toLocaleDateString() : ''}</span>
                  </div>
                </NavLink>
              ))
            ) : (
              <>
                <div className='w-[33rem] mx-auto h-[20rem] md:w-[55rem] md:h-[30rem] bg-cover bg-center bg-no-repeat flex items-center justify-center text-gray-400' style={{ backgroundImage: `url(${bgImage1})` }}>
                  <span>No events today or upcoming.</span>
                </div>
                <div className='w-[33rem] h-[20rem] mx-auto md:w-[55rem] md:h-[30rem] bg-cover bg-center bg-no-repeat' style={{ backgroundImage: `url(${bgImage3})` }} />
              </>
            )}
          </div>
            <div className='w-full min-h-20 flex items-center justify-end pr-20'>
              <span
                onClick={() =>
                  events.current?.scrollIntoView({ behavior: 'smooth' })
                }
                className="text-3xl hover:underline cursor-pointer font-semibold"
              >
                Events <i className="fa-solid fa-arrow-right"></i>
              </span>
            </div>
          </div>




      </div>

      <div ref={events} className="w-screen h-auto xl:h-screen min-h-[89rem] xl:min-h-[79rem]">
        <div className="w-full h-full py-24 px-4 bg-black xl:px-12 xl:py-26">
          <div className="w-full h-full flex flex-col">
            <div className="w-full max-h-[3em] flex text-2xl justify-between pr-9">
              <div className="flex items-center gap-2 px-4">
                <h1 className="w-10 h-0.5 bg-[#63635C]"></h1>
                <span className="text-2xl text-[#63635C]"> DON'T MISS</span>
              </div>
              <NavLink to="/content">
                <span className="text-2xl hover:underline text-white cursor-pointer">
                  See all Events
                  <i className="fa-solid fa-arrow-right text-white"></i>
                </span>
              </NavLink>
            </div>
            <div className="w-full max-h-[8em] py-4 xl:min-h-[6em] flex items-center">
              <span className="text-5xl font-hina font-semibold text-white xl:text-7xl">
                News & Events
              </span>
            </div>

            <div className="w-full h-full px-8 py-3 grid xl:grid-cols-2 xl:grid-rows-2 grid-rows-4 grid-cols-1 gap-4 xl:gap-8">
              {loading && (
                <div className="col-span-2 text-white text-2xl text-center py-10">Loading events...</div>
              )}
              {error && (
                <div className="col-span-2 text-red-500 text-2xl text-center py-10">{error}</div>
              )}
              {!loading && !error &&
                articles.slice(0, 4).map((article, index) => {
                  const displayDate = article.upload_date
                    ? new Date(article.upload_date).toLocaleDateString()
                    : "No Date";

                      return (
                        <NavLink
                          key={index}
                          to={`/article/${encoded(article.article_id, article.title)}`}
                          className="w-full h-full transition duration-300">
                      <div className="w-full h-full flex flex-col xl:flex-row gap-4 bg-black/50 p-3 rounded-lg">
                        <div className="w-full xl:w-2/5 h-40 xl:h-full rounded-lg overflow-hidden">
                          <div
                            className="w-full h-full bg-cover bg-no-repeat bg-center"
                            style={{ backgroundImage: `url('${article.images}')` }}
                          />
                        </div>
                        <div className="w-full xl:w-3/5 flex flex-col justify-between gap-y-5">
                          <div className='w-full h-25'>
                            <h3 className="text-2xl xl:text-5xl font-bold text-white overflow-hidden">
                              {article.title || "Untitled"}
                            </h3>
                          </div>
                          <div className='w-full h-fit flex gap-x-5'>
                            <p className="w-50 text-xl text-[#787878]">{displayDate}</p>
                            <p className="text-xl  text-yellow-600">
                              {article.article_category || ""}
                            </p>
                          </div>
                          <div className='w-full h-50 flex overflow-hidden'>
                            <span className=' overflow-hidden text-white text-xl'>
                              {article.description.replace(/<[^>]+>/g, '')|| '' }
                            </span>
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  );
                })}
            </div>

            <div className="w-full h-fit flex mt-10 justify-end px-20">
              <span
                onClick={() =>
                  support.current?.scrollIntoView({ behavior: 'smooth' })
                }
                className="text-3xl text-white hover:underline cursor-pointer font-semibold"
              >
                Support Us <i className="fa-solid fa-arrow-right"></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div  ref={support} className="w-screen h-fit xl:h-screen min-h-[79rem]">
        <div className="w-full h-full py-12  ">
          <div className="w-full h-full xl:px-120 px-12">
            <div className="w-full h-full flex flex-col">
              <div className="w-full h-1/2 py-3 px-20 flex flex-col gap-6 xl:flex-row ">
                <div
                  className="w-full min-h-[20rem] xl:h-full bg-no-repeat bg-cover bg-center p-5"
                  style={{ backgroundImage: `url(${bgImage3})` }}
                >
                  <div className="w-full min-h-[20rem] xl:h-full  outline-2 outline-white"></div>
                </div>
                <div className="w-full h-1/2 xl:h-full xl:flex xl:items-end">
                  <div className="w-full h-full xl:h-fit gap-y-5 flex flex-col gap-2 items-center justify-center xl:flex xl:justify-start xl:items-start">
                    <div className="w-full min-h-[6em] flex items-center justify-center xl:h-[10em] xl:justify-start">
                      <span className="text-5xl font-bold xl:text-6xl">
                        VISIT US!
                      </span>
                    </div>
                    <div className="w-full min-h-[9em] flex items-center  xl:h-[10em]">
                      <span className="text-2xl xl:text-4xl leading-snug">
                        Explore the treasures of Museo Bulawan! Plan your visit
                        today by booking a tour or schedule an appointment for
                        research, interviews, and more.
                      </span>
                    </div>
                    <div className="w-full min-h-[4em] flex items-center justify-center  xl:h-[10em] xl:justify-start">
                      <div className="w-78 min-h-10 flex items-center justify-center outline-2 outline-black rounded-lg bg-white xl:h-16 xl:w-90">
                      <NavLink to='/appointment'>
                        <span className="cursot-pointer text-2xl xl:text-3xl">
                          BOOK AN APPOINTMENT{' '}
                        </span>
                      </NavLink>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-1/2 py-3 px-20 flex flex-col gap-6 xl:flex-row">
                <div
                  className="w-full min-h-[20rem] xl:h-full xl:order-2 bg-no-repeat bg-cover bg-center p-5"
                  style={{ backgroundImage: `url(${img2})` }}
                >
                  <div className="w-full min-h-[20rem] xl:h-full  outline-2 outline-white"></div>
                </div>

                <div className="w-full h-fit xl:h-full xl:order-1 ">
                  <div className="w-full h-full xl:h-fit gap-y-5 flex flex-col gap-2 items-center justify-center xl:flex xl:justify-start xl:items-end">
                    <div className="w-full min-h-[6em] flex items-center justify-center xl:h-[10em] xl:justify-end">
                      <span className="text-5xl font-bold xl:text-6xl text-center">
                        YOUR SUPPORT MATTERS
                      </span>
                    </div>
                    <div className="w-full min-h-[9em]  flex items-center justify-center xl:h-[10em]">
                      <span className="text-2xl xl:text-4xl leading-snug xl:text-end">
                        Help us preserve and celebrate our heritage! Contribute
                        to Museo Bulawan by donating or lending artifacts to
                        enrich our collection and share history with future
                        generations
                      </span>
                    </div>
                    <div className="w-full min-h-[4em] flex items-center justify-center  xl:h-[10em] xl:justify-end">
                      <div className="w-40 min-h-10 flex items-center justify-center outline-2 outline-black rounded-lg bg-white xl:h-16 xl:w-60">
                      <NavLink to='/support'>

                        <span className="text-2xl xl:text-4xl">SUPPORT </span>
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
            
          </div>

          
        </div>
      </div>
    </>
  )
}

export default Home
