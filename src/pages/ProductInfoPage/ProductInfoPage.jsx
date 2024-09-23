import { React, useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import './ProductInfoPage.css'
import Menu from '../../components/Menu/Menu.jsx'
import useProducts from '../../hooks/useProducts'

function ProductInfoPage() {
	const { id } = useParams()
	const { products, productImages } = useProducts()
	const [largeImage, setLargeImage] = useState(null)
	const [isProductInCart, setIsProductInCart] = useState(false)

	const product = products.find(prod => prod.id === parseInt(id))

	const images = productImages[product?.id] || []

	// Установить большое изображение на первое, если оно ещё не установлено
	if (!largeImage && images.length > 0) {
		setLargeImage(images[0]?.src)
	}

	useEffect(() => {
		const checkProductInCart = async () => {
			const userId = localStorage.getItem('userId')
			const cartData = await axios.get(
				`http://localhost:8080/api/cart/user/${userId}`
			)

			const cartItems = cartData.data.cartItems || []
			const productInCart = cartItems.some(
				item => item.productId === product?.id
			)

			setIsProductInCart(productInCart)
		}

		checkProductInCart()
	}, [product])

	const handleAddProductToCart = async event => {
		const userId = localStorage.getItem('userId')

		const cartData = await axios.get(
			`http://localhost:8080/api/cart/user/${userId}`
		)

		const cartId = cartData.data.id

		console.log(cartData.data.cartItems)

		await axios.post(
			`http://localhost:8080/api/cart/addProduct?cartId=${cartId}&productId=${product?.id}`
		)
		setIsProductInCart(true)
	}

	return (
		<div className='product-info'>
			<div className='product-info__header'>
				<div className='product-info__menu'>
					<Menu />
				</div>
			</div>
			<div className='product-info__details'>
				<div className='product-info__images-container'>
					<div className='product-info__largeImg-container'>
						<img
							src={largeImage}
							alt={product?.productName}
							className='product-info__largeImg'
						/>
					</div>
					<div className='product-info__images'>
						{images.length > 0 ? (
							images.map((image, index) => (
								<img
									key={index}
									src={image.src}
									alt={product?.productName}
									className={
										largeImage === image.src
											? 'product-info__image selected'
											: 'product-info__image'
									}
									onClick={() => {
										setLargeImage(image.src)
									}}
								/>
							))
						) : (
							<span>Нет изображений</span>
						)}
					</div>
				</div>
				<div className='product-info__info'>
					<p className='product-info__info__name'>{product?.productName}</p>
					<div className='product-info__info__container'>
						<p className='product-info__info__container__description'>
							{product?.productDescription}
						</p>
						<p className='product-info__info__container__price'>
							{product?.price}Р
						</p>
					</div>

					<button
						className={
							isProductInCart
								? 'product-info__info__button-cart-added'
								: 'product-info__info__button-cart'
						}
						onClick={handleAddProductToCart}
						disabled={isProductInCart}
					>
						В корзину
					</button>
				</div>
			</div>
		</div>
	)
}

export default ProductInfoPage
