import { useState, useEffect } from 'react'
import axios from 'axios'

const useProducts = () => {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [productImages, setProductImages] = useState({})

	const fetchProducts = async () => {
		try {
			const response = await axios.post(
				'http://localhost:8080/api/products/all?page=0&size=10&sort=productName',
				{},
				{
					headers: {
						'Content-Type': 'application/json',
						Currency: 'RUB', // Ваш пользовательский заголовок
						Discount: 'true',
					},
				}
			)
			setProducts(response.data.content)
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
		fetchProducts()
	}, [])

	return { products, productImages, loading, error, setProducts }
}

export default useProducts
