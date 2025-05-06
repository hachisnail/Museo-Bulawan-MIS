    import { useEffect } from 'react'
    import { RouterProvider } from 'react-router-dom';
    import Route from './utils/route/LandingRoute';

    function App() {

      useEffect(() => {
        const userAgent = navigator.userAgent;

        const isOpera = userAgent.includes("OPR") || userAgent.includes("Opera");

        const isBrave = typeof navigator.brave !== 'undefined';

        if (isOpera) {
          document.documentElement.style.fontSize = "10px";
        } else if (isBrave) {
          document.documentElement.style.fontSize = "10px";
        } else {
          const isChromium = !!window.chrome || userAgent.includes("Chromium");
          if (isChromium) {
            document.documentElement.style.fontSize = "10px";
          }
        }
      }, []);

      return (
        <>
        
          <RouterProvider router={Route}/>
          
        </>
      )
    }

    export default App
