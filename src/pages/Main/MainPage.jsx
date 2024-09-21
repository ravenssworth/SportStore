import React, { useState } from 'react'
import './MainPage.css'
import Goods from '../../components/Goods/Goods.jsx'
import Header from '../../components/Header/Header.jsx'
import useProducts from '../../hooks/useProducts'
import LoginModal from '../../components/LoginModal/LoginModal.jsx'
import Pagination from '../../components/Pagination/Pagination.jsx'
import Directory from '../../components/Directory/Directory.jsx'

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
		setCategory, // Получаем функцию для установки категории
	} = useProducts()

	const [searchTerm, setSearchTerm] = useState('')
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState(null)

	const filteredProducts = products.filter(product =>
		product.productName.toLowerCase().includes(searchTerm.toLowerCase())
	)
	const handleOpenLoginModal = () => {
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

	const handleCategorySelect = categoryId => {
		if (selectedCategory === categoryId) {
			setSelectedCategory(null) // Сбрасываем категорию
			setCategory(null) // Обновляем в хук useProducts
		} else {
			setSelectedCategory(categoryId) // Устанавливаем новую категорию
			setCategory(categoryId)
		}
		setPage(0) // Сбрасываем на первую страницу при выборе новой категории
	}

	return (
		<div className='main'>
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
				<div className='main__container'>
					<Directory
						onCategorySelect={handleCategorySelect}
						selectedCategory={selectedCategory}
					/>
					<Goods products={filteredProducts} productImages={productImages} />
				</div>
			)}
			<div className='main--pagination'>
				<Pagination
					page={page}
					totalPages={totalPages}
					onPreviousPage={handlePreviousPage}
					onNextPage={handleNextPage}
					pageSize={size}
					onPageSizeChange={handlePageSizeChange}
				/>
			</div>

			<LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
		</div>
	)
}

export default MainPage
