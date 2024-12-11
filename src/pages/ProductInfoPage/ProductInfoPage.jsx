import { React, useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import './ProductInfoPage.css'
import Menu from '../../components/Menu/Menu.jsx'
import useProducts from '../../hooks/useProducts'
import LoginModal from '../../components/LoginModal/LoginModal.jsx'
import Pagination from '../../components/Pagination/Pagination.jsx'
import DefaultImage from '../../assets/logo.png'
import DeleteButton from '../../components/DeleteButton/DeleteButton.jsx'

function ProductInfoPage() {
	const [reviews, setReviews] = useState([])
	const [loadingReviews, setLoadingReviews] = useState(true)
	const [page, setPage] = useState(0)
	const [size, setSize] = useState(5)
	const [totalPages, setTotalPages] = useState(1)

	const { id } = useParams()
	console.log(id)
	const { products, productImages } = useProducts()
	const [largeImage, setLargeImage] = useState(null)
	const [isProductInCart, setIsProductInCart] = useState(false)

	const product = products.find(prod => prod.id === parseInt(id))

	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

	const rolesString = localStorage.getItem('roles')

	const isAdmin = rolesString?.includes('ROLE_ADMIN')

	const handleOpenLoginModal = () => {
		setIsLoginModalOpen(true)
	}

	const handleCloseLoginModal = () => setIsLoginModalOpen(false)

	const images = productImages[product?.id] || []

	if (!largeImage && images.length > 0) {
		setLargeImage(images[0]?.src)
	}

	useEffect(() => {
		const checkProductInCart = async () => {
			const userId = localStorage.getItem('userId')
			if (!userId) return
			const cartData = await axios.get(
				`http://localhost:8080/api/cart/user/${userId}`
			)

			const cartItems = cartData.data.cartItems || []
			const productInCart = cartItems.some(
				item => item.product.id === product?.id
			)

			console.log(cartItems)
			console.log(productInCart)

			setIsProductInCart(productInCart)
		}

		checkProductInCart()
	}, [product])

	const handleAddProductToCart = async event => {
		const userId = localStorage.getItem('userId')

		const cartData = await axios.get(
			`http://localhost:8080/api/cart/user/${userId}`
		)

		const cartId = cartData.data.id

		await axios.post(
			`http://localhost:8080/api/cart/addProduct?cartId=${cartId}&productId=${product?.id}`
		)
		setIsProductInCart(true)
	}

	useEffect(() => {
		const fetchReviews = async () => {
			try {
				const response = await axios.post(
					`http://localhost:8080/api/reviews/all?page=${page}&size=${size}&sort=id`,
					{
						productId: id,
					}
				)
				setReviews(response.data.content)
				setTotalPages(response.data.totalPages)
			} catch (error) {
				console.error('Ошибка при загрузке отзывов:', error)
			} finally {
				setLoadingReviews(false)
			}
		}

		fetchReviews()
	}, [page, size])
	console.log(reviews)

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

	const handleSearchTermChange = term => {
		setSearchTerm(term)
	}

	const handleDeleteReview = async reviewId => {
		try {
			await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`)
			setReviews(prevReviews =>
				prevReviews.filter(review => review.id !== reviewId)
			)
		} catch (error) {
			console.error('Ошибка при удалении отзыва:', error)
		}
	}

	const renderReviews = () => {
		if (loadingReviews) {
			return <p>Загрузка отзывов...</p>
		}

		if (reviews.length === 0) {
			return <p>Нет отзывов для этого продукта.</p>
		}

		return reviews.map(review => (
			<div key={review.id} className='product-info__info__reviews__review'>
				<div className='product-info__info__reviews__review__user-rating'>
					<span id='username'>{review.userReadDTO.username}</span>
					<span id='rating' className={`rating-${review.rating}`}>
						{review.rating}
					</span>
					<span id='date'>{review.createdDate.slice(0, 10)}</span>
				</div>
				<div className='product-info__info__reviews__review__comment'>
					<span id='comment'>{review.comment}</span>
					{isAdmin && (
						<DeleteButton onClick={() => handleDeleteReview(review.id)} />
					)}
				</div>
			</div>
		))
	}

	return (
		<div className='product-info'>
			<div className='product-info__header'>
				<div className='header-logo'>
					<img src={DefaultImage} alt='' />
				</div>
				<div className='product-info__menu'>
					<Menu onLoginClick={handleOpenLoginModal} />
				</div>
			</div>
			<div className='product-info__details'>
				<div className='product-info__images-container'>
					<div className='product-info__largeImg-container'>
						<img
							src={largeImage}
							alt={product?.productName}
							className='product-info__largeImg'
						/>
					</div>
					<div className='product-info__images'>
						{images.length > 0 ? (
							images.map((image, index) => (
								<img
									key={index}
									src={image.src}
									alt={product?.productName}
									className={
										largeImage === image.src
											? 'product-info__image selected'
											: 'product-info__image'
									}
									onClick={() => {
										setLargeImage(image.src)
									}}
								/>
							))
						) : (
							<span>Нет изображений</span>
						)}
					</div>
				</div>
				<div className='product-info__info'>
					<p className='product-info__info__name'>{product?.productName}</p>
					<div className='product-info__info__container'>
						<p className='product-info__info__container__description'>
							{product?.productDescription}
						</p>
						<p className='product-info__info__container__price'>
							{product?.price}Р
						</p>
						<p className='product-info__info__container__quantity'>
							{product?.quantity}
						</p>
						{isProductInCart ? (
							<button
								className='product-info__info__button-cart-added'
								disabled={isProductInCart}
							>
								В корзине
							</button>
						) : (
							<button
								className='product-info__info__button-cart'
								onClick={handleAddProductToCart}
								disabled={isProductInCart}
							>
								В корзину
							</button>
						)}
					</div>
					<div className='product-info__info__reviews'>
						<span className='product-info__info__reviews__title'>Отзывы</span>
						{renderReviews()}
						{reviews.length > 0 && (
							<div className='orders-list-container__modal__content__pagination'>
								<Pagination
									page={page}
									totalPages={totalPages}
									onPreviousPage={handlePreviousPage}
									onNextPage={handleNextPage}
									pageSize={size}
									onPageSizeChange={handlePageSizeChange}
								/>
							</div>
						)}
					</div>
				</div>
			</div>

			<LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
		</div>
	)
}

export default ProductInfoPage
