import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './EditProduct.css'
import Input from '../Input/Input'

function EditProduct({ categories, onProductUpdated }) {
	const [productId, setProductId] = useState('') // ID продукта для редактирования
	const [productData, setProductData] = useState({
		id: '',
		productName: '',
		productDescription: '',
		price: '',
		stock: '',
		categoryDTO: {},
	}) // Данные продукта
	const [isLoaded, setIsLoaded] = useState(false) // Флаг загрузки данных
	const [loading, setLoading] = useState(false) // Флаг загрузки при отправке
	const [error, setError] = useState(null) // Ошибка
	const [showForm, setShowForm] = useState(false) // Управление отображением формы

	// Функция для загрузки данных продукта
	const loadProductData = async () => {
		try {
			setLoading(true)
			const response = await axios.get(
				`http://localhost:8080/api/products/${productId}`
			)
			setProductData(response.data)
			setIsLoaded(true)
			setError(null) // Сброс ошибки
		} catch (error) {
			console.error('Ошибка при загрузке данных о продукте:', error)
			setError('Не удалось загрузить данные продукта.')
			setIsLoaded(false)
		} finally {
			setLoading(false)
		}
	}

	// Функция для обработки изменения формы
	const handleChange = event => {
		const { name, value } = event.target
		setProductData(prevData => ({
			...prevData,
			[name]: value,
		}))
	}

	// Функция для обработки изменения категории
	const handleCategoryChange = event => {
		const selectedCategory = categories.find(
			category => category.id === parseInt(event.target.value)
		)
		setProductData(prevData => ({
			...prevData,
			categoryDTO: selectedCategory,
		}))
	}

	const handleSubmit = async event => {
		event.preventDefault()

		try {
			const editProduct = {
				productName: productData.productName, // Использование productData.productName
				productDescription: productData.productDescription, // Использование productData.productDescription
				price: productData.price, // Использование productData.price
				stock: productData.stock, // Использование productData.stock
				categoryId: productData.categoryDTO.id, // Использование productData.categoryDTO.id
			}

			const response = await axios.put(
				`http://localhost:8080/api/products/${productData.id}`,
				editProduct
			)
			console.log('Продукт успешно обновлен', response.data)
			if (onProductUpdated) {
				onProductUpdated(response.data)
			}
			setShowForm(false)
		} catch (error) {
			if (error.response && error.response.status === 400) {
				alert(
					'Продукт с таким названием уже существует. Пожалуйста, выберите другое название.'
				)
			} else {
				console.error('Не удалось обновить продукт:', error)
			}
		}
	}

	const handleEditProduct = () => {
		setShowForm(true)
	}

	return (
		<div className='edit-product-container'>
			{showForm ? (
				<div className='form-container'>
					<form onSubmit={handleSubmit}>
						<div className='form-group'>
							<Input
								id='text'
								value={productId}
								placeholder='ID продукта'
								onChange={e => setProductId(e.target.value)}
							/>
							<button
								className='edit-product-container__loading-button'
								type='button'
								onClick={loadProductData}
								disabled={loading || !productId}
							>
								Загрузить данные продукта
							</button>
						</div>
						{error && <p className='error'>{error}</p>}
						{isLoaded && (
							<>
								<div className='form-group'>
									<Input
										id='productName'
										name='productName'
										value={productData.productName}
										onChange={handleChange}
										disabled={loading}
										placeholder='Название продукта'
									/>
								</div>
								<div className='form-group'>
									<Input
										id='productDescription'
										name='productDescription'
										value={productData.productDescription}
										onChange={handleChange}
										disabled={loading}
										placeholder='Описание продукта'
									/>
								</div>
								<div className='form-group'>
									<input
										type='number'
										id='price'
										name='price'
										value={productData.price}
										onChange={handleChange}
										disabled={loading}
										placeholder='Цена'
									/>
								</div>
								<div className='form-group'>
									<input
										type='number'
										id='stock'
										name='stock'
										value={productData.stock}
										onChange={handleChange}
										disabled={loading}
										placeholder='Количество'
									/>
								</div>
								<div className='form-group'>
									<label htmlFor='category'>Категория:</label>
									<select
										id='category'
										name='category'
										value={productData.categoryDTO.id}
										onChange={handleCategoryChange}
										disabled={loading}
									>
										<option value=''>Выберите категорию</option>
										{categories.map(category => (
											<option key={category.id} value={category.id}>
												{category.categoryName}
											</option>
										))}
									</select>
								</div>

								<div className='button-container'>
									<button type='submit' disabled={loading}>
										{loading ? 'Сохранение...' : 'Сохранить изменения'}
									</button>
									<button
										type='button'
										onClick={() => setShowForm(false)}
										disabled={loading}
									>
										Отмена
									</button>
								</div>
							</>
						)}
					</form>
				</div>
			) : (
				<button onClick={handleEditProduct} class='edit-button'>
					<svg className='edit-svgIcon' viewBox='0 0 512 512'>
						<path d='M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z'></path>
					</svg>
				</button>
			)}
		</div>
	)
}

export default EditProduct
