import React from 'react'
import Input from '../Input/Input'
import Menu from '../Menu/Menu'
import './Header.css'

function Header({ searchTerm, onSearchChange, onLoginClick }) {
	return (
		<header>
			<div className='header-logo'>
				<img src='./src/assets/logo.png' alt='' />
				{/* <span>АСБЕСТ</span> */}
			</div>
			<div className='header-container__input'>
				<Input
					placeholder={'Поиск...'}
					value={searchTerm}
					onChange={e => onSearchChange(e.target.value)}
				/>
			</div>
			<div className='header-container__menu'>
				<Menu onLoginClick={onLoginClick} />
			</div>
		</header>
	)
}

export default Header
