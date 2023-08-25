import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";
const API_URL = "https://aseevia.github.io/star-wars-frontend/data/secret.json";

function App() {
  const [decodedMessage, setDecodedMessage] = useState(null);

  const getSecret = async () => {
    const response = await fetch(`${API_URL}`);
    const data = await response.json();
    const base64Decoded = atob(data.message);
    setDecodedMessage(base64Decoded);
    console.log('Base64 Decoded:', base64Decoded);

  }		
  useEffect (()=>{
    getSecret();
  },[]);
  
  
  return (
    <div className="App">
      <h1>Star Wars Secret Decoder</h1>
      <p>Decoded message: {decodedMessage}</p>
    </div>
  );
}

export default App;
