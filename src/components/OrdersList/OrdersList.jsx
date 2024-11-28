import { useState } from 'react'
import './OrdersList.css'
import useOrders from '../../hooks/useOrders'
import Pagination from '../../components/Pagination/Pagination.jsx'
import useProducts from '../../hooks/useProducts'
import axios from 'axios'
import SearchButton from '../../components/SearchButton/SearchButton.jsx'

function OrdersList({ users, searchedId }) {
	const {
		orders,
		size,
		page,
		setPage,
		totalPages,
		fetchOrders,
		setUserId,
		setSize,
		setOrders,
	} = useOrders()
	const { productImages } = useProducts()

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null)
	const [searchTerm, setSearchTerm] = useState('')

	const filteredUsers = searchedId
		? users.filter(user => user.id.toString() === searchedId)
		: users

	const filteredOrders = searchTerm
		? orders.filter(order => order.id.toString() === searchTerm)
		: orders

	const handleOpenModal = userId => {
		setSelectedUser(userId)
		setUserId(userId) // Переключаем userId на выбранного пользователя
		fetchOrders(userId, page, 5) // Загружаем данные для модального окна
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setSelectedUser(null)
		setUserId(localStorage.getItem('userId')) // Возвращаем userId на авторизованного пользователя
	}

	const statusTranslations = {
		PENDING: 'В ожидании',
		PROCESSING: 'В обработке',
		SHIPPED: 'Отправлен',
		DELIVERED: 'Доставлен',
		CANCELED: 'Отменен',
		REFUNDED: 'Возвращен',
	}

	const statuses = Object.keys(statusTranslations)

	const handleStatusChange = async (orderId, newStatus) => {
		try {
			const response = await axios.put(
				`http://localhost:8080/api/orders/${orderId}`,
				{
					status: newStatus,
				}
			)
			if (response.status === 200) {
				// Обновляем статус только в локальном состоянии
				setOrders(prevOrders =>
					prevOrders.map(order =>
						order.id === orderId ? { ...order, status: newStatus } : order
					)
				)
			} else {
				console.error('Ошибка при изменении статуса заказа')
			}
		} catch (error) {
			console.error('Ошибка при выполнении запроса:', error)
		}
	}

	const handleNextPage = () => {
		if (page < totalPages - 1) {
			setPage(page + 1)
		}
	}

	const handlePreviousPage = () => {
		if (page > 0) {
			setPage(page - 1)
		}
	}

	const handlePageSizeChange = event => {
		setSize(parseInt(event.target.value))
		setPage(0)
	}

	const handleSearchTermChange = term => {
		setSearchTerm(term)
	}

	return (
		<div className='orders-list-container'>
			{filteredUsers.length > 0 ? (
				<table>
					<thead>
						<tr>
							<th data-name='id'>ID пользователя</th>
							<th>Имя пользователя</th>
							<th>Роль</th>
							<th>Действия</th>
						</tr>
					</thead>
					<tbody>
						{filteredUsers.map(user => (
							<tr data-name='user-row' key={user.id}>
								<td>{user.id}</td>
								<td>{user.username}</td>
								<td>
									{user.roles[0] === 'ROLE_ADMIN'
										? 'Администратор'
										: 'Пользователь'}
								</td>
								<td>
									<button
										className='orders-list-container__button'
										onClick={() => handleOpenModal(user.id)}
									>
										<svg
											fill='#494646'
											xmlns='http://www.w3.org/2000/svg'
											width='25px'
											height='25px'
											viewBox='0 0 52 52'
											enableBackground='new 0 0 52 52'
											xmlSpace='preserve'
										>
											<g>
												<path
													d='M24.3,36.5c0.7,0,1.4,0.1,2,0.3L15.5,6.2c0,0,0,0,0,0l-1-3c-0.3-0.9-1.2-1.3-2-1L3.1,5.3
        c-0.9,0.3-1.3,1.2-1,2l1,3c0.3,0.9,1.2,1.3,2,1L10,9.7l9.9,28.1C21.2,37,22.7,36.5,24.3,36.5z'
												/>
												<path
													d='M41.2,29.2l-9.9,3.5c-1,0.4-2.2-0.2-2.5-1.2l-3.5-9.9c-0.4-1,0.2-2.2,1.2-2.5l9.9-3.5
        c1-0.4,2.2,0.2,2.5,1.2l3.5,9.9C42.8,27.7,42.2,28.8,41.2,29.2z'
												/>
												<path
													d='M31.8,12.9l-6.7,2.3c-1,0.4-2.2-0.2-2.5-1.2l-2.3-6.7c-0.4-1,0.2-2.2,1.2-2.5l6.7-2.3
        c1-0.4,2.2,0.2,2.5,1.2l2.3,6.7C33.4,11.3,32.9,12.5,31.8,12.9z'
												/>
												<path
													d='M49.9,35.5l-1-3c-0.3-0.9-1.2-1.3-2-1l-18.2,6.3c1.9,1.2,3.2,3.2,3.6,5.5l16.7-5.7
        C49.8,37.3,50.2,36.4,49.9,35.5z'
												/>
												<path d='M24.3,39.1c-3,0-5.5,2.5-5.5,5.5c0,3,2.5,5.5,5.5,5.5s5.5-2.5,5.5-5.5C29.8,41.5,27.3,39.1,24.3,39.1z' />
											</g>
										</svg>
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>
					На этой странице пользователь не найден, попробуйте выполнить
					глобальный поиск.
				</p>
			)}
			{isModalOpen && (
				<div className='orders-list-container__modal'>
					<div className='orders-list-container__modal__content'>
						<div className='orders-list-container__modal__content__top'>
							<SearchButton onSearchTermChange={handleSearchTermChange} />
							<button
								className='orders-list-container__modal__content__close-button'
								onClick={handleCloseModal}
							>
								<svg
									width='40px'
									height='25px'
									viewBox='0 0 24 24'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										fillRule='evenodd'
										clipRule='evenodd'
										d='M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z'
										fill='#0F1729'
									/>
								</svg>
							</button>
						</div>

						<div>
							{filteredOrders.map((order, orderIndex) => (
								<div
									className='orders-list-container__modal__content__order'
									key={order.id}
								>
									<div className='orders-list-container__modal__content__order__top'>
										<div className='orders-list-container__modal__content__order__id-date'>
											<span className='orders-list-container__modal__content__order__id'>
												ID заказа: {order.id}
											</span>
											<span className='orders-list-container__modal__content__order__date'>
												{order.createdDate.slice(0, 10)}{' '}
											</span>
										</div>
										<span className='orders-list-container__modal__content__order__price'>
											{order.totalPrice}Р
										</span>
									</div>
									<div className='orders-list-container__modal__content__products'>
										{order.orderItems?.map((product, productIndex) => (
											<div key={`${product.id}-${orderIndex}-${productIndex}`}>
												{productImages[product.productReadDTO.id] &&
													productImages[product.productReadDTO.id].length >
														0 && (
														<img
															src={
																productImages[product.productReadDTO.id][0]?.src
															}
															alt={product.productReadDTO.productName}
															className='orders-list-container__modal__content__products__productImage'
														/>
													)}
											</div>
										))}
										<div className='orders-list-container__modal__content__order__products__status'>
											Статус:{' '}
											<select
												className='orders-list-container__modal__content__order__products__status__select'
												value={order.status}
												onChange={e =>
													handleStatusChange(order.id, e.target.value)
												}
											>
												{statuses.map(status => (
													<option value={status} key={status}>
														{statusTranslations[status]}
													</option>
												))}
											</select>
										</div>
									</div>
								</div>
							))}
						</div>

						<div className='orders-list-container__modal__content__pagination'>
							<Pagination
								page={page}
								totalPages={totalPages}
								onPreviousPage={handlePreviousPage}
								onNextPage={handleNextPage}
								pageSize={size}
								onPageSizeChange={handlePageSizeChange}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default OrdersList
