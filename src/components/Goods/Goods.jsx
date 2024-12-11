import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Goods.css'

function Goods({ products, productImages }) {
	const [discounts, setDiscounts] = useState([])
	const [averageRatings, setAverageRatings] = useState({})

	const fetchAverageRatingForProduct = async productId => {
		try {
			const response = await axios.post(
				'http://localhost:8080/api/reviews/all',
				{
					productId,
				}
			)
			const reviews = response.data.content
			if (reviews.length === 0) return 0

			const totalRating = reviews.reduce(
				(sum, review) => sum + review.rating,
				0
			)
			return totalRating / reviews.length
		} catch (error) {
			console.error(
				`Ошибка при получении рейтинга для продукта ${productId}:`,
				error
			)
			return null
		}
	}

	useEffect(() => {
		const fetchAllRatings = async () => {
			const ratings = {}
			for (const product of products) {
				const averageRating = await fetchAverageRatingForProduct(product.id)
				ratings[product.id] = averageRating
			}
			setAverageRatings(ratings)
		}

		fetchAllRatings()
	}, [products])

	useEffect(() => {
		const fetchAllDiscounts = async () => {
			try {
				const response = await axios.post(
					'http://localhost:8080/api/discounts/all',
					{}
				)
				setDiscounts(response.data.content)
			} catch (error) {
				console.error('Не удалось получить скидки:', error)
			}
		}

		fetchAllDiscounts()
	}, [])

	return (
		<div className='goods-container'>
			<div className='goods-container__goods'>
				{products.map(product => {
					const productDiscount = discounts.find(
						discount => discount.productReadDTO.id === product.id
					)
					const averageRating = averageRatings[product.id] || 0

					return (
						<a
							href={`/product/${product.id}`}
							key={product.id}
							className={`goods-item ${product.stock === 0 ? 'disabled' : ''}`}
						>
							<div className='goods-item__image-container'>
								{productImages[product.id] &&
								productImages[product.id].length > 0 ? (
									<div className='goods-item__image-container__image'>
										<img
											src={productImages[product.id][0].src}
											alt={product.productName}
											className={product.stock === 0 ? 'gray-image' : ''}
										/>
										{productDiscount && (
											<span className='goods-item__image-container__image__discount'>
												-{productDiscount.percentage}%
											</span>
										)}
										{averageRating > 0 && (
											<div className='goods-item__image-container__image__rating'>
												<svg
													width='25px'
													height='25px'
													viewBox='0 -0.5 32 32'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'
												>
													<path
														d='M16.0005 0L21.4392 9.27275L32.0005 11.5439L24.8005 19.5459L25.889 30.2222L16.0005 25.895L6.11194 30.2222L7.20049 19.5459L0.000488281 11.5439L10.5618 9.27275L16.0005 0Z'
														fill='#FFCB45'
													/>
												</svg>
												<span>{averageRating}</span>
											</div>
										)}
									</div>
								) : (
									<span>Изображение отсутствует</span>
								)}
							</div>
							<div className='goods-container__goods-item__container'>
								<div className='goods-container__goods-item__name'>
									<span>{product.productName}</span>
								</div>
								<div
									className={
										product.stock > 0
											? 'goods-container__goods-item__price'
											: 'goods-container__goods-item__price-out-of-stock'
									}
								>
									{product.stock > 0 ? `${product.price}Р` : 'Нет в наличии'}
								</div>
							</div>
						</a>
					)
				})}
			</div>
		</div>
	)
}

export default Goods
