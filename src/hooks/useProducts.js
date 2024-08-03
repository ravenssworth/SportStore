import { useState, useEffect } from 'react'
import axios from 'axios'

const useProducts = () => {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const fetchProducts = async () => {
		try {
			const response = await axios.post(
				'http://localhost:8080/api/products/all?page=0&size=10&sort=name',
				{}
			)
			setProducts(response.data.content)
		} catch (error) {
			setError('Failed to fetch products')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchProducts()
	}, [])

	return { products, loading, error, setProducts }
}

export default useProducts
