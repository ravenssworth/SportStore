import React from 'react'
import './CategoriesList.css'
import DeleteButton from '../DeleteButton/DeleteButton.jsx'

function CategoriesList({ categories, onDeleteCategory }) {
	if (categories.length === 0) {
		return <p>No categories found</p>
	}

	return (
		<div className='categories-list-container'>
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
					{categories.map(category => (
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
		</div>
	)
}

export default CategoriesList
