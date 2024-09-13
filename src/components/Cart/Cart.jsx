import React, { useState, useEffect } from 'react'
import './Cart.css'
import useProducts from '../../hooks/useProducts'
import axios from 'axios'

function Cart({ show, closeCart, cart }) {
	const { productImages } = useProducts()

	const [quantities, setQuantities] = useState({})

	// Локальная копия корзины для рендеринга
	const [localCartItems, setLocalCartItems] = useState([])

	// Инициализируем локальные количества при первом рендере
	useEffect(() => {
		const initialQuantities = {}
		cart.cartItems.forEach(item => {
			initialQuantities[item.product.id] = item.quantity
		})
		setQuantities(initialQuantities)
		setLocalCartItems(cart.cartItems)
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
			</div>
		</div>
	)
}

export default Cart
