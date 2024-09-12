import { React, useEffect, useState } from 'react'
import './Cart.css'
import DeleteButton from '../DeleteButton/DeleteButton.jsx'

function Cart({ show, closeCart }) {
	const [productsInCart, setProductsInCart] = useState([])

	// Загрузка продуктов из localStorage при монтировании компонента
	useEffect(() => {
		const storedProducts =
			JSON.parse(localStorage.getItem('cartProducts')) || []
		setProductsInCart(storedProducts)
	}, [show]) // Обновляем продукты при каждом открытии корзины

	const removeProductFromCart = productToRemove => {
		const updatedCart = productsInCart.filter(
			product => product.productName !== productToRemove.productName
		)
		setProductsInCart(updatedCart)
		localStorage.setItem('cartProducts', JSON.stringify(updatedCart))
	}

	return (
		<div className={show ? 'sidebar-cart active' : 'sidebar-cart'}>
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
			{productsInCart.length > 0 ? (
				productsInCart.map((product, index) => (
					<div key={index} className='sidebar-cart__item'>
						<img
							className='sidebar-cart__image'
							src={product.image}
							alt={product.productName}
						/>
						<h1 className='sidebar-cart__name'>{product.productName}</h1>
						<div className='sidebar-cart__price'>{product.price} Р</div>
						<DeleteButton
							onClick={() => removeProductFromCart(product)}
						></DeleteButton>
					</div>
				))
			) : (
				<div className='sidebar-cart__empty'>Корзина пуста</div>
			)}
		</div>
	)
}

export default Cart
