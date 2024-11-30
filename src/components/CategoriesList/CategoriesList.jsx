import React from 'react'
import './CategoriesList.css'
import DeleteButton from '../DeleteButton/DeleteButton.jsx'

function CategoriesList({ categories, onDeleteCategory, searchedId }) {
	if (categories.length === 0) {
		return <p>Категории не найдены</p>
	}

	const filteredCategories = searchedId
		? categories.filter(category => category.id.toString() === searchedId)
		: categories

	return (
		<div className='categories-list-container'>
			{filteredCategories.length > 0 ? (
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Название Категории</th>
							<th>Описание категории</th>
							<th>Действия</th>
						</tr>
					</thead>
					<tbody>
						{filteredCategories.map(category => (
							<tr key={category.id}>
								<td>{category.id}</td>
								<td>{category.categoryName}</td>
								<td>{category.categoryDescription}</td>
								<td>
									<DeleteButton onClick={() => onDeleteCategory(category.id)} />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>
					На этой странице категория не найдена, попробуйте выполнить глобальный
					поиск.
				</p>
			)}
		</div>
	)
}

export default CategoriesList
