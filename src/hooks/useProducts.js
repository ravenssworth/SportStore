import { useState, useEffect } from 'react'
import axios from 'axios'

const useProducts = (initialPage = 0, initialSize = 10) => {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [productImages, setProductImages] = useState({})
	const [page, setPage] = useState(initialPage)
	const [size, setSize] = useState(initialSize)
	const [totalPages, setTotalPages] = useState(1) // Количество страниц

	const fetchProducts = async (page, size) => {
		setLoading(true)
		try {
			const response = await axios.post(
				`http://localhost:8080/api/products/all?page=${page}&size=${size}&sort=productName`,
				{},
				{
					headers: {
						'Content-Type': 'application/json',
						Currency: 'RUB',
						Discount: 'true',
					},
				}
			)
			setProducts(response.data.content)
			setTotalPages(response.data.totalPages) // Обновляем общее количество страниц

			// Получение изображений для всех продуктов
			const imageResponses = await Promise.all(
				response.data.content.map(product =>
					axios.get(`http://localhost:8080/api/images/all?id=${product.id}`)
				)
			)
			const images = imageResponses.reduce((acc, curr, index) => {
				const productId = response.data.content[index].id
				const imageArray = curr.data.content || []
				const formattedImages = imageArray.map(imageObj => ({
					src: `data:image/jpeg;base64,${imageObj.image}`,
				}))
				acc[productId] = formattedImages
				return acc
			}, {})
			setProductImages(images)
		} catch (error) {
			setError('Failed to fetch products')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchProducts(page, size)
	}, [page, size])

	return {
		products,
		productImages,
		loading,
		error,
		page,
		setPage,
		size,
		setSize,
		totalPages,
		setProducts,
	}
}

export default useProducts
