// src/pages/MainPage/MainPage.jsx
import React from 'react'
import Input from '../../components/Input/Input.jsx'
import Goods from '../../components/Goods/Goods.jsx'
import Header from '../../components/Header/Header.jsx'
import useProducts from '../../hooks/useProducts'

function MainPage() {
	const { products, loading, error } = useProducts()

	return (
		<div>
			<Header />
			{loading ? (
				<p>Загрузка...</p>
			) : error ? (
				<p>{error}</p>
			) : (
				<Goods products={products} />
			)}
		</div>
	)
}

export default MainPage
