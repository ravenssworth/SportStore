import { useState, useEffect } from 'react'
import axios from 'axios'

const useCategories = () => {
	const [categories, setCategories] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const fetchCategories = async () => {
		try {
			const response = await axios.post(
				'http://localhost:8080/api/categories/all?page=0&size=10&sort=categoryName',
				{}
			)
			setCategories(response.data.content)
		} catch (error) {
			setError('Failed to fetch categories')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchCategories()
	}, [])

	return { categories, loading, error, setCategories }
}

export default useCategories
