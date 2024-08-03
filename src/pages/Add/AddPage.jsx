import React from 'react'
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

function AddPage() {
	const {
		categories,
		loading: loadingCategories,
		error: errorCategories,
		setCategories,
	} = useCategories() // Используем хук
	const {
		products,
		loading: loadingProducts,
		error: errorProducts,
		setProducts,
	} = useProducts()

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
						/>
						<label htmlFor='tab1' className='tabs__label'>
							Добавить продукт
						</label>
						<div id='content-tab1' className='tabs__block'>
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
								<ProductsList
									products={products}
									onDeleteProduct={handleDeleteProduct}
								/>
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
								<CategoriesList
									categories={categories}
									onDeleteCategory={handleDeleteCategory}
								/>
							)}
						</div>
					</nav>
				</div>
			</div>
		</div>
	)
}

export default AddPage
