import React, { useState, useEffect } from 'react'
import './MainPage.css'
import Goods from '../../components/Goods/Goods.jsx'
import Header from '../../components/Header/Header.jsx'
import useProducts from '../../hooks/useProducts'
import LoginModal from '../../components/LoginModal/LoginModal.jsx'
import Pagination from '../../components/Pagination/Pagination.jsx'
import Directory from '../../components/Directory/Directory.jsx'
import MainImage1 from '../../assets/main.jpg'
import MainImage2 from '../../assets/main2.jpg'
import AI from '../../components/AI/AI.jsx'

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
		setCategory,
	} = useProducts()

	const [searchTerm, setSearchTerm] = useState('')
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState(null)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)

	const images = [MainImage1, MainImage2]

	const filteredProducts = products.filter(product =>
		product.productName.toLowerCase().includes(searchTerm.toLowerCase())
	)
	const handleOpenLoginModal = () => {
		setIsLoginModalOpen(true)
	}

	const scrollToGoods = () => {
		const goodsSection = document.querySelector('.main__goods')
		if (goodsSection) {
			goodsSection.scrollIntoView({ behavior: 'smooth' })
		}
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
		setPage(0)
	}

	const handleCategorySelect = categoryId => {
		if (selectedCategory === categoryId) {
			setSelectedCategory(null)
			setCategory(null)
		} else {
			setSelectedCategory(categoryId)
			setCategory(categoryId)
		}
		setPage(0)
	}

	const handleNextImage = () => {
		setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length)
	}

	const handlePreviousImage = () => {
		setCurrentImageIndex(
			prevIndex => (prevIndex - 1 + images.length) % images.length
		)
	}

	useEffect(() => {
		scrollToGoods()
	}, [searchTerm, selectedCategory])

	return (
		<div className='main'>
			<Header
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				onLoginClick={handleOpenLoginModal}
			/>
			{loading && <p>Загрузка...</p>}
			{error && <p>{error}</p>}
			{!loading && !error && (
				<div className='main__container'>
					<div className='main__container__image-container'>
						<svg
							width='60px'
							height='45px'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
							className='arrow left'
							onClick={handlePreviousImage}
						>
							<polyline
								fill='none'
								stroke='#ccc'
								strokeWidth='2'
								points='7 2 17 12 7 22'
								transform='matrix(-1 0 0 1 24 0)'
							/>
						</svg>
						<div className='main__container__image-container__overlay'>
							{currentImageIndex === 0 && (
								<div className='main__container__image-container__overlay__content first'>
									<span>СКИДКА 50% НА ВСЕ</span>
									<h1>
										Новинки <br /> сезона
									</h1>

									<button onClick={scrollToGoods}>Перейти к покупкам</button>
								</div>
							)}
							{currentImageIndex === 1 && (
								<div className='main__container__image-container__overlay__content second'>
									<h1>
										Скидки до <span>30%</span> <br />
										на спортивную обувь
										<br /> до конца года!
									</h1>
									<button onClick={scrollToGoods}>Перейти к покупкам</button>
								</div>
							)}
						</div>
						<img
							src={images[currentImageIndex]}
							alt='Main'
							className='main__container__image-container__image'
						/>
						<svg
							width='60px'
							height='45px'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
							className='arrow right'
							onClick={handleNextImage}
						>
							<polyline
								fill='none'
								stroke='#ccc'
								strokeWidth='2'
								points='7 2 17 12 7 22'
							/>
						</svg>
						<div className='main__container__image-container__indicators'>
							{images.map((_, index) => (
								<span
									key={index}
									className={`main__container__image-container__indicators__indicator ${
										index === currentImageIndex ? 'active' : ''
									}`}
								/>
							))}
						</div>
					</div>
					<Directory
						onCategorySelect={handleCategorySelect}
						selectedCategory={selectedCategory}
					/>
					<div className='main__goods'>
						<Goods products={filteredProducts} productImages={productImages} />
					</div>
				</div>
			)}
			<div className='main__pagination'>
				<Pagination
					page={page}
					totalPages={totalPages}
					onPreviousPage={handlePreviousPage}
					onNextPage={handleNextPage}
					pageSize={size}
					onPageSizeChange={handlePageSizeChange}
				/>
			</div>

			<AI />

			<LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
		</div>
	)
}

export default MainPage
