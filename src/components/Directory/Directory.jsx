import React from 'react'
import useCategories from '../../hooks/useCategories'
import './Directory.css'
function Directory({ onCategorySelect, selectedCategory }) {
	const { categories } = useCategories()
	return (
		<div className='directory'>
			<ul className='directory__list'>
				{categories.map(category => (
					<li key={category.id}>
						<button
							onClick={() => onCategorySelect(category.id)}
							className={
								selectedCategory === category.id
									? 'directory__button active'
									: 'directory__button'
							}
						>
							{category.categoryName}
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Directory
