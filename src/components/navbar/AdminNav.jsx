import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ConfirmationModalC } from '../modals/ConfirmationModal';

import dashboard_ico from '../../../src/assets/dashboard_icon.png';
import donation_ico from '../../../src/assets/donation.png';
import artifact_ico from '../../../src/assets/artifact.png';
import appointment_ico from '../../../src/assets/appointment.png';
import article_ico from '../../../src/assets/article.png';
import logs_ico from '../../../src/assets/list.png';
import user_ico from '../../../src/assets/User.png';
import logout_ico from '../../../src/assets/logout.png';
import schedule_ico from '../../../src/assets/schedule.png';

const AdminNav = () => {
  const navigate = useNavigate();
  const linkClasses =
    'w-fit sm:w-full h-fit py-4 flex flex-row justify-start bg-[#1C1B19] items-center gap-3 rounded-2xl p-2 h-[60px] cursor-pointer';
  const activeClasses = 'bg-white text-black';
  const [showConfirmation, setConfirmation] = useState(false);

  // State for user profile
  const [userProfile, setUserProfile] = useState(null);

  // Fetch user profile from localStorage
  useEffect(() => {
    const fetchUserProfile = () => {
      const encodedProfile = localStorage.getItem('userProfile');
      if (encodedProfile) {
        try {
          // Decode the profile using atob
          const decodedProfile = JSON.parse(atob(encodedProfile));
          setUserProfile(decodedProfile);
        } catch (error) {
          console.error('Failed to decode user profile:', error);
          localStorage.removeItem('userProfile'); // Clear corrupted data
          navigate('/login', { state: { sessionMessage: 'Session expired. Please log in again.' } });
        }
      } else {
        navigate('/login', { state: { sessionMessage: 'Session expired. Please log in again.' } });
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleConfirmation = (result) => {
    setConfirmation(false);
    if (result === true) {
      handleLogout();
    }
  };

  const handleLogout = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem('userProfile'); // Clear user profile on logout
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/login');
    }
  };

  if (!userProfile) {
    return (
      <div className="bg-[#1C1B19] min-h-full flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const { first_name, last_name, position, role } = userProfile;
  const firstInitial = first_name.charAt(0).toUpperCase();
  const lastInitial = last_name.charAt(0).toUpperCase();

  const colorMap = {
    A: '#FF6666',
    B: '#FF9933',
    C: '#FFD700',
    D: '#66CC66',
    E: '#0099CC',
    F: '#9933CC',
    G: '#FF3399',
    H: '#6666FF',
    I: '#00CC99',
    J: '#FF6600',
    K: '#3399FF',
    L: '#FF3366',
    M: '#33CC33',
    N: '#FFCC00',
    O: '#336699',
    P: '#990000',
    Q: '#FF6699',
    R: '#666600',
    S: '#669900',
    T: '#009999',
    U: '#6600CC',
    V: '#CC3300',
    W: '#99CC00',
    X: '#9966FF',
    Y: '#FF0000',
    Z: '#33CCCC',
  };

  const bgColor = colorMap[firstInitial] || '#FFFFFF';


  return (
    <>
      {showConfirmation && (
        <ConfirmationModalC
          title="Logout?"
          description="You are about to log out. All unsaved modifications will be permanently lost."
          icon="info"
          onClose={handleConfirmation}
        />
      )}

      <div className="bg-[#1C1B19]   min-h-full gap-y-10 justify-around w-fit sm:min-w-[20rem] flex flex-col items-center">
        <div className=" w-full h-fit flex flex-col gap-y-[5rem]">
          <div className=" relative group w-full py-4 h-fit flex justify-center items-end border-b-1 border-[#373737]">
            <div className="absolute group-hover:flex-col left-full ml-2 hidden group-hover:flex bg-gray-800 sm:text-transparent sm:bg-transparent text-white text-2xl rounded py-1 px-2 w-max">
              <span className="text-sm font-semibold sm:text-transparent text-[#949494]">
                {position}
              </span>
              <span>
                {first_name.toUpperCase()}&nbsp;{last_name.toUpperCase()}
              </span>
              
              
            </div>
            <div className="sm:w-[15rem] flex flex-col justify-end gap-y-4 h-fit">
              <div className="w-[4rem] h-[4rem] rounded-full flex items-center justify-center bg-white">
                <div
                  className="w-[3.5rem] h-[3.5rem] flex items-center justify-center rounded-full border-1 "
                  style={{ backgroundColor: bgColor }}
                >
                  <span className="text-2xl font-semibold">
                    {firstInitial}
                    {lastInitial}
                  </span>
                </div>
              </div>
              <div className="w-full hidden sm:flex h-fit flex-col gap-y-2">
                <span className="text-sm font-semibold text-[#949494]">
                  {position}
                </span>
                <span className="text-2xl max-w-full font-bold text-white whitespace-nowrap truncate">
                  {first_name.toUpperCase()}&nbsp;{last_name.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="h-auto px-4 sm:px-12 min-h-[40rem] w-fit sm:w-full font-hind-kochi text-2xl font-bold flex flex-col gap-y-4">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `relative group ${linkClasses} ${
                  isActive ? activeClasses : 'text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={dashboard_ico}
                    alt="dashboard"
                    className={`h-auto w-[25px] filter brightness-1 ${
                      isActive ? 'invert-1' : 'invert'
                    }`}
                  />
                  <span className="hidden sm:block">Dashboard</span>
                  <span className="absolute  left-full ml-8 hidden group-hover:flex bg-gray-800 sm:text-transparent sm:bg-transparent text-white text-2xl rounded py-1 px-2 w-max">
                    Dashboard
                  </span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/admin/appointment"
              className={({ isActive }) =>
                `relative group ${linkClasses} ${
                  isActive ? activeClasses : 'text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={appointment_ico}
                    alt="appointment"
                    className={`h-auto w-[25px] filter brightness-1 ${
                      isActive ? 'invert-1' : 'invert'
                    }`}
                  />
                  <span className="hidden sm:block">Appointment</span>
                  <span className="absolute  left-full ml-8 hidden group-hover:flex bg-gray-800 sm:text-transparent sm:bg-transparent text-white text-2xl rounded py-1 px-2 w-max">
                    Appointment
                  </span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/admin/schedule"
              className={({ isActive }) =>
                `relative group ${linkClasses} ${
                  isActive ? activeClasses : 'text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={schedule_ico}
                    alt="appointment"
                    className={`h-auto w-[25px] filter brightness-1 ${
                      isActive ? 'invert-1' : 'invert'
                    }`}
                  />
                  <span className="hidden sm:block">Schedule</span>
                  <span className="absolute  left-full ml-8 hidden group-hover:flex bg-gray-800 sm:text-transparent sm:bg-transparent text-white text-2xl rounded py-1 px-2 w-max">
                    Schedule
                  </span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/admin/acquisition"
              className={({ isActive }) =>
                `relative group ${linkClasses} ${
                  isActive ? activeClasses : 'text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={donation_ico}
                    alt="donation"
                    className={`h-auto w-[25px] filter brightness-1 ${
                      isActive ? 'invert-1' : 'invert'
                    }`}
                  />
                  <span className="hidden sm:block">Acquisition</span>
                  <span className="absolute  left-full ml-8 hidden group-hover:flex bg-gray-800 sm:text-transparent sm:bg-transparent text-white text-2xl rounded py-1 px-2 w-max">
                    Acquisition
                  </span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/admin/artifact"
              className={({ isActive }) =>
                `relative group ${linkClasses} ${
                  isActive ? activeClasses : 'text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={artifact_ico}
                    alt="artifact"
                    className={`h-auto w-[25px] filter brightness-1 ${
                      isActive ? 'invert-1' : 'invert'
                    }`}
                  />
                  <span className="hidden sm:block">Artifact</span>
                  <span className="absolute  left-full ml-8 hidden group-hover:flex bg-gray-800 sm:text-transparent sm:bg-transparent text-white text-2xl rounded py-1 px-2 w-max">
                    Artifact
                  </span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/admin/article"
              className={({ isActive }) =>
                `relative group ${linkClasses} ${
                  isActive ? activeClasses : 'text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={article_ico}
                    alt="article"
                    className={`h-auto w-[25px] filter brightness-1 ${
                      isActive ? 'invert-1' : 'invert'
                    }`}
                  />
                  <span className="hidden sm:block">Article</span>
                  <span className="absolute  left-full ml-8 hidden group-hover:flex bg-gray-800 sm:text-transparent sm:bg-transparent text-white text-2xl rounded py-1 px-2 w-max">
                    Article
                  </span>
                </>
              )}
            </NavLink>
            <h1 className="bg-[#373737] h-[1px] "></h1>

            {role === 'admin' && (
              <>
                <NavLink
                  to="/admin/log"
                  className={({ isActive }) =>
                    `relative group ${linkClasses} ${
                      isActive ? activeClasses : 'text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <img
                        src={logs_ico}
                        alt="logs"
                        className={`h-auto w-[25px] filter brightness-1 ${
                          isActive ? 'invert-1' : 'invert'
                        }`}
                      />
                      <span className="hidden sm:block">Logs</span>
                      <span className="absolute  left-full ml-8 hidden group-hover:flex bg-gray-800 sm:text-transparent sm:bg-transparent text-white text-2xl rounded py-1 px-2 w-max">
                        Logs
                      </span>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/admin/user"
                  className={({ isActive }) =>
                    `relative group ${linkClasses} ${
                      isActive ? activeClasses : 'text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <img
                        src={user_ico}
                        alt="user"
                        className={`h-auto w-[25px] filter brightness-1 ${
                          isActive ? 'invert-1' : 'invert'
                        }`}
                      />
                      <span className="hidden sm:block">User</span>
                      <span className="absolute  left-full ml-8 hidden group-hover:flex bg-gray-800 sm:text-transparent sm:bg-transparent text-white text-2xl rounded py-1 px-2 w-max">
                        User
                      </span>
                    </>
                  )}
                </NavLink>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => setConfirmation(true)}
          className="relative group font-hind-kochi text-2xl font-bold w-[4rem] h-[4rem] sm:w-[14rem] flex flex-row justify-center items-center gap-3 text-white cursor-pointer hover:bg-red-900 transition rounded-2xl"
        >
          <img
            src={logout_ico}
            alt="logout"
            className="h-auto w-[30px]"
          />
          <span className="hidden sm:block">Logout</span>
          <span className="absolute  left-full ml-8 hidden group-hover:flex bg-gray-800 sm:text-transparent sm:bg-transparent text-white text-2xl rounded py-1 px-2 w-max">
            Logout
          </span>
        </button>
      </div>
    </>
  )
}

export default AdminNav
