import React, { useState, useEffect } from 'react'
import './ProductsList.css'
import DeleteButton from '../DeleteButton/DeleteButton.jsx'
import axios from 'axios'
import ImageModal from '../ImageModal/ImageModal.jsx'

function ProductsList({ products, onDeleteProduct }) {
	const [productImages, setProductImages] = useState({})
	const [selectedProductImages, setSelectedProductImages] = useState([])
	const [isModalOpen, setIsModalOpen] = useState(false)

	// Функция для получения всех изображений для продукта
	const fetchAllImages = async productId => {
		try {
			const response = await axios.get(
				`http://localhost:8080/api/images/all?id=${productId}`
			)
			// Предполагается, что response.data содержит массив байт-кодов изображений
			const images = response.data.content || []
			const formattedImages = images.map(imageObj => ({
				id: imageObj.id,
				src: `data:image/jpeg;base64,${imageObj.image}`, // Преобразование байт-кода в строку base64
			}))

			setProductImages(prevImages => ({
				...prevImages,
				[productId]: formattedImages,
			}))
		} catch (error) {
			console.error('Failed to fetch images:', error)
		}
	}

	useEffect(() => {
		products.forEach(product => {
			fetchAllImages(product.id)
		})
	}, [products])

	const handleFileChange = async (productId, event) => {
		const file = event.target.files[0]
		if (file) {
			const formData = new FormData()
			formData.append('image', file)

			try {
				await axios.post(
					`http://localhost:8080/api/images/${productId}`,
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					}
				)
				fetchAllImages(productId) // Обновляем изображения после загрузки
			} catch (error) {
				console.error('Failed to upload image:', error.response || error)
			}
		}
	}
	const handleDeleteImage = async imageId => {
		try {
			await axios.delete(`http://localhost:8080/api/images/${imageId}`)
			// Обновить изображения после удаления
			const updatedImages = selectedProductImages.filter(
				image => image.id !== imageId
			)
			setSelectedProductImages(updatedImages)
			setProductImages(prevImages => {
				const newImages = { ...prevImages }
				Object.keys(newImages).forEach(productId => {
					newImages[productId] = newImages[productId].filter(
						image => image.id !== imageId
					)
				})
				return newImages
			})
		} catch (error) {
			console.error('Failed to delete image:', error)
		}
	}

	const openModal = productId => {
		setSelectedProductImages(productImages[productId] || [])
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setSelectedProductImages([])
	}

	if (products.length === 0) {
		return <p>No products found</p>
	}

	return (
		<div className='products-list-container'>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Название продукта</th>
						<th>Описание продукта</th>
						<th>Цена</th>
						<th>Количество</th>
						<th>Категория</th>
						<th>Изображения</th>
						<th>Действия</th>
					</tr>
				</thead>
				<tbody>
					{products.map(product => (
						<tr key={product.id}>
							<td>{product.id}</td>
							<td>{product.productName}</td>
							<td>{product.productDescription}</td>
							<td>{product.price}</td>
							<td>{product.stock}</td>
							<td>{product.categoryDTO.categoryName}</td>
							<td>
								{productImages[product.id] &&
								productImages[product.id].length > 0 ? (
									<div>
										{productImages[product.id].map((image, index) => (
											<img
												key={index}
												src={image.src} // Используем строку base64
												alt={`Product ${product.id} Image ${index}`}
											/>
										))}
									</div>
								) : (
									<span>Нет изображений</span>
								)}
							</td>
							<td className='actions-container'>
								<DeleteButton onClick={() => onDeleteProduct(product.id)} />
								<input
									type='file'
									onChange={event => handleFileChange(product.id, event)}
									id={`file-input-${product.id}`}
								/>
								<label htmlFor={`file-input-${product.id}`}>
									<svg
										width='40px'
										height='25px'
										viewBox='0 0 24 24'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
										className='bin'
									>
										<path
											d='M14.2647 15.9377L12.5473 14.2346C11.758 13.4519 11.3633 13.0605 10.9089 12.9137C10.5092 12.7845 10.079 12.7845 9.67922 12.9137C9.22485 13.0605 8.83017 13.4519 8.04082 14.2346L4.04193 18.2622M14.2647 15.9377L14.606 15.5991C15.412 14.7999 15.8149 14.4003 16.2773 14.2545C16.6839 14.1262 17.1208 14.1312 17.5244 14.2688C17.9832 14.4253 18.3769 14.834 19.1642 15.6515L20 16.5001M14.2647 15.9377L18.22 19.9628M11 4H7.2C6.07989 4 5.51984 4 5.09202 4.21799C4.7157 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.0799 4 7.2V16.8C4 17.4466 4 17.9066 4.04193 18.2622M4.04193 18.2622C4.07264 18.5226 4.12583 18.7271 4.21799 18.908C4.40973 19.2843 4.7157 19.5903 5.09202 19.782C5.51984 20 6.07989 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V13M15 5.28571L16.8 7L21 3'
											stroke='#B5BAC1'
											stroke-width='2'
											stroke-linecap='round'
											stroke-linejoin='round'
										/>
									</svg>
								</label>
								<input type='submit' id='images-delete' />
								<label
									htmlFor='images-delete'
									className='delete-label'
									onClick={() => openModal(product.id)}
								>
									<svg
										width='40px'
										s
										height='25px'
										viewBox='0 0 24 24'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
										className='bin'
									>
										<path
											d='M14.2647 15.9377L12.5473 14.2346C11.758 13.4519 11.3633 13.0605 10.9089 12.9137C10.5092 12.7845 10.079 12.7845 9.67922 12.9137C9.22485 13.0605 8.83017 13.4519 8.04082 14.2346L4.04193 18.2622M14.2647 15.9377L14.606 15.5991C15.412 14.7999 15.8149 14.4003 16.2773 14.2545C16.6839 14.1262 17.1208 14.1312 17.5244 14.2688C17.9832 14.4253 18.3769 14.834 19.1642 15.6515L20 16.5001M14.2647 15.9377L18.22 19.9628M12 4H7.2C6.07989 4 5.51984 4 5.09202 4.21799C4.7157 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.0799 4 7.2V16.8C4 17.4466 4 17.9066 4.04193 18.2622M4.04193 18.2622C4.07264 18.5226 4.12583 18.7271 4.21799 18.908C4.40973 19.2843 4.7157 19.5903 5.09202 19.782C5.51984 20 6.07989 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12M16 3L18.5 5.5M18.5 5.5L21 8M18.5 5.5L21 3M18.5 5.5L16 8'
											stroke='#B5BAC1'
											stroke-width='2'
											stroke-linecap='round'
											stroke-linejoin='round'
										/>
									</svg>
								</label>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{isModalOpen && (
				<ImageModal
					images={selectedProductImages}
					onClose={closeModal}
					onDeleteImage={handleDeleteImage}
				/>
			)}
		</div>
	)
}

export default ProductsList
