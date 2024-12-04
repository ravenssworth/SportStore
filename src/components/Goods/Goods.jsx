import React from 'react'
import './Goods.css'

function Goods({ products, productImages }) {
	console.log(products)
	return (
		<div className='goods-container'>
			{products.map(product => (
				<a
					href={`/product/${product.id}`}
					key={product.id}
					className={`goods-item ${product.stock === 0 ? 'disabled' : ''}`}
				>
					<div className='goods-item__image'>
						{product.stock > 0 ? (
							<img
								src={productImages[product.id][0].src}
								alt={product.productName}
							/>
						) : (
							<img
								src={productImages[product.id][0].src}
								alt={product.productName}
								className='gray-image'
							/>
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
			))}
		</div>
	)
}

export default Goods
