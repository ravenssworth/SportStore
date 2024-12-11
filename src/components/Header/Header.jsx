import React, { useState, useEffect } from 'react'
import Input from '../Input/Input'
import Menu from '../Menu/Menu'
import './Header.css'
import LogoImage from '../../assets/logo.jpg'
import useProducts from '../../hooks/useProducts'

function Header({ onLoginClick }) {
	const [searchTerm, setSearchTerm] = useState('')
	const [filteredProducts, setFilteredProducts] = useState([])
	const { allProducts, fetchAllProducts } = useProducts()

	useEffect(() => {
		if (allProducts.length === 0) {
			fetchAllProducts()
		}
	}, [fetchAllProducts, allProducts.length])

	const handleSearchChange = term => {
		setSearchTerm(term)
		if (term) {
			const filtered = allProducts.filter(product =>
				product.productName.toLowerCase().includes(term.toLowerCase())
			)
			setFilteredProducts(filtered)
		} else {
			setFilteredProducts([])
		}
	}

	console.log(allProducts)

	return (
		<header>
			<div className='header-logo'>
				<img className='header-logo__image' src={LogoImage} alt='' />
				<span>ВЕРШИНА СПОРТА</span>
			</div>
			<div className='header-container__input'>
				<Input
					placeholder={'Поиск...'}
					value={searchTerm}
					onChange={e => handleSearchChange(e.target.value)}
				/>
			</div>
			<div className='header-container__menu'>
				<Menu onLoginClick={onLoginClick} />
			</div>
			{filteredProducts.length > 0 && (
				<div className='search-results'>
					<ul>
						{filteredProducts.map(product => (
							<li
								key={product.id}
								className={
									product.stock > 0
										? 'search-results__item'
										: 'search-results__item-out-of-stock'
								}
							>
								<a
									href={`/product/${product.id}`}
									className={
										product.stock > 0
											? 'search-results__item__link'
											: 'search-results__item__link-out-of-stock'
									}
								>
									<img
										src={
											product.image
												? `data:image/jpeg;base64,${product.image}`
												: '/path-to-placeholder.jpg'
										}
										alt={product.productName}
										className={
											product.stock > 0
												? 'search-results__item__image'
												: 'search-results__item__image-out-of-stock'
										}
									/>
									<div className='search-results__item__info'>
										<span className='search-results__item__info__name'>
											{product.productName}
										</span>
										<span
											className={
												product.stock > 0
													? 'search-results__item__info__price'
													: 'search-results__item__info__price-out-of-stock'
											}
										>
											{product.stock > 0
												? `${product.price} ₽`
												: 'Нет в наличии'}
										</span>
									</div>
								</a>
							</li>
						))}
					</ul>
				</div>
			)}
		</header>
	)
}

export default Header
