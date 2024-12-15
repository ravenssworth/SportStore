import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Cart from '../Cart/Cart'
import './Menu.css'

function Menu({ onLoginClick }) {
	const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false)
	const [isAdmin, setIsAdmin] = useState(false)
	const [username, setUsername] = useState(localStorage.getItem('username'))
	const [showCart, setShowCart] = useState(false)
	const [cart, setCart] = useState({ cartItems: [] })
	const [timeoutId, setTimeoutId] = useState(null)
	const navigate = useNavigate()
	const location = useLocation()

	useEffect(() => {
		const checkUserRole = async () => {
			const token = localStorage.getItem('token')
			console.log(token)

			if (token) {
				try {
					const response = await fetch('http://localhost:8080/api/users/role', {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
					})

					if (response.ok) {
						const roles = await response.json()
						localStorage.setItem('roles', JSON.stringify(roles))

						if (roles.includes('ROLE_ADMIN')) {
							setIsAdmin(true)
						}
					} else {
						console.error('Не удалось получить роли пользователя')
					}
				} catch (error) {
					console.error('Ошибка при проверке роли:', error)
				}
			}
		}

		checkUserRole()
	}, [])
	const storedId = localStorage.getItem('userId')

	const handleGetCart = async event => {
		const response = await axios.get(
			`http://localhost:8080/api/cart/user/${storedId}`
		)

		setCart(response.data)
	}

	const handleLogout = () => {
		localStorage.removeItem('token')
		localStorage.removeItem('username')
		localStorage.removeItem('userId')
		localStorage.removeItem('roles')
		setUsername(null)
		if (location.pathname === '/add') {
			navigate('/')
		} else {
			window.location.reload()
		}
	}
	const handleMouseEnter = () => {
		if (timeoutId) {
			clearTimeout(timeoutId)
			setTimeoutId(null)
		}
		setIsLogoutModalVisible(true)
	}

	const handleMouseLeave = () => {
		const id = setTimeout(() => {
			setIsLogoutModalVisible(false)
		}, 300)
		setTimeoutId(id)
	}
	return (
		<div className='menu'>
			<Cart
				show={showCart}
				closeCart={() => setShowCart(false)}
				cart={cart}
				onLoginClick={onLoginClick}
			/>
			<ul className='list'>
				<li>
					<a href='/' id='id-1'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='1em'
							height='1em'
							viewBox='0 0 1024 1024'
							strokeWidth='0'
							fill='currentColor'
							stroke='currentColor'
							className='icon'
						>
							<path d='M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z'></path>
						</svg>
					</a>
				</li>

				<li style={{ position: 'relative' }}>
					<button
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						className='menu__list__button'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='1em'
							height='1em'
							viewBox='0 0 24 24'
							strokeWidth='0'
							fill='currentColor'
							stroke='currentColor'
							className='icon-1'
						>
							<path d='M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z'></path>
						</svg>

						{username ? (
							<>
								{isLogoutModalVisible && (
									<div
										className={`menu__list__modal ${
											isLogoutModalVisible ? 'visible' : ''
										}`}
									>
										{username && isAdmin && (
											<a href='/add' className='menu__list__modal__tab__add'>
												<svg
													width='30px'
													height='30px'
													viewBox='0 0 24 24'
													xmlns='http://www.w3.org/2000/svg'
												>
													<title />

													<g id='Complete'>
														<g data-name='add' id='add-2'>
															<g>
																<line
																	fill='none'
																	stroke='#494646'
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	strokeWidth='2'
																	x1='12'
																	x2='12'
																	y1='19'
																	y2='5'
																/>

																<line
																	fill='none'
																	stroke='#494646'
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	strokeWidth='2'
																	x1='5'
																	x2='19'
																	y1='12'
																	y2='12'
																/>
															</g>
														</g>
													</g>
												</svg>
												<div className='menu__list__modal__tabs__tooltip'>
													Добавление
												</div>
											</a>
										)}
										{username && (
											<a
												href='/orders'
												className='menu__list__modal__tab__orders'
											>
												<svg
													fill='#494646'
													xmlns='http://www.w3.org/2000/svg'
													width='25px'
													height='25px'
													viewBox='0 0 52 52'
													enableBackground='new 0 0 52 52'
													xmlSpace='preserve'
												>
													<g>
														<path
															d='M24.3,36.5c0.7,0,1.4,0.1,2,0.3L15.5,6.2c0,0,0,0,0,0l-1-3c-0.3-0.9-1.2-1.3-2-1L3.1,5.3
		c-0.9,0.3-1.3,1.2-1,2l1,3c0.3,0.9,1.2,1.3,2,1L10,9.7l9.9,28.1C21.2,37,22.7,36.5,24.3,36.5z'
														/>
														<path
															d='M41.2,29.2l-9.9,3.5c-1,0.4-2.2-0.2-2.5-1.2l-3.5-9.9c-0.4-1,0.2-2.2,1.2-2.5l9.9-3.5
		c1-0.4,2.2,0.2,2.5,1.2l3.5,9.9C42.8,27.7,42.2,28.8,41.2,29.2z'
														/>
														<path
															d='M31.8,12.9l-6.7,2.3c-1,0.4-2.2-0.2-2.5-1.2l-2.3-6.7c-0.4-1,0.2-2.2,1.2-2.5l6.7-2.3
		c1-0.4,2.2,0.2,2.5,1.2l2.3,6.7C33.4,11.3,32.9,12.5,31.8,12.9z'
														/>
														<path
															d='M49.9,35.5l-1-3c-0.3-0.9-1.2-1.3-2-1l-18.2,6.3c1.9,1.2,3.2,3.2,3.6,5.5l16.7-5.7
		C49.8,37.3,50.2,36.4,49.9,35.5z'
														/>
														<path d='M24.3,39.1c-3,0-5.5,2.5-5.5,5.5c0,3,2.5,5.5,5.5,5.5s5.5-2.5,5.5-5.5C29.8,41.5,27.3,39.1,24.3,39.1z' />
													</g>
												</svg>
												<div className='menu__list__modal__tabs__tooltip'>
													Заказы
												</div>
											</a>
										)}
										<button
											onClick={handleLogout}
											className='menu__list__logout-button'
										>
											<svg
												width='30px'
												height='30px'
												viewBox='0 0 24 24'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													fillRule='evenodd'
													clipRule='evenodd'
													d='M7 3C6.44772 3 6 3.44772 6 4C6 4.55228 6.44772 5 7 5H18C18.5523 5 19 5.44772 19 6V18C19 18.5523 18.5523 19 18 19H7C6.44772 19 6 19.4477 6 20C6 20.5523 6.44772 21 7 21H18C19.6569 21 21 19.6569 21 18V6C21 4.34315 19.6569 3 18 3H7ZM12.7071 7.29289C12.3166 6.90237 11.6834 6.90237 11.2929 7.29289C10.9024 7.68342 10.9024 8.31658 11.2929 8.70711L13.5858 11H4C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H13.5858L11.2929 15.2929C10.9024 15.6834 10.9024 16.3166 11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L16.7071 12.7071C17.0976 12.3166 17.0976 11.6834 16.7071 11.2929L12.7071 7.29289Z'
													fill='#494646'
												/>
											</svg>
											<div className='menu__list__modal__tabs__tooltip'>
												Выйти
											</div>
										</button>
									</div>
								)}
							</>
						) : (
							<>
								{isLogoutModalVisible && (
									<div className='menu__list__login-modal'>
										<span className='menu__list__login-modal__text'>
											Войдите, чтобы воспользоваться всеми возможностями
											магазина
										</span>
										<button
											onClick={onLoginClick}
											className='menu__list__login-modal__login-button'
										>
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
													fill='#494646'
												/>
											</svg>
											<span className='menu__list__login-modal__login-button__text'>
												Войти или зарегистрироваться
											</span>
										</button>
									</div>
								)}
							</>
						)}
					</button>
				</li>

				<li>
					<button
						className='menu__list__button'
						onClick={() => {
							setShowCart(!showCart)
							handleGetCart()
						}}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='1em'
							height='1em'
							strokeLinejoin='round'
							strokeLinecap='round'
							viewBox='0 0 24 24'
							strokeWidth='2'
							fill='none'
							stroke='currentColor'
							className='icon-2'
						>
							<circle r='1' cy='21' cx='9'></circle>
							<circle r='1' cy='21' cx='20'></circle>
							<path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'></path>
						</svg>
					</button>
				</li>
			</ul>
		</div>
	)
}

export default Menu
