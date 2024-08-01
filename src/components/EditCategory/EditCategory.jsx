import React, { useState } from 'react'
import axios from 'axios'
import './EditCategory.css'

function EditCategory({ onCategoryUpdated }) {
	const [categoryId, setCategoryId] = useState('') // ID категории для редактирования
	const [categoryData, setCategoryData] = useState({
		id: '',
		categoryName: '',
		categoryDescription: '',
	}) // Данные категории
	const [isLoaded, setIsLoaded] = useState(false) // Флаг загрузки данных
	const [loading, setLoading] = useState(false) // Флаг загрузки при отправке
	const [error, setError] = useState(null) // Ошибка
	const [showForm, setShowForm] = useState(false) // Управление отображением формы

	// Функция для загрузки данных категории
	const loadCategoryData = async () => {
		try {
			setLoading(true)
			const response = await axios.get(
				`http://localhost:8080/api/categories/${categoryId}`
			)
			setCategoryData(response.data)
			setIsLoaded(true)
			setError(null) // Сброс ошибки
		} catch (error) {
			console.error('Error loading category data:', error)
			setError('Не удалось загрузить данные категории.')
			setIsLoaded(false)
		} finally {
			setLoading(false)
		}
	}

	// Функция для обработки изменения формы
	const handleChange = event => {
		const { name, value } = event.target
		setCategoryData(prevData => ({
			...prevData,
			[name]: value,
		}))
	}

	// Функция для отправки измененных данных
	const handleSubmit = async event => {
		event.preventDefault()
		try {
			setLoading(true)
			const response = await axios.put(
				`http://localhost:8080/api/categories/${categoryData.id}`,
				categoryData
			)
			onCategoryUpdated(response.data)
			alert('Category updated successfully')
			setError(null) // Сброс ошибки
			setShowForm(false) // Закрыть форму после успешного обновления
		} catch (error) {
			console.error('Error updating category:', error)
			setError('Не удалось обновить категорию.')
		} finally {
			setLoading(false)
		}
	}

	const handleEditCategory = () => {
		setShowForm(true)
	}

	return (
		<div className='edit-category-container'>
			{showForm ? (
				<div className='form-container'>
					<form onSubmit={handleSubmit}>
						<div className='form-group'>
							<label htmlFor='categoryId'>ID категории:</label>
							<input
								type='text'
								id='categoryId'
								value={categoryId}
								onChange={e => setCategoryId(e.target.value)}
								required
							/>
							<button
								type='button'
								onClick={loadCategoryData}
								disabled={loading || !categoryId}
							>
								{loading ? 'Загрузка...' : 'Загрузить данные категории'}
							</button>
						</div>
						{error && <p className='error'>{error}</p>}
						{isLoaded && (
							<>
								<div className='form-group'>
									<label htmlFor='categoryName'>Название категории:</label>
									<input
										type='text'
										id='categoryName'
										name='categoryName'
										value={categoryData.categoryName}
										onChange={handleChange}
										disabled={loading}
									/>
								</div>
								<div className='form-group'>
									<label htmlFor='categoryDescription'>
										Описание категории:
									</label>
									<input
										type='text'
										id='categoryDescription'
										name='categoryDescription'
										value={categoryData.categoryDescription}
										onChange={handleChange}
										disabled={loading}
									/>
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
				<button onClick={handleEditCategory} className='edit-category-button'>
					Редактировать категорию
				</button>
			)}
		</div>
	)
}

export default EditCategory
