import React, { useState } from 'react'
import Goods from '../../components/Goods/Goods.jsx'
import Header from '../../components/Header/Header.jsx'
import useProducts from '../../hooks/useProducts'
import LoginModal from '../../components/LoginModal/LoginModal.jsx'

function MainPage() {
	const { products, productImages, loading, error } = useProducts()
	const [searchTerm, setSearchTerm] = useState('')
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

	// Фильтрация продуктов по названию
	const filteredProducts = products.filter(product =>
		product.productName.toLowerCase().includes(searchTerm.toLowerCase())
	)
	const handleOpenLoginModal = () => {
		console.log('Открытие модального окна')
		setIsLoginModalOpen(true)
	}

	const handleCloseLoginModal = () => setIsLoginModalOpen(false)

	return (
		<div>
			<Header
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				onLoginClick={handleOpenLoginModal}
			/>
			{loading ? (
				<p>Загрузка...</p>
			) : error ? (
				<p>{error}</p>
			) : (
				<Goods products={filteredProducts} productImages={productImages} />
			)}
			<LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
		</div>
	)
}

export default MainPage
