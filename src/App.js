import logo from './logo.svg';
import './App.css';
import Globe from 'react-globe.gl';

import { useEffect, useState } from "react";
const API_URL = "https://aseevia.github.io/star-wars-frontend/data/secret.json";

function App() {
  const [decodedMessage, setDecodedMessage] = useState(null);
  const [worldData, setWorldData] = useState([]);

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
  },[]);
  
  
  return (
    <div className="App">
<div style={{ width: '100vw', height: '100vh' }}>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        pointsData={worldData}
        pointLat="lat"
        pointLng="long"
        pointColor={() => 'red'}
        pointAltitude={0}
        pointRadius={1.005}
      />
    </div>
    </div>
  );
}

export default App;
