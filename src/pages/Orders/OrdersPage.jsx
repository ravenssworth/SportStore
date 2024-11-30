import React from 'react'
import './OrdersPage.css'
import useProducts from '../../hooks/useProducts'
import useOrders from '../../hooks/useOrders'
import Menu from '../../components/Menu/Menu.jsx'
import Pagination from '../../components/Pagination/Pagination.jsx'

function OrdersPage(props) {
	const { orders, loading, error, page, setPage, totalPages, size, setSize } =
		useOrders()

	const {
		productImages,
		loading: loadingImages,
		error: errorImages,
	} = useProducts()

	const token = localStorage.getItem('token')
	const savedRoles = JSON.parse(localStorage.getItem('roles')) || []

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

	if (orders.length === 0) {
		return (
			<div className='orders-page'>
				<div className='orders-page-header'>
					<div className='orders-page-header__menu-container'>
						<Menu />
					</div>
				</div>
				<h3 className='orders-page__no-orders'>Заказы отсутствуют</h3>
			</div>
		)
	}

	if (loading || loadingImages) {
		return <div>Загрузка...</div>
	}

	if (error || errorImages) {
		return <div>Ошибка загрузки данных</div>
	}

	if (!token) {
		window.location.href = '/'
		return null
	}

	return (
		<div className='orders-page'>
			<div className='orders-page-header'>
				<div className='orders-page-header__menu-container'>
					<Menu />
				</div>
			</div>
			{orders.map((order, orderIndex) => (
				<div className='orders-page__order' key={order.id}>
					<div className='orders-page__order__header'>
						<div className='orders-page__order__header__date'>
							Заказ от {order.createdDate.slice(0, 10)} к оплате{' '}
						</div>
						<span className='orders-page__order__header__price'>
							{order.totalPrice}Р
						</span>
					</div>
					<div className='orders-page__order__info'>
						{order.orderItems?.map((product, productIndex) => (
							<div
								className='orders-page__order__products'
								key={`${product.id}-${orderIndex}-${productIndex}`}
							>
								{productImages[product.productReadDTO.id] &&
									productImages[product.productReadDTO.id].length > 0 && (
										<img
											src={productImages[product.productReadDTO.id][0]?.src}
											alt={product.productReadDTO.productName}
											className='orders-page__order__products__productImage'
										/>
									)}
								<div className='orders-page__order__products__container'>
									<div className='orders-page__order__products__container__productName'>
										{product.productReadDTO.productName}
									</div>
									<div className='orders-page__order__products__container__productQuantity'>
										{product.quantity} шт.
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			))}
			<div className='orders-page__pagination'>
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
	)
}

export default OrdersPage
