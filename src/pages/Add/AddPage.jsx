import React, { useState } from 'react'
import Menu from '../../components/Menu/Menu.jsx'
import './AddPage.css'
import CreateProduct from '../../components/CreateProduct/CreateProduct.jsx'
import CreateCategory from '../../components/CreateCategory/CreateCategory.jsx'
import CategoriesList from '../../components/CategoriesList/CategoriesList.jsx'
import ProductsList from '../../components/ProductsList/ProductsList.jsx'
import EditCategory from '../../components/EditCategory/EditCategory.jsx'
import EditProduct from '../../components/EditProduct/EditProduct.jsx'
import useProducts from '../../hooks/useProducts'
import useCategories from '../../hooks/useCategories'
import axios from 'axios'
import Pagination from '../../components/Pagination/Pagination.jsx'

function AddPage() {
	const [activeTab, setActiveTab] = useState('products')
	const handleTabChange = tab => {
		setActiveTab(tab)
	}
	return (
		<div className='wrapper'>
			<div className='content'>
				<div className='add-page-header'>
					<div className='add-page-header__menu-container'>
						<Menu />
					</div>
				</div>
				<div className='tabs'>
					<nav className='tabs__items'>
						<input
							type='radio'
							className='tabs__radio'
							name='tabs-example'
							id='tab1'
							defaultChecked
							onChange={() => handleTabChange('products')}
						/>
						<label htmlFor='tab1' className='tabs__label'>
							Добавить продукт
						</label>
						<div id='content-tab1' className='tabs__block'>
							{activeTab === 'products' && <ProductsSection />}
						</div>
						<input
							type='radio'
							className='tabs__radio'
							name='tabs-example'
							id='tab2'
							onChange={() => handleTabChange('categories')}
						/>
						<label htmlFor='tab2' className='tabs__label'>
							Добавить категорию
						</label>
						<div id='content-tab2' className='tabs__block'>
							{activeTab === 'categories' && <CategoriesSection />}
						</div>
					</nav>
				</div>
			</div>
		</div>
	)
}

export default AddPage

function ProductsSection() {
	const {
		products,
		productImages,
		loading: loadingProducts,
		error: errorProducts,
		page,
		setPage,
		size,
		setSize,
		totalPages,
		setProducts,
	} = useProducts()

	const { categories } = useCategories()

	const handleProductAdded = newProduct => {
		setProducts(prevProducts => [...prevProducts, newProduct])
	}

	const handleProductUpdated = updatedProduct => {
		setProducts(prevProducts =>
			prevProducts.map(prod =>
				prod.id === updatedProduct.id ? updatedProduct : prod
			)
		)
	}

	const handleDeleteProduct = async productId => {
		try {
			await axios.delete(
				`http://localhost:8080/api/products/{id}?id=${productId}`
			)
			setProducts(prevProducts =>
				prevProducts.filter(prod => prod.id !== productId)
			)
			console.log('Product deleted successfully')
		} catch (error) {
			console.error('Failed to delete product:', error)
		}
	}

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
		setPage(0) // Сброс на первую страницу при изменении размера страницы
	}

	return (
		<>
			<div className='tabs__product-actions'>
				<CreateProduct
					categories={categories}
					onProductAdded={handleProductAdded}
				/>
				<EditProduct
					categories={categories}
					onProductUpdated={handleProductUpdated}
				/>
			</div>
			{loadingProducts ? (
				<p>Loading...</p>
			) : errorProducts ? (
				<p>{errorProducts}</p>
			) : (
				<>
					<ProductsList
						products={products}
						productImages={productImages}
						onDeleteProduct={handleDeleteProduct}
					/>
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
		</>
	)
}

function CategoriesSection() {
	const {
		categories,
		loading: loadingCategories,
		error: errorCategories,
		categoriesPage,
		setCategoriesPage,
		categoriesSize,
		setCategoriesSize,
		categoriesTotalPages,
		setCategories,
	} = useCategories()

	const handleCategoryAdded = newCategory => {
		setCategories(prevCategories => [...prevCategories, newCategory])
	}

	const handleCategoryUpdated = updatedCategory => {
		setCategories(prevCategories =>
			prevCategories.map(cat =>
				cat.id === updatedCategory.id ? updatedCategory : cat
			)
		)
	}

	const handleDeleteCategory = async categoryId => {
		try {
			await axios.delete(`http://localhost:8080/api/categories/${categoryId}`)
			setCategories(prevCategories =>
				prevCategories.filter(cat => cat.id !== categoryId)
			)
			console.log('Category deleted successfully')
		} catch (error) {
			console.error('Failed to delete category:', error)
		}
	}

	const handleNextCategoriesPage = () => {
		if (categoriesPage < categoriesTotalPages - 1) {
			setCategoriesPage(categoriesPage + 1)
		}
	}

	const handlePreviousCategoriesPage = () => {
		if (categoriesPage > 0) {
			setCategoriesPage(categoriesPage - 1)
		}
	}

	const handleCategoriesPageSizeChange = event => {
		setCategoriesSize(parseInt(event.target.value))
		setCategoriesPage(0) // Сброс на первую страницу при изменении размера страницы
	}

	return (
		<>
			<div className='tabs__category-actions'>
				<CreateCategory onCategoryAdded={handleCategoryAdded} />
				<EditCategory onCategoryUpdated={handleCategoryUpdated} />
			</div>
			{loadingCategories ? (
				<p>Loading...</p>
			) : errorCategories ? (
				<p>{errorCategories}</p>
			) : (
				<>
					<CategoriesList
						categories={categories}
						onDeleteCategory={handleDeleteCategory}
					/>
					<Pagination
						page={categoriesPage}
						totalPages={categoriesTotalPages}
						onPreviousPage={handlePreviousCategoriesPage}
						onNextPage={handleNextCategoriesPage}
						pageSize={categoriesSize}
						onPageSizeChange={handleCategoriesPageSizeChange}
					/>
				</>
			)}
		</>
	)
}
