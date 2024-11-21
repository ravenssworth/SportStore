import { React, useState } from 'react'
import './SearchButton.css'
import Input from '../Input/Input'

function SearchButton({ onSearchTermChange }) {
	const [showForm, setShowForm] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')

	const handleFindUsers = () => {
		setShowForm(true)
	}

	const handleInputChange = e => {
		const value = e.target.value
		setSearchTerm(value)
		onSearchTermChange(value)
	}
	return (
		<>
			{showForm ? (
				<div className='search-button__input'>
					<Input
						placeholder={'Введите ID'}
						value={searchTerm}
						onChange={handleInputChange}
					/>
					<button
						className='search-button__cancel-button'
						onClick={() => {
							setShowForm(false)
							setSearchTerm('')
							onSearchTermChange('')
						}}
					>
						Отмена
					</button>
				</div>
			) : (
				<button className='search-button__button' onClick={handleFindUsers}>
					<svg
						width='25px'
						height='25px'
						viewBox='0 -0.5 25 25'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='search-button__button__find-svgIcon'
					>
						<path
							fillRule='evenodd'
							clipRule='evenodd'
							d='M5.5 10.7655C5.50003 8.01511 7.44296 5.64777 10.1405 5.1113C12.8381 4.57483 15.539 6.01866 16.5913 8.55977C17.6437 11.1009 16.7544 14.0315 14.4674 15.5593C12.1804 17.0871 9.13257 16.7866 7.188 14.8415C6.10716 13.7604 5.49998 12.2942 5.5 10.7655Z'
							stroke='#faf9f8'
							strokeWidth='1.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
						<path
							d='M17.029 16.5295L19.5 19.0005'
							stroke='#faf9f8'
							strokeWidth='1.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				</button>
			)}
		</>
	)
}

export default SearchButton