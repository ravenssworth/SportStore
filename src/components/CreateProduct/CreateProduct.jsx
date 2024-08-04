import React, { useState } from 'react'
import axios from 'axios'
import './CreateProduct.css'
import Input from '../Input/Input'

function CreateProduct({ categories, onProductAdded }) {
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [price, setPrice] = useState('')
	const [stock, setStock] = useState('')
	const [selectedCategory, setSelectedCategory] = useState('')
	const [showForm, setShowForm] = useState(false)

	const handleSubmit = async event => {
		event.preventDefault()

		try {
			const newProduct = {
				productName: name,
				productDescription: description,
				price: price,
				stock: stock,
				categoryId: selectedCategory,
			}

			const response = await axios.post(
				'http://localhost:8080/api/products',
				newProduct
			)
			console.log('Product created successfully:', response.data)

			if (onProductAdded) {
				onProductAdded(response.data)
			}

			setShowForm(false)
		} catch (error) {
			console.error('Failed to create product:', error)
		}
	}

	const handleAddProduct = () => {
		setShowForm(true)
	}

	return (
		<div className='create-product'>
			{showForm ? (
				<div className='product-container'>
					<form onSubmit={handleSubmit}>
						<div className='form-group'>
							<Input
								id='name'
								value={name}
								placeholder='Название'
								onChange={e => setName(e.target.value)}
							/>
							<Input
								id='description'
								value={description}
								placeholder='Описание'
								onChange={e => setDescription(e.target.value)}
							/>
							<Input
								id='price'
								value={price}
								placeholder='Цена'
								onChange={e => setPrice(e.target.value)}
							/>
							<Input
								id='stock'
								value={stock}
								placeholder='Количество'
								onChange={e => setStock(e.target.value)}
							/>
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
				<button onClick={handleAddProduct} className='edit-button'>
					<svg
						width='25px'
						height='25px'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='edit-svgIcon'
					>
						<g id='Edit / Add_Plus'>
							<path
								id='Vector'
								d='M6 12H12M12 12H18M12 12V18M12 12V6'
								stroke='white'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</g>
					</svg>
				</button>
			)}
		</div>
	)
}

export default CreateProduct
