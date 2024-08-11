import React, { useState } from 'react'
import Goods from '../../components/Goods/Goods.jsx'
import Header from '../../components/Header/Header.jsx'
import useProducts from '../../hooks/useProducts'
import LoginModal from '../../components/LoginModal/LoginModal.jsx'
import Pagination from '../../components/Pagination/Pagination.jsx'

function MainPage() {
	const {
		products,
		productImages,
		loading,
		error,
		page,
		setPage,
		size,
		setSize,
		totalPages,
		setProducts,
	} = useProducts()
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
	const handleNextPage = () => {
		if (page < totalPages - 1) {
			setPage(page + 1)
		}
	}

	const handlePreviousPage = () => {
		if (page > 0) {
			setPage(page - 1)
		}
	}

	const handlePageSizeChange = event => {
		setSize(parseInt(event.target.value))
		setPage(0) // Сбрасываем на первую страницу при изменении размера страницы
	}

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
				<>
					<Goods products={filteredProducts} productImages={productImages} />
					<Pagination
						page={page}
						totalPages={totalPages}
						onPreviousPage={handlePreviousPage}
						onNextPage={handleNextPage}
						pageSize={size}
						onPageSizeChange={handlePageSizeChange}
					/>
				</>
			)}
			<LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
		</div>
	)
}

export default MainPage
