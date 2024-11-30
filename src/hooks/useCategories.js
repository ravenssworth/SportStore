import { useState, useEffect } from 'react'
import axios from 'axios'

const useCategories = (initialPage = 0, initialSize = 10) => {
	const [categories, setCategories] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [categoriesPage, setCategoriesPage] = useState(initialPage)
	const [categoriesSize, setCategoriesSize] = useState(initialSize)
	const [categoriesTotalPages, setCategoriesTotalPages] = useState(1)

	const fetchCategories = async (categoriesPage, categoriesSize) => {
		try {
			const response = await axios.post(
				`http://localhost:8080/api/categories/all?page=${categoriesPage}&size=${categoriesSize}&sort=categoryName`,
				{}
			)
			setCategories(response.data.content)
			setCategoriesTotalPages(response.data.totalPages) // Обновляем общее количество страниц
		} catch (error) {
			setError('Failed to fetch categories')
		} finally {
			setLoading(false)
		}
	}

	const searchCategoryById = async id => {
		setLoading(true)
		try {
			const response = await axios.get(
				`http://localhost:8080/api/categories/${id}`
			)
			if (response.data) {
				setCategories([response.data])
			}
		} catch (error) {
			setError('Не удалось получить категорию')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchCategories(categoriesPage, categoriesSize)
	}, [categoriesPage, categoriesSize])

	return {
		categories,
		loading,
		error,
		categoriesPage,
		setCategoriesPage,
		categoriesSize,
		setCategoriesSize,
		categoriesTotalPages,
		setCategories,
		searchCategoryById,
		fetchCategories,
	}
}

export default useCategories
