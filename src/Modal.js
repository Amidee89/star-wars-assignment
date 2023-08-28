import React from 'react';

const Modal = ({ data, closeModal }) => {
  return (
	<div className="modal-background" onClick={closeModal}>
	  <div className="modal-content" onClick={e => e.stopPropagation()}>
		<button onClick={closeModal} className="modal-close-button">X</button>
		<h2>{data.name}</h2>
		<div className="modal-flex-container">
		  <img src={data.image} alt={data.name} className="modal-image" />
		  <div className="modal-details">
			<div><strong>Position:</strong></div>
			<div>Lat: {data.lat.toFixed(4)}</div>
			<div>Long: {data.long.toFixed(4)}</div><br />
			<div><strong>Data:</strong></div>
			<div>Height: {data.height} m</div>
			<div>Weight: {data.mass} kg</div>
			<div>Homeworld: {data.homeworld ? data.homeworld : "Unknown"}</div>
			<div>Species: {data.species}</div><br />

			<div><a href={data.wiki}>Wikia page</a></div>
			
		  </div>
		</div>
	  </div>
	</div>
  );
};


export default Modal;
