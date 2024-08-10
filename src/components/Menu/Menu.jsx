import React, { useState } from 'react'
import './Menu.css'

function Menu({ onLoginClick }) {
	let username = localStorage.getItem('username')
	const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false)

	const handleLogout = () => {
		localStorage.removeItem('token') // Удаляем токен из localStorage
		localStorage.removeItem('username') // Удаляем имя пользователя из localStorage
		window.location.reload() // Перезагружаем страницу, чтобы обновить состояние приложения
	}
	const handleMouseEnter = () => {
		setIsLogoutModalVisible(true)
	}

	const handleMouseLeave = () => {
		setIsLogoutModalVisible(false)
	}
	return (
		<div className='menu'>
			<ul className='list'>
				<li
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					style={{ position: 'relative' }}
				>
					{username ? (
						<>
							<span className='username'>{username}</span>
							{/* Модальное окно выхода */}
							{isLogoutModalVisible && (
								<div className='logout-modal'>
									<button onClick={handleLogout} className='logout-button'>
										Выйти
									</button>
								</div>
							)}
						</>
					) : (
						<button onClick={onLoginClick} className='login-button'>
							<svg
								width='40px'
								height='25px'
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									fillRule='evenodd'
									clipRule='evenodd'
									d='M7 3C6.44772 3 6 3.44772 6 4C6 4.55228 6.44772 5 7 5H18C18.5523 5 19 5.44772 19 6V18C19 18.5523 18.5523 19 18 19H7C6.44772 19 6 19.4477 6 20C6 20.5523 6.44772 21 7 21H18C19.6569 21 21 19.6569 21 18V6C21 4.34315 19.6569 3 18 3H7ZM12.7071 7.29289C12.3166 6.90237 11.6834 6.90237 11.2929 7.29289C10.9024 7.68342 10.9024 8.31658 11.2929 8.70711L13.5858 11H4C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H13.5858L11.2929 15.2929C10.9024 15.6834 10.9024 16.3166 11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L16.7071 12.7071C17.0976 12.3166 17.0976 11.6834 16.7071 11.2929L12.7071 7.29289Z'
									fill='#000000'
								/>
							</svg>
							<span>Войти</span>
						</button>
					)}
				</li>
				<li>
					<a href='/'>
						<svg
							width='40px'
							height='25px'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								fill-rule='evenodd'
								clip-rule='evenodd'
								d='M11.3103 1.77586C11.6966 1.40805 12.3034 1.40805 12.6897 1.77586L20.6897 9.39491L23.1897 11.7759C23.5896 12.1567 23.605 12.7897 23.2241 13.1897C22.8433 13.5896 22.2103 13.605 21.8103 13.2241L21 12.4524V20C21 21.1046 20.1046 22 19 22H14H10H5C3.89543 22 3 21.1046 3 20V12.4524L2.18966 13.2241C1.78972 13.605 1.15675 13.5896 0.775862 13.1897C0.394976 12.7897 0.410414 12.1567 0.810345 11.7759L3.31034 9.39491L11.3103 1.77586ZM5 10.5476V20H9V15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15V20H19V10.5476L12 3.88095L5 10.5476ZM13 20V15C13 14.4477 12.5523 14 12 14C11.4477 14 11 14.4477 11 15V20H13Z'
								fill='#000000'
							/>
						</svg>
						<span>Главная</span>
					</a>
				</li>
				{username && (
					<li>
						<a href='/add'>
							<svg
								width='40px'
								height='25px'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'
							>
								<title />

								<g id='Complete'>
									<g id='add-square'>
										<g>
											<rect
												data-name='--Rectangle'
												fill='none'
												height='20'
												id='_--Rectangle'
												rx='2'
												ry='2'
												stroke='#000000'
												stroke-linecap='round'
												stroke-linejoin='round'
												stroke-width='2'
												width='20'
												x='2'
												y='2'
											/>

											<line
												fill='none'
												stroke='#000000'
												stroke-linecap='round'
												stroke-linejoin='round'
												stroke-width='2'
												x1='15.5'
												x2='8.5'
												y1='12'
												y2='12'
											/>

											<line
												fill='none'
												stroke='#000000'
												stroke-linecap='round'
												stroke-linejoin='round'
												stroke-width='2'
												x1='12'
												x2='12'
												y1='15.5'
												y2='8.5'
											/>
										</g>
									</g>
								</g>
							</svg>
							<span>Добавить</span>
						</a>
					</li>
				)}
			</ul>
		</div>
	)
}

export default Menu
