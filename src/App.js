import logo from './logo.svg';
import './App.css';
import Globe from 'react-globe.gl';

import { useEffect, useState} from "react";
const API_URL = "https://aseevia.github.io/star-wars-frontend/data/secret.json";
const ADDITIONAL_INFO_URL = "https://akabab.github.io/starwars-api/api/id/";
function App() {
  const [worldData, setWorldData] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const getData = async () => {
    const response = await fetch(`${API_URL}`);
    const data = await response.json();
    const base64Decoded = atob(data.message);
    const parsedData = JSON.parse(base64Decoded);
    
    // Fetch additional data for each item by ID
    const promises = parsedData.map(async (item) => {
      const additionalData = await getAdditionalData(item.id);
      return { ...item, ...additionalData };
    });
    
    const updatedData = await Promise.all(promises);
    
    console.log(updatedData);
    setWorldData(parsedData);
  }		
  
  const getAdditionalData = async (id) => {
    const response = await fetch(`${ADDITIONAL_INFO_URL}${id}.json`);
    const data = await response.json();
    return data;
  };
  
  useEffect (()=>{
    getData();
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
