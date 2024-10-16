import { useState, useEffect } from 'react'
import axios from 'axios'

const useOrders = (initialPage = 0, initialSize = 10) => {
	const [orders, setOrders] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [page, setPage] = useState(initialPage)
	const [size, setSize] = useState(initialSize)
	const [totalPages, setTotalPages] = useState(1) // Количество страниц

	const fetchOrders = async (page, size) => {
		setLoading(true)
		try {
			const response = await axios.post(
				`http://localhost:8080/api/orders/all?page=${page}&size=${size}&sort=id`,
				{
					userId: localStorage.getItem('userId'),
					status: 'PENDING',
				}
			)
			setOrders(response.data.content)
			setTotalPages(response.data.totalPages) // Обновляем общее количество страниц
		} catch (error) {
			setError('Не удалось получить заказы')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchOrders(page, size)
	}, [page, size]) // Запрос обновляется при изменении страницы или размера

	return {
		orders,
		loading,
		error,
		page,
		setPage,
		size,
		setSize,
		totalPages,
	}
}

export default useOrders
