import React from 'react'
import './Goods.css'

function Goods({ products, productImages }) {
	return (
		<div className='goods-container'>
			{products.map(product => (
				<div key={product.id} className='goods-item'>
					<div className='goods-item__image'>
						{productImages[product.id] &&
						productImages[product.id].length > 0 ? (
							<img
								src={productImages[product.id][0].src} // Показываем первое изображение
								alt={product.productName}
							/>
						) : (
							<span>No image available</span>
						)}
					</div>
					<div className='goods-item__name'>
						<span>{product.productName}</span>
					</div>
					<div className='goods-item__price'>
						<span>{product.price}Р</span>
					</div>
				</div>
			))}
		</div>
	)
}

export default Goods
