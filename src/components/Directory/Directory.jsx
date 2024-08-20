import React from 'react'
import useCategories from '../../hooks/useCategories'
import './Directory.css'
function Directory({ onCategorySelect }) {
	const { categories } = useCategories()
	return (
		<div className='directory'>
			<ul className='directory__list'>
				{categories.map(category => (
					<li key={category.id}>
						<a href='#' onClick={() => onCategorySelect(category.id)}>
							{category.categoryName}
						</a>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Directory
