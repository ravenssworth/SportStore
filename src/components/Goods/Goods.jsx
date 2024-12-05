import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Goods.css'

function Goods({ products, productImages }) {
	const [discounts, setDiscounts] = useState([])

	useEffect(() => {
		const fetchAllDiscounts = async () => {
			try {
				const response = await axios.post(
					'http://localhost:8080/api/discounts/all',
					{}
				)
				setDiscounts(response.data.content) // Сохраняем скидки в состояние
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

					return (
						<a
							href={`/product/${product.id}`}
							key={product.id}
							className={`goods-item ${product.stock === 0 ? 'disabled' : ''}`}
						>
							<div className='goods-item__image-container'>
								{productImages[product.id] &&
								productImages[product.id].length > 0 ? (
									<div className='goods-item__image-container__image-discount'>
										<img
											src={productImages[product.id][0].src}
											alt={product.productName}
											className={product.stock === 0 ? 'gray-image' : ''}
										/>
										{productDiscount && (
											<span className='discount-label'>
												-{productDiscount.percentage}%
											</span>
										)}
									</div>
								) : (
									<span>Изображение отсутствует</span>
								)}
							</div>
							{product.stock > 0 ? (
								<div className='goods-container__goods-item__container'>
									<div className='goods-container__goods-item__name'>
										<span>{product.productName}</span>
									</div>
									<div className='goods-container__goods-item__price'>
										<span>{product.price}Р</span>
									</div>
								</div>
							) : (
								<span className='goods-container__goods-item__no-stock'>
									Нет в наличии
								</span>
							)}
						</a>
					)
				})}
			</div>
		</div>
	)
}

export default Goods
