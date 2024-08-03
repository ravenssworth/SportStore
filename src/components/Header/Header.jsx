import React from 'react'
import Input from '../Input/Input'
import Menu from '../Menu/Menu'
import './Header.css'

function Header(props) {
	return (
		<header>
			<div className='header__menu'>
				<Menu />
			</div>
			<div className='input-container'>
				<Input placeholder={'Поиск...'} />
			</div>
		</header>
	)
}

export default Header
