import React, { useState } from 'react'
import axios from 'axios'
import './CreateCategory.css'
import Input from '../Input/Input'

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
		<div className={showForm ? 'create-category active' : 'create-category'}>
			{showForm ? (
				<div className='form-container'>
					<form onSubmit={handleSubmit}>
						<div className='form-group'>
							<Input
								id='name'
								value={name}
								onChange={e => setName(e.target.value)}
								placeholder='Название'
							/>
						</div>
						<div className='form-group'>
							<Input
								id='description'
								value={description}
								onChange={e => setDescription(e.target.value)}
								placeholder='Описание'
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
					<svg
						width='25px'
						height='25px'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='create-category-svgIcon'
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

export default CreateCategory
