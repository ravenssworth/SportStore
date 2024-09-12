import { React, useState } from 'react'
import { useParams } from 'react-router-dom'
import useProducts from '../../hooks/useProducts'
import './ProductInfoPage.css'
import Menu from '../../components/Menu/Menu.jsx'

function ProductInfoPage() {
	const { id } = useParams()
	const { products, productImages } = useProducts()
	const [cartProduct, setCartProduct] = useState(null)

	const product = products.find(prod => prod.id === parseInt(id))

	if (!product) {
		return <div className='product-info'>Product not found.</div>
	}

	const images = productImages[product.id] || []

	const handleClick = () => {
		const productInCart = {
			productName: product.productName,
			image: images[0]?.src,
			price: product.price,
		}

		const currentCart = JSON.parse(localStorage.getItem('cartProducts')) || []
		currentCart.push(productInCart)
		localStorage.setItem('cartProducts', JSON.stringify(currentCart))
		setCartProduct(productInCart)
	}

	return (
		<div className='product-info'>
			<Menu />
			<h1 className='product-info__name'>{product.productName}</h1>
			<div className='product-info__details'>
				<div className='product-info__images'>
					{images.length > 0 ? (
						images.map((image, index) => (
							<img
								key={index}
								src={image.src}
								alt={product.productName}
								className='product-info__image'
							/>
						))
					) : (
						<span>No image available</span>
					)}
				</div>
				<div className='product-info__description'>
					<p>
						<strong>Цена:</strong> {product.price}Р
					</p>
					<p>
						<strong>Описание:</strong> {product.productDescription}
					</p>
				</div>
			</div>
			<button className='product-info__cart' onClick={handleClick}>
				В корзину
			</button>
		</div>
	)
}

export default ProductInfoPage
