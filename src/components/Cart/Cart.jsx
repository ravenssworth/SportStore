import axios from 'axios'
import React, { useEffect, useState } from 'react'
import useProducts from '../../hooks/useProducts'
import './Cart.css'

function Cart({ show, closeCart, cart, onLoginClick }) {
	const { productImages } = useProducts()

	const [quantities, setQuantities] = useState({})

	// Локальная копия корзины для рендеринга
	const [localCartItems, setLocalCartItems] = useState([])

	const token = localStorage.getItem('token')

	// Инициализируем локальные количества при первом рендере
	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token === null) {
			setLocalCartItems([])
		} else {
			const initialQuantities = {}
			cart.cartItems.forEach(item => {
				initialQuantities[item.product.id] = item.quantity
			})
			setQuantities(initialQuantities)
			setLocalCartItems(cart.cartItems)
		}
	}, [cart.cartItems])

	const handleReduce = async (event, productId) => {
		if (quantities[productId] > 1) {
			await axios.delete(
				`http://localhost:8080/api/cart?cartId=${cart.id}&productId=${productId}`
			)
			setQuantities({
				...quantities,
				[productId]: quantities[productId] - 1,
			})
		} else {
			await axios.delete(
				`http://localhost:8080/api/cart?cartId=${cart.id}&productId=${productId}`
			)
			setLocalCartItems(
				localCartItems.filter(item => item.product.id !== productId)
			)
		}
	}

	const handleIncrease = async (event, productId) => {
		await axios.post(
			`http://localhost:8080/api/cart/addProduct?cartId=${cart.id}&productId=${productId}`
		)
		setQuantities({
			...quantities,
			[productId]: quantities[productId] + 1,
		})
	}

	const handleOrder = async event => {
		const response = await axios.get(
			`http://localhost:8080/api/cart/${cart.id}`
		)
		const currentCartItems = response.data.cartItems

		const userId = localStorage.getItem('userId')

		const orderItemIds = currentCartItems.map(item => ({
			id: item.id,
			productId: item.product.id,
			quantity: item.quantity,
		}))

		const value = currentCartItems.reduce(
			(total, item) => total + item.quantity * item.product.price,
			0
		)

		try {
			// Создаем заказ
			const orderResponse = await axios.post(
				`http://localhost:8080/api/orders`,
				{
					userId: parseInt(userId),
					orderItemIds: orderItemIds,
					status: 'PENDING',
				}
			)

			const paymentResponse = await axios.get(
				`http://localhost:8080/get-payment-by-order/${orderResponse.data.id}`
			)

			const confirmation_url = paymentResponse.data.url

			window.location.href = confirmation_url

			console.log('Заказ создан', orderResponse.data)
		} catch (error) {
			console.error('Ошибка при создании заказа', error)
		}
	}

	return (
		<div className={show ? 'sidebar-cart active' : 'sidebar-cart'}>
			<div className='sidebar-cart__content'>
				<button className='close-button-cart' onClick={closeCart}>
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
				{localCartItems.map((item, index) => (
					<div key={index} className='sidebar-cart__item'>
						{productImages &&
						productImages[item.product.id] &&
						productImages[item.product.id][0] ? (
							<img
								className='sidebar-cart__image'
								src={productImages[item.product.id][0].src}
								alt={item.product.productName}
							/>
						) : (
							<div className='sidebar-cart__image-placeholder'>
								Нет изображения
							</div>
						)}
						<h1 className='sidebar-cart__name'>{item.product.productName}</h1>
						<div className='sidebar-cart__price'>
							{parseInt(item.product.price * quantities[item.product.id])} Р
						</div>
						<div className='sidebar-cart__quantity'>
							<span>{quantities[item.product.id]}</span>
							<div className='sidebar-cart__count-arrows'>
								<svg
									onClick={event => handleIncrease(event, item.product.id)}
									width='25px'
									height='25px'
									viewBox='0 0 24 24'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<rect width='24' height='24' fill='#faf9f8' />
									<path
										d='M12 18L12 6M12 6L7 11M12 6L17 11'
										stroke='#000000'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
								<svg
									onClick={event => handleReduce(event, item.product.id)}
									width='25px'
									height='25px'
									viewBox='0 0 24 24'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<rect width='24' height='24' fill='#faf9f8' />
									<path
										d='M12 6L12 18M12 18L17 13M12 18L7 13'
										stroke='#000000'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</div>
						</div>
					</div>
				))}
				{token ? (
					<button
						className='sidebar-cart__content__checkout-button'
						onClick={handleOrder}
					>
						Перейти к оплате
						<svg
							className='sidebar-cart__content__checkout-button__svgIcon'
							viewBox='0 0 576 512'
						>
							<path d='M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z'></path>
						</svg>
					</button>
				) : (
					<button
						className='sidebar-cart__content__login-button'
						onClick={onLoginClick}
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
								d='M7 3C6.44772 3 6 3.44772 6 4C6 4.55228 6.44772 5 7 5H18C18.5523 5 19 5.44772 19 6V18C19 18.5523 18.5523 19 18 19H7C6.44772 19 6 19.4477 6 20C6 20.5523 6.44772 21 7 21H18C19.6569 21 21 19.6569 21 18V6C21 4.34315 19.6569 3 18 3H7ZM12.7071 7.29289C12.3166 6.90237 11.6834 6.90237 11.2929 7.29289C10.9024 7.68342 10.9024 8.31658 11.2929 8.70711L13.5858 11H4C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H13.5858L11.2929 15.2929C10.9024 15.6834 10.9024 16.3166 11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L16.7071 12.7071C17.0976 12.3166 17.0976 11.6834 16.7071 11.2929L12.7071 7.29289Z'
								fill='#494646'
							/>
						</svg>
						Войти или зарегистрироваться
					</button>
				)}
			</div>
		</div>
	)
}

export default Cart
