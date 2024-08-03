// src/components/Goods/Goods.jsx
import React from 'react'
import './Goods.css'

function Goods({ products }) {
	return (
		<div className='goods-container'>
			{products.map(product => (
				<div key={product.id} className='goods-item'>
					<div className='goods-item__image'>
						{product.image && (
							<img
								src={`data:image/jpeg;base64,${product.image}`}
								alt={product.productName}
							/>
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
