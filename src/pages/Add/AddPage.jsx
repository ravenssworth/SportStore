import React, { useEffect, useState } from 'react'
import Menu from '../../components/Menu/Menu.jsx'
import './AddPage.css'
import CreateProduct from '../../components/CreateProduct/CreateProduct.jsx'
import CreateCategory from '../../components/CreateCategory/CreateCategory.jsx'
import CategoriesList from '../../components/CategoriesList/CategoriesList.jsx'
import ProductsList from '../../components/ProductsList/ProductsList.jsx'
import EditCategory from '../../components/EditCategory/EditCategory.jsx'
import axios from 'axios'

function AddPage() {
	const [categories, setCategories] = useState([])
	const [products, setProducts] = useState([]) // Хранение продуктов
	const [loadingCategories, setLoadingCategories] = useState(true)
	const [loadingProducts, setLoadingProducts] = useState(true)
	const [errorCategories, setErrorCategories] = useState(null)
	const [errorProducts, setErrorProducts] = useState(null)

	const fetchCategories = async () => {
		try {
			const response = await axios.post(
				'http://localhost:8080/api/categories/all?page=0&size=10&sort=categoryName',
				{}
			)
			setCategories(response.data.content)
		} catch (error) {
			setErrorCategories('Failed to fetch categories')
		} finally {
			setLoadingCategories(false)
		}
	}

	const fetchProducts = async () => {
		try {
			const response = await axios.post(
				'http://localhost:8080/api/products/all?page=0&size=10&sort=name',
				{}
			)
			setProducts(response.data.content)
		} catch (error) {
			setErrorProducts('Failed to fetch products')
		} finally {
			setLoadingProducts(false)
		}
	}

	useEffect(() => {
		fetchCategories()
		fetchProducts()
	}, [])

	const handleCategoryAdded = newCategory => {
		setCategories(prevCategories => [...prevCategories, newCategory])
	}

	const handleCategoryUpdated = updatedCategory => {
		// Обновляем категории
		setCategories(prevCategories =>
			prevCategories.map(cat =>
				cat.id === updatedCategory.id ? updatedCategory : cat
			)
		)
		// Обновляем продукты с новой информацией о категории
		setProducts(prevProducts =>
			prevProducts.map(prod =>
				prod.categoryDTO.id === updatedCategory.id
					? { ...prod, categoryDTO: updatedCategory }
					: prod
			)
		)
	}

	const handleProductAdded = newProduct => {
		setProducts(prevProducts => [...prevProducts, newProduct])
	}

	return (
		<div className='wrapper'>
			<div className='content'>
				<Menu />
				<div className='tabs'>
					<nav className='tabs__items'>
						<input
							type='radio'
							className='tabs__radio'
							name='tabs-example'
							id='tab1'
							defaultChecked
						/>
						<label htmlFor='tab1' className='tabs__label'>
							Добавить продукт
						</label>
						<div id='content-tab1' className='tabs__block'>
							<CreateProduct
								categories={categories}
								onProductAdded={handleProductAdded}
							/>
							{loadingProducts ? (
								<p>Loading...</p>
							) : errorProducts ? (
								<p>{errorProducts}</p>
							) : (
								<ProductsList products={products} />
							)}
						</div>
						<input
							type='radio'
							className='tabs__radio'
							name='tabs-example'
							id='tab2'
						/>
						<label htmlFor='tab2' className='tabs__label'>
							Добавить категорию
						</label>
						<div id='content-tab2' className='tabs__block'>
							<div className='tabs__category-actions'>
								<CreateCategory onCategoryAdded={handleCategoryAdded} />
								<EditCategory onCategoryUpdated={handleCategoryUpdated} />
							</div>

							{loadingCategories ? (
								<p>Loading...</p>
							) : errorCategories ? (
								<p>{errorCategories}</p>
							) : (
								<CategoriesList categories={categories} />
							)}
						</div>
					</nav>
				</div>
			</div>
		</div>
	)
}

export default AddPage
