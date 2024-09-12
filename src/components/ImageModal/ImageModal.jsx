// ImageModal.jsx
import React from 'react'
import './ImageModal.css'
import DeleteButton from '../DeleteButton/DeleteButton.jsx'

function ImageModal({ images, onClose, onDeleteImage }) {
	return (
		<div className='modal-overlay-image'>
			<div className='modal-content-image'>
				<div className='form-image-top'>
					<h2>Изображения продукта</h2>
					<button className='close-button-image' onClick={onClose}>
						<svg
							width='40px'
							height='25px'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								fill-rule='evenodd'
								clip-rule='evenodd'
								d='M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z'
								fill='#0F1729'
							/>
						</svg>
					</button>
				</div>

				<div className='image-grid'>
					{images.map((image, index) => (
						<div key={index} className='image-item'>
							<img src={image.src} alt={`Product Image ${index}`} />
							<DeleteButton
								onClick={() => onDeleteImage(image.id)}
							></DeleteButton>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default ImageModal
