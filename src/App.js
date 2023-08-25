import logo from './logo.svg';
import './App.css';
import Globe from 'react-globe.gl';

import { useEffect, useState, useRef } from "react";
const API_URL = "https://aseevia.github.io/star-wars-frontend/data/secret.json";

function App() {
  const [decodedMessage, setDecodedMessage] = useState(null);
  const [worldData, setWorldData] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const world = useRef(null);

  const getSecret = async () => {
    const response = await fetch(`${API_URL}`);
    const data = await response.json();
    const base64Decoded = atob(data.message);
    const parsedData = JSON.parse(base64Decoded);
    setDecodedMessage(base64Decoded);
    setWorldData(parsedData);  // Updating worldData

  }		
  useEffect (()=>{
    getSecret();
    window.addEventListener('resize', handleResize);
  },[]);
  
  const handleResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };
  
  
  return (
    <div className="App">
    <div style={{ width: '100vw', height: '100vh' }}>
      <Globe
        ref={world}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        backgroundImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
        pointsData={worldData}
        pointLat="lat"
        pointLng="long"
        pointColor={() => 'red'}
        pointAltitude={0}
        pointRadius={1.005}
        width={width} //this library is not responsive otherwise!
        height={height}
      />
    </div>

    </div>
  );
}

export default App;
