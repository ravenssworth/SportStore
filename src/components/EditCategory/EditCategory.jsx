import React, { useState } from 'react'
import axios from 'axios'
import './EditCategory.css'
import Input from '../Input/Input' // Импортируем компонент Input

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
		<div className={showForm ? 'edit-category active' : 'edit-category'}>
			{showForm ? (
				<div className='edit-category-container'>
					<form onSubmit={handleSubmit}>
						<div className='edit-category-container__form'>
							<Input
								id='categoryId'
								value={categoryId}
								placeholder='ID категории'
								onChange={e => setCategoryId(e.target.value)}
							/>
							<div className='edit-category-container__form__button-container'>
								<button
									className='edit-category__loading-button'
									type='button'
									onClick={loadCategoryData}
									disabled={loading || !categoryId}
								>
									{loading ? 'Загрузка...' : 'Загрузить данные категории'}
								</button>
								<button
									className='edit-category__cancel-button'
									onClick={() => {
										setShowForm(false)
										setCategoryId('')
									}}
								>
									Отмена
								</button>
							</div>
						</div>
						{error && <p className='error'>{error}</p>}
						{isLoaded && (
							<>
								<div className='edit-category-container__form__form-group'>
									<Input
										id='categoryName'
										value={categoryData.categoryName}
										placeholder='Название категории'
										onChange={handleChange}
										name='categoryName'
										disabled={loading}
									/>
								</div>
								<div className='edit-category-container__form__form-group'>
									<Input
										id='categoryDescription'
										value={categoryData.categoryDescription}
										placeholder='Описание категории'
										onChange={handleChange}
										name='categoryDescription'
										disabled={loading}
									/>
								</div>
								<div className='edit-category__button-container'>
									<button type='submit' disabled={loading}>
										{loading ? 'Сохранение...' : 'Сохранить изменения'}
									</button>
									<button
										type='button'
										onClick={() => {
											setShowForm(false)
											setIsLoaded(false)
											setCategoryId('')
										}}
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
				<button onClick={handleEditCategory} className='edit-category__button'>
					<svg className='edit-category-svgIcon' viewBox='0 0 512 512'>
						<path d='M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z'></path>
					</svg>
				</button>
			)}
		</div>
	)
}

export default EditCategory
