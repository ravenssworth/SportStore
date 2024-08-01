import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './CreateProduct.css'

function CreateProduct({ categories, onProductAdded }) {
	const [selectedCategory, setSelectedCategory] = useState('')
	const [file, setFile] = useState(null)
	const [showForm, setShowForm] = useState(false)

	const handleFileChange = event => {
		setFile(event.target.files[0])
	}

	const handleSubmit = async event => {
		event.preventDefault()
		const formData = new FormData()
		formData.append('image', file)
		formData.append(
			'entity',
			new Blob(
				[
					JSON.stringify({
						productName: event.target.name.value,
						productDescription: event.target.description.value,
						price: event.target.price.value,
						stock: event.target.stock.value,
						categoryId: selectedCategory,
					}),
				],
				{ type: 'application/json' }
			)
		)

		try {
			const response = await axios.post(
				'http://localhost:8080/api/products',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)
			console.log('Product created successfully:', response.data)
			if (onProductAdded) {
				onProductAdded(response.data)
			}
			setShowForm(false)
		} catch (error) {
			if (error.response && error.response.status === 400) {
				alert(
					'Product with the same name already exists. Please choose a different name.'
				)
			} else {
				console.error('Failed to create product:', error)
			}
		}
	}
	const handleAddProduct = () => {
		setShowForm(true)
	}

	return (
		<div className='createProduct'>
			{showForm ? (
				<div className='product-container'>
					<form onSubmit={handleSubmit}>
						<div className='form-group'>
							<label htmlFor='name'>Название</label>
							<input type='text' id='name' name='name' required />
						</div>
						<div className='form-group'>
							<label htmlFor='description'>Описание</label>
							<input type='text' id='description' name='description' required />
						</div>
						<div className='form-group'>
							<label htmlFor='price'>Цена</label>
							<input type='text' id='price' name='price' required />
						</div>
						<div className='form-group'>
							<label htmlFor='stock'>Количество</label>
							<input type='text' id='stock' name='stock' required />
						</div>
						<div className='form-group'>
							<label htmlFor='category'>Категория</label>
							<select
								id='category'
								name='category'
								value={selectedCategory}
								onChange={e => setSelectedCategory(e.target.value)}
								required
							>
								<option value='' disabled>
									Выберите категорию
								</option>
								{categories.map(category => (
									<option key={category.id} value={category.id}>
										{category.categoryName}
									</option>
								))}
							</select>
						</div>
						<div className='form-group-image'>
							<label className='form-group-label-product'>Изображение</label>
							<label htmlFor='image'>Выберите изображение</label>
							<input
								type='file'
								id='image'
								name='image'
								accept='image/*'
								onChange={handleFileChange}
								required
							/>
						</div>
						<div className='button-container'>
							<button type='submit'>Добавить</button>
							<button type='button' onClick={() => setShowForm(false)}>
								Отмена
							</button>
						</div>
					</form>
				</div>
			) : (
				<button onClick={handleAddProduct} className='add-category-button'>
					Добавить продукт
				</button>
			)}
		</div>
	)
}

export default CreateProduct
