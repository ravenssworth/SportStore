import React, { useState } from 'react'
import Goods from '../../components/Goods/Goods.jsx'
import Header from '../../components/Header/Header.jsx'
import useProducts from '../../hooks/useProducts'

function MainPage() {
	const { products, productImages, loading, error } = useProducts()
	const [searchTerm, setSearchTerm] = useState('')

	// Фильтрация продуктов по названию
	const filteredProducts = products.filter(product =>
		product.productName.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<div>
			<Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
			{loading ? (
				<p>Загрузка...</p>
			) : error ? (
				<p>{error}</p>
			) : (
				<Goods products={filteredProducts} productImages={productImages} />
			)}
		</div>
	)
}

export default MainPage
