import logo from './logo.svg';
import './App.css';
import Globe from 'react-globe.gl';
import * as geolib from 'geolib';


import { useEffect, useState, useCallback} from "react";
const API_URL = "https://aseevia.github.io/star-wars-frontend/data/secret.json";
const ADDITIONAL_INFO_URL = "https://akabab.github.io/starwars-api/api/id/";
function App() {
  const [worldData, setWorldData] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [sortedData, setSortedData] = useState([]);
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
    setWorldData(updatedData);
  }		
  
  const getAdditionalData = async (id) => {
    const response = await fetch(`${ADDITIONAL_INFO_URL}${id}.json`);
    const data = await response.json();
    return data;
  };
  
  useEffect(() => {
    console.log(worldData);
  }, [worldData]);
  
const handlePointClick = useCallback(({ lat: lat, lng: lng }) => {
    setSelectedPoint({ lat, lng });
  }, []);
 
  
  
  useEffect(() => {
    sortData();
  }, [selectedPoint]);

  const sortData = () => {
    if (!selectedPoint) return;
    const sorted = [...worldData].sort((a, b) =>       
      calcDistance(a.lat, a.long, selectedPoint.lat, selectedPoint.lng) - 
      calcDistance(b.lat, b.long, selectedPoint.lat, selectedPoint.lng)
    );
    setSortedData(sorted);
    console.log(sortedData);
  };  
  
const calcDistance = (lat1, lon1, lat2, lon2) => {   
    const distance = geolib.getDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
    );
    return distance; 
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
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
        labelsData={worldData}
        labelLat={d => d.lat}
        labelLng={d => d.long}
        labelIncludeDot={true}
        labelDotRadius={.75}
        labelColor={() => 'rgba(255, 250, 255, 1)'}
        labelResolution={4}
        labelSize={.75}
        labelAltitude={.03}
        labelText={d => d.name}
        width={width} //this library is not responsive otherwise!
        height={height}
        showAtmosphere={true}
        atmosphereColor={"blue"}
        atmosphereAltitude={0.3}
        
        onGlobeClick={handlePointClick}
      />
    </div>

    </div>
  );
}

export default App;
