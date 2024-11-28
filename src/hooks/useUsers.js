import { useState, useEffect } from 'react'
import axios from 'axios'

const useUsers = (initialPage = 0, initialSize = 10) => {
	const [users, setUsers] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [page, setPage] = useState(initialPage)
	const [size, setSize] = useState(initialSize)
	const [totalPages, setTotalPages] = useState(1)

	const fetchUsers = async (page, size) => {
		setLoading(true)
		try {
			const response = await axios.post(
				`http://localhost:8080/api/users/all?page=${page}&size=${size}&sort=id`,
				{}
			)
			setUsers(response.data.content)
		} catch (error) {
			setError('Не удалось получить заказы')
		} finally {
			setLoading(false)
		}
	}

	const searchUserById = async id => {
		setLoading(true)
		try {
			const response = await axios.get(`http://localhost:8080/api/users/${id}`)
			console.log('Response from server:', response.data)
			if (response.data) {
				setUsers([response.data])
			} else {
				setUsers([])
			}
		} catch (error) {
			setError('Не удалось получить заказы')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchUsers(page, size)
	}, [page, size]) // Запрос обновляется при изменении страницы или размера

	return {
		users,
		loading,
		error,
		page,
		setPage,
		size,
		setSize,
		totalPages,
		searchUserById,
		fetchUsers,
	}
}

export default useUsers
