import React from 'react'
import './Pagination.css'

function Pagination({
	page,
	totalPages,
	onNextPage,
	onPreviousPage,
	pageSize,
	onPageSizeChange,
}) {
	return (
		<div className='pagination'>
			<div className='pagination--switch'>
				<button
					id='pagination--previous'
					onClick={onPreviousPage}
					disabled={page === 0}
				></button>
				<label htmlFor='pagination--previous'>
					<svg
						width='40px'
						height='25px'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<polyline
							fill='none'
							stroke='#000000'
							strokeWidth='2'
							points='7 2 17 12 7 22'
							transform='matrix(-1 0 0 1 24 0)'
						/>
					</svg>
				</label>
				<span>
					Страница {page + 1} из {totalPages}
				</span>
				<button
					id='pagination--next'
					onClick={onNextPage}
					disabled={page === totalPages - 1}
				></button>
				<label htmlFor='pagination--next'>
					<svg
						width='40px'
						height='25px'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<polyline
							fill='none'
							stroke='#000000'
							strokeWidth='2'
							points='7 2 17 12 7 22'
						/>
					</svg>
				</label>
			</div>
			<select value={pageSize} onChange={onPageSizeChange}>
				<option value={5}>5</option>
				<option value={10}>10</option>
				<option value={20}>20</option>
			</select>
		</div>
	)
}

export default Pagination
