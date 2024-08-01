import React, { useState } from 'react'
import axios from 'axios'
import './CreateCategory.css'

function CreateCategory({ onCategoryAdded }) {
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [showForm, setShowForm] = useState(false)

	const handleSubmit = async event => {
		event.preventDefault()
		try {
			const response = await axios.post(
				'http://localhost:8080/api/categories',
				{
					categoryName: name,
					categoryDescription: description,
				}
			)
			console.log('Category created successfully:', response.data)
			setName('')
			setDescription('')
			setShowForm(false)
			if (onCategoryAdded) {
				onCategoryAdded(response.data)
			}
		} catch (error) {
			console.error('There was an error creating the category:', error)
		}
	}

	const handleAddCategory = () => {
		setShowForm(true)
	}

	return (
		<div className='create-category-container'>
			{showForm ? (
				<div className='form-container'>
					<form onSubmit={handleSubmit}>
						<div className='form-group'>
							<label htmlFor='name'>Название</label>
							<input
								type='text'
								id='name'
								value={name}
								onChange={e => setName(e.target.value)}
								required
							/>
						</div>
						<div className='form-group'>
							<label htmlFor='description'>Описание</label>
							<input
								type='text'
								id='description'
								value={description}
								onChange={e => setDescription(e.target.value)}
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
				<button onClick={handleAddCategory} className='add-category-button'>
					Добавить категорию
				</button>
			)}
		</div>
	)
}

export default CreateCategory
