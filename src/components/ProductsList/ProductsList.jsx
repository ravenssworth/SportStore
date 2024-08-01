import React from 'react'
import './ProductsList.css'

function ProductsList({ products }) {
	if (products.length === 0) {
		return <p>No products found</p>
	}

	return (
		<div className='products-list-container'>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Название продукта</th>
						<th>Описание продукта</th>
						<th>Цена</th>
						<th>Количество</th>
						<th>Категория</th>
						<th>Изображение</th>
					</tr>
				</thead>
				<tbody>
					{products.map(product => (
						<tr key={product.id}>
							<td>{product.id}</td>
							<td>{product.productName}</td>
							<td>{product.productDescription}</td>
							<td>{product.price}</td>
							<td>{product.stock}</td>
							<td>{product.categoryDTO.categoryName}</td>
							<td>
								{product.image && (
									<img
										src={`data:image/jpeg;base64,${product.image}`}
										alt={product.productName}
									/>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default ProductsList
