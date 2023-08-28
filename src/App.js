import logo from './logo.svg';
import marker from './marker.svg';
import './App.css';
import Globe from 'react-globe.gl';
import * as geolib from 'geolib';
import Modal from "./Modal.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';


import { useEffect, useState, useCallback} from "react";
const API_URL = "https://aseevia.github.io/star-wars-frontend/data/secret.json";
const ADDITIONAL_INFO_URL = "https://akabab.github.io/starwars-api/api/id/";
const MAP_CENTER = { lat: 0, lng: 0, altitude: 1.5 };

function App() {
  const [worldData, setWorldData] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [sortedData, setSortedData] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [starDestroyerModel, setStarDestroyerModel] = useState(null);

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
    //console.log(worldData);
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
    //console.log(sortedData);
  };  
  
const calcDistance = (lat1, lon1, lat2, lon2) => {   
    const distance = geolib.getDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
    );
    return distance; 
  };
  
  const createPinElement = () => {
    const elem = document.createElement('div');
    elem.innerHTML = '<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%;"></div>';
    return elem;
  };
  
  const renderSortedData = () => {
    if (sortedData.length === 0 || !selectedPoint) {
      return <div>Click on the globe to find the closest target to your location.</div>;
    }
  
    return (
    <div className="sorted-data-list">
      {sortedData.map((data, index) => (
        <div 
          key={index} className="data-box" onClick={() => openModal(data)}>
            <div className="data-name">{data.name}</div>
            <img src={data.image} alt={data.name} className="data-image" />
            <div className="data-distance">
              {(calcDistance(data.lat, data.long, selectedPoint.lat, selectedPoint.lng)/1000).toFixed(1)} km
            </div>
        </div>
      ))}
    </div>
    );
  };
  
  const openModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
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

  useEffect(() => {
    const loader = new GLTFLoader();
    
    loader.load('./models/sd.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(2, 2, 2); 
      model.position.set(200.3, 50.5, -50); 
      setStarDestroyerModel(model);
      });
  }, []);
  
  
  return (
    <div className="App">
    <div className="globe-container" style={{ width: '100vw', height: '100vh' }}>
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
        width={width+100} //this library is not responsive otherwise!
        height={height+100}
        showAtmosphere={true}
        atmosphereColor={"blue"}
        atmosphereAltitude={0.3}
        htmlElementsData={selectedPoint? [selectedPoint] : []}
        htmlLat={d => d.lat}
        htmlLng={d => d.lng}
        htmlAltitude={0.05}
        htmlElement={d => {
          const el = document.createElement('div');
          el.innerHTML = `<img src="${marker}" alt="marker" style="width: 30px; height: auto; color: red;" />`;
          return el;
        }}        
        htmlTransitionDuration={1000}
        customLayerData={starDestroyerModel ? [{}] : []} // empty array if model not yet loaded
        customThreeObject={() => starDestroyerModel}
        onGlobeClick={handlePointClick}
        
      />
    </div>
    
    <div className="sorted-data-container">
      {renderSortedData()}
    </div>
    
    {isModalOpen && <Modal data={modalData} closeModal={() => setIsModalOpen(false)} />}

    </div>
  );
}

export default App;
