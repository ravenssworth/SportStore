import { useState, useEffect } from 'react'
import axios from 'axios'

const useOrders = (initialPage = 0, initialSize = 5, initialUserId = null) => {
	const [orders, setOrders] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [page, setPage] = useState(initialPage)
	const [size, setSize] = useState(initialSize)
	const [totalPages, setTotalPages] = useState(1)
	const [userId, setUserId] = useState(
		initialUserId || localStorage.getItem('userId')
	)

	const fetchOrders = async (overrideUserId = userId, page, size) => {
		setLoading(true)
		try {
			const response = await axios.post(
				`http://localhost:8080/api/orders/all?page=${page}&size=${size}&sort=id`,
				{
					userId: overrideUserId, // Используем либо переданный, либо текущий userId
				}
			)
			setOrders(response.data.content)
			setTotalPages(response.data.totalPages)
		} catch (error) {
			setError('Не удалось получить заказы')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		// При изменении userId, page или size обновляем данные
		fetchOrders(userId, page, size)
	}, [userId, page, size])

	return {
		orders,
		loading,
		error,
		page,
		setPage,
		size,
		setSize,
		totalPages,
		setUserId, // Позволяет изменить userId для модального окна
		fetchOrders, // Можно вручную вызывать для кастомных запросов
		setOrders,
	}
}

export default useOrders
