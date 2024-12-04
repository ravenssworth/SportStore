import React, { useState, useEffect } from 'react'
import './ProductsList.css'
import DeleteButton from '../DeleteButton/DeleteButton.jsx'
import axios from 'axios'
import ImageModal from '../ImageModal/ImageModal.jsx'
import Input from '../Input/Input'

function ProductsList({ products, onDeleteProduct, searchedId }) {
	const [productImages, setProductImages] = useState({})
	const [selectedProductImages, setSelectedProductImages] = useState([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false)

	const filteredProducts = searchedId
		? products.filter(product => product.id.toString() === searchedId)
		: products

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

	const handleAddDiscount = async productId => {
		try {
			await axios.put(
				`http://localhost:8080/api/products/discount/${productId}`
			)
			// Обновить данные о продукте после добавления скидки
			const updatedProducts = products.map(product => {
				if (product.id === productId) {
					return {
						...product,
						discount: true,
					}
				}
				return product
			})
			setProducts(updatedProducts)
		} catch (error) {
			console.error('Failed to add discount:', error)
		}
	}
	const openDiscountModal = () => {
		setIsDiscountModalOpen(true)
	}

	const openModal = productId => {
		setSelectedProductImages(productImages[productId] || [])
		setIsModalOpen(true)
	}

	const closeModalDiscount = () => {
		setIsDiscountModalOpen(false)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setSelectedProductImages([])
	}

	if (products.length === 0) {
		return <p>Продукты не найдены</p>
	}

	return (
		<div className='products-list-container'>
			{filteredProducts.length > 0 ? (
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
						{filteredProducts.map(product => (
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
								<td>
									<div className='products-list-container__actions-container'>
										<DeleteButton onClick={() => onDeleteProduct(product.id)} />
										<input
											type='file'
											onChange={event => handleFileChange(product.id, event)}
											id={`file-input-${product.id}`}
										/>
										<label
											htmlFor={`file-input-${product.id}`}
											className='actions-container__file-input'
										>
											<svg
												width='40px'
												height='25px'
												viewBox='0 0 24 24'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													d='M14.2647 15.9377L12.5473 14.2346C11.758 13.4519 11.3633 13.0605 10.9089 12.9137C10.5092 12.7845 10.079 12.7845 9.67922 12.9137C9.22485 13.0605 8.83017 13.4519 8.04082 14.2346L4.04193 18.2622M14.2647 15.9377L14.606 15.5991C15.412 14.7999 15.8149 14.4003 16.2773 14.2545C16.6839 14.1262 17.1208 14.1312 17.5244 14.2688C17.9832 14.4253 18.3769 14.834 19.1642 15.6515L20 16.5001M14.2647 15.9377L18.22 19.9628M11 4H7.2C6.07989 4 5.51984 4 5.09202 4.21799C4.7157 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.0799 4 7.2V16.8C4 17.4466 4 17.9066 4.04193 18.2622M4.04193 18.2622C4.07264 18.5226 4.12583 18.7271 4.21799 18.908C4.40973 19.2843 4.7157 19.5903 5.09202 19.782C5.51984 20 6.07989 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V13M15 5.28571L16.8 7L21 3'
													stroke='#B5BAC1'
													strokeWidth='2'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
											</svg>
										</label>
										<input type='submit' />
										<button
											id='images-delete'
											className='actions-container__delete-button'
											onClick={() => openModal(product.id)}
										>
											<svg
												width='40px'
												height='25px'
												viewBox='0 0 24 24'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
												className='bin'
											>
												<path
													d='M14.2647 15.9377L12.5473 14.2346C11.758 13.4519 11.3633 13.0605 10.9089 12.9137C10.5092 12.7845 10.079 12.7845 9.67922 12.9137C9.22485 13.0605 8.83017 13.4519 8.04082 14.2346L4.04193 18.2622M14.2647 15.9377L14.606 15.5991C15.412 14.7999 15.8149 14.4003 16.2773 14.2545C16.6839 14.1262 17.1208 14.1312 17.5244 14.2688C17.9832 14.4253 18.3769 14.834 19.1642 15.6515L20 16.5001M14.2647 15.9377L18.22 19.9628M12 4H7.2C6.07989 4 5.51984 4 5.09202 4.21799C4.7157 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.0799 4 7.2V16.8C4 17.4466 4 17.9066 4.04193 18.2622M4.04193 18.2622C4.07264 18.5226 4.12583 18.7271 4.21799 18.908C4.40973 19.2843 4.7157 19.5903 5.09202 19.782C5.51984 20 6.07989 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12M16 3L18.5 5.5M18.5 5.5L21 8M18.5 5.5L21 3M18.5 5.5L16 8'
													stroke='#B5BAC1'
													strokeWidth='2'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
											</svg>
										</button>
										<button
											type='submit'
											className='actions-container__add-discount-button'
											onClick={() => openDiscountModal(product.id)}
										>
											<svg
												width='40px'
												height='25px'
												viewBox='-0.5 0 25 25'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													d='M18 3.91992H6C3.79086 3.91992 2 5.71078 2 7.91992V17.9199C2 20.1291 3.79086 21.9199 6 21.9199H18C20.2091 21.9199 22 20.1291 22 17.9199V7.91992C22 5.71078 20.2091 3.91992 18 3.91992Z'
													stroke='#B5BAC1'
													strokeWidth='1.5'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
												<path
													d='M7 17.9199L17 7.91992'
													stroke='#B5BAC1'
													strokeWidth='1.5'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
												<path
													d='M8 11.9199C9.10457 11.9199 10 11.0245 10 9.91992C10 8.81535 9.10457 7.91992 8 7.91992C6.89543 7.91992 6 8.81535 6 9.91992C6 11.0245 6.89543 11.9199 8 11.9199Z'
													stroke='#B5BAC1'
													strokeWidth='1.5'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
												<path
													d='M16 17.9199C17.1046 17.9199 18 17.0245 18 15.9199C18 14.8154 17.1046 13.9199 16 13.9199C14.8954 13.9199 14 14.8154 14 15.9199C14 17.0245 14.8954 17.9199 16 17.9199Z'
													stroke='#B5BAC1'
													strokeWidth='1.5'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
											</svg>
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>
					На этой странице продукт не найден, попробуйте выполнить глобальный
					поиск.
				</p>
			)}

			{isModalOpen && (
				<ImageModal
					images={selectedProductImages}
					onClose={closeModal}
					onDeleteImage={handleDeleteImage}
				/>
			)}
			{isDiscountModalOpen && (
				<div className='products-list-container__modal-overlay'>
					<div className='products-list-container__modal-overlay__content'>
						<button
							className='products-list-container__modal-overlay__content__close-button'
							onClick={closeModalDiscount}
						>
							<svg
								width='40px'
								height='25px'
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									fillRule='evenodd'
									clipRule='evenodd'
									d='M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z'
									fill='#0F1729'
								/>
							</svg>
						</button>
						<div className='products-list-container__modal-overlay__content__input'>
							<Input
								// id='categoryDescription'
								// value={categoryData.categoryDescription}

								// onChange={handleChange}
								// name='categoryDescription'
								// disabled={loading}
								placeholder='Введите размер скидки'
							/>
							<button className='products-list-container__modal-overlay__content__add-button'>
								Добавить скидку
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default ProductsList
