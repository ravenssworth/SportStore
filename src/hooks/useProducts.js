import { useState, useEffect } from 'react'
import axios from 'axios'

const useProducts = (
	initialPage = 0,
	initialSize = 10,
	initialCategory = null
) => {
	const [products, setProducts] = useState([])
	const [allProducts, setAllProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [productImages, setProductImages] = useState({})
	const [page, setPage] = useState(initialPage)
	const [size, setSize] = useState(initialSize)
	const [totalPages, setTotalPages] = useState(1)
	const [category, setCategory] = useState(initialCategory)

	const fetchAllProducts = async () => {
		try {
			const response = await axios.post(
				'http://localhost:8080/api/products/all',
				{}
			)
			const products = response.data.content

			const imageResponses = await Promise.all(
				products.map(product =>
					axios.get(`http://localhost:8080/api/images/all?id=${product.id}`)
				)
			)

			const productsWithImages = products.map((product, index) => ({
				...product,
				image: imageResponses[index]?.data?.content?.[0]?.image || null,
			}))

			setAllProducts(productsWithImages)
		} catch (error) {
			console.error('Error fetching products:', error)
		}
	}

	const fetchProducts = async (page, size, category) => {
		setLoading(true)
		try {
			const requestData = category ? { categoryId: category } : {}
			const response = await axios.post(
				`http://localhost:8080/api/products/all?page=${page}&size=${size}&sort=productName`,
				requestData,
				{
					headers: {
						'Content-Type': 'application/json',
						Currency: 'RUB',
						Discount: 'true',
					},
				}
			)
			setProducts(response.data.content)
			setTotalPages(response.data.totalPages)

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

	const searchProductById = async id => {
		setLoading(true)
		try {
			const response = await axios.get(
				`http://localhost:8080/api/products/${id}`
			)
			if (response.data) {
				setProducts([response.data])
			} else {
				setProducts([])
			}
		} catch (error) {
			setError('Failed to fetch products')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchProducts(page, size, category)
	}, [page, size, category])

	return {
		products,
		allProducts,
		productImages,
		loading,
		error,
		page,
		setPage,
		size,
		setSize,
		totalPages,
		setCategory,
		setProducts,
		searchProductById,
		fetchProducts,
		fetchAllProducts,
	}
}

export default useProducts
