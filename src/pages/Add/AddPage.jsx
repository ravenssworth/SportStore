import React, { useState } from 'react'
import axios from 'axios'
import Menu from '../../components/Menu/Menu.jsx'
import './AddPage.css'
import CreateProduct from '../../components/CreateProduct/CreateProduct.jsx'
import CreateCategory from '../../components/CreateCategory/CreateCategory.jsx'
import CategoriesList from '../../components/CategoriesList/CategoriesList.jsx'
import ProductsList from '../../components/ProductsList/ProductsList.jsx'
import OrdersList from '../../components/OrdersList/OrdersList.jsx'
import EditCategory from '../../components/EditCategory/EditCategory.jsx'
import EditProduct from '../../components/EditProduct/EditProduct.jsx'
import useProducts from '../../hooks/useProducts'
import useCategories from '../../hooks/useCategories'
import useUsers from '../../hooks/useUsers'
import Pagination from '../../components/Pagination/Pagination.jsx'
import SearchButton from '../../components/SearchButton/SearchButton.jsx'

function AddPage() {
	const [activeTab, setActiveTab] = useState('products')
	const handleTabChange = tab => {
		setActiveTab(tab)
	}

	const token = localStorage.getItem('token')
	const savedRoles = JSON.parse(localStorage.getItem('roles')) || []

	if (!token) {
		window.location.href = '/'
		return null
	}

	if (!savedRoles.includes('ROLE_ADMIN')) {
		window.location.href = '/'
		return null
	}

	return (
		<div className='add-page'>
			<div className='add-page-header'>
				<div className='add-page-header__menu-container'>
					<Menu />
				</div>
			</div>
			<div className='add-page__tabs'>
				<div className='add-page__tabs__radio'>
					<label>
						<input
							type='radio'
							name='radio'
							defaultChecked
							onChange={() => handleTabChange('products')}
						/>
						<span>Продукты</span>
					</label>

					<label>
						<input
							type='radio'
							name='radio'
							onChange={() => handleTabChange('categories')}
						/>
						<span>Категории</span>
					</label>
					<label>
						<input
							type='radio'
							name='radio'
							onChange={() => handleTabChange('orders')}
						/>
						<span>Заказы</span>
					</label>
				</div>
				<div className='tabs__block'>
					{activeTab === 'products' && <ProductsSection />}
					{activeTab === 'categories' && <CategoriesSection />}
					{activeTab === 'orders' && <OrdersSection />}
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
		fetchProducts,
		searchProductById,
	} = useProducts()

	const { categories } = useCategories()

	const [searchTerm, setSearchTerm] = useState('')

	const handleSearchTermChange = term => {
		setSearchTerm(term)
	}

	const isProductFound = products.some(
		product => product.id.toString() === searchTerm
	)

	const handleSearch = async () => {
		if (searchTerm) {
			await searchProductById(searchTerm)
		}
	}

	const handleCancel = async () => {
		await fetchProducts(0, 5)
	}

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
			await axios.delete(`http://localhost:8080/api/products/${productId}`)
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
		setPage(0)
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
				<SearchButton
					onSearchTermChange={handleSearchTermChange}
					onSearch={handleSearch}
					isFound={isProductFound}
					onCancel={handleCancel}
				/>
			</div>

			{loadingProducts && <p>Загрузка...</p>}
			{errorProducts && <p>{errorProducts}</p>}
			{!loadingProducts && !errorProducts && (
				<>
					<ProductsList
						products={products}
						productImages={productImages}
						onDeleteProduct={handleDeleteProduct}
						searchedId={searchTerm}
					/>
					{products.length > 0 && !searchTerm && (
						<Pagination
							page={page}
							totalPages={totalPages}
							onPreviousPage={handlePreviousPage}
							onNextPage={handleNextPage}
							pageSize={size}
							onPageSizeChange={handlePageSizeChange}
						/>
					)}
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
		searchCategoryById,
		fetchCategories,
	} = useCategories()

	const handleCategoryAdded = newCategory => {
		setCategories(prevCategories => [...prevCategories, newCategory])
	}

	const [searchTerm, setSearchTerm] = useState('')

	const handleSearchTermChange = term => {
		setSearchTerm(term)
	}

	const isCategoryFound = categories.some(
		category => category.id.toString() === searchTerm
	)

	const handleSearch = async () => {
		if (searchTerm) {
			await searchCategoryById(searchTerm)
		}
	}

	const handleCancel = async () => {
		await fetchCategories(0, 5)
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
		setCategoriesPage(0)
	}

	return (
		<>
			<div className='tabs__category-actions'>
				<CreateCategory onCategoryAdded={handleCategoryAdded} />
				<EditCategory onCategoryUpdated={handleCategoryUpdated} />
				<SearchButton
					onSearchTermChange={handleSearchTermChange}
					onSearch={handleSearch}
					isFound={isCategoryFound}
					onCancel={handleCancel}
				/>
			</div>
			{loadingCategories && <p>Загрузка...</p>}
			{errorCategories && <p>{errorCategories}</p>}

			{!loadingCategories && !errorCategories && (
				<>
					<CategoriesList
						categories={categories}
						onDeleteCategory={handleDeleteCategory}
						searchedId={searchTerm}
					/>
					{!searchTerm && (
						<Pagination
							page={categoriesPage}
							totalPages={categoriesTotalPages}
							onPreviousPage={handlePreviousCategoriesPage}
							onNextPage={handleNextCategoriesPage}
							pageSize={categoriesSize}
							onPageSizeChange={handleCategoriesPageSizeChange}
						/>
					)}
				</>
			)}
		</>
	)
}

function OrdersSection() {
	const {
		users,
		loading: loadingUsers,
		error: errorUsers,
		page: usersPage,
		size: usersSize,
		setPage: setUsersPage,
		setSize: setUsersSize,
		totalPages: usersTotalPages,
		searchUserById,
		fetchUsers,
	} = useUsers()

	const [searchTerm, setSearchTerm] = useState('')
	const [selectedUserId, setSelectedUserId] = useState(null)

	const isUserFound = users.some(user => user.id.toString() === searchTerm)

	const handleSearchTermChange = term => {
		setSearchTerm(term)
	}

	const handleSearch = async () => {
		if (searchTerm) {
			await searchUserById(searchTerm)
		}
	}

	const handleCancel = async () => {
		await fetchUsers(0, 5)
	}

	const handleNextUsersPage = () => {
		if (usersPage < usersTotalPages - 1) {
			setUsersPage(usersPage + 1)
		}
	}

	const handlePreviousUsersPage = () => {
		if (usersPage > 0) {
			setUsersPage(usersPage - 1)
		}
	}

	const handleUsersPageSizeChange = event => {
		setUsersSize(parseInt(event.target.value))
		setUsersPage(0)
	}

	return (
		<>
			<div className='tabs__orders-actions'>
				<SearchButton
					onSearchTermChange={handleSearchTermChange}
					onSearch={handleSearch}
					isFound={isUserFound}
					onCancel={handleCancel}
				/>
			</div>
			<OrdersList users={users} searchedId={searchTerm} />
			{!searchTerm && (
				<Pagination
					page={usersPage}
					totalPages={usersTotalPages}
					onPreviousPage={handlePreviousUsersPage}
					onNextPage={handleNextUsersPage}
					pageSize={usersSize}
					onPageSizeChange={handleUsersPageSizeChange}
				/>
			)}
		</>
	)
}
