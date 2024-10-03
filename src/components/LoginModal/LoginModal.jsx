import React, { useState } from 'react'
import './LoginModal.css'
import Input from '../Input/Input'
import RegisterModal from '../RegisterModal/RegisterModal'
import axios from 'axios'

function LoginModal({ isOpen, onClose }) {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [isRegisterOpen, setIsRegisterOpen] = useState(false)
	const [error, setError] = useState(null)

	if (!isOpen) return null

	const handleUsernameChange = e => {
		setUsername(e.target.value)
	}

	const handlePasswordChange = e => {
		setPassword(e.target.value)
	}

	const handleRegisterClick = () => {
		setIsRegisterOpen(true)
	}

	const handleLoginSubmit = async e => {
		e.preventDefault()
		setError(null)

		try {
			// Первый запрос: Логин и получение токена
			const response = await fetch('http://localhost:8080/api/users/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			})

			if (!response.ok) {
				const errorData = await response.text()
				throw new Error(errorData || 'Login failed')
			}

			const token = await response.text() // Получаем токен как строку
			localStorage.setItem('token', token) // Сохраняем токен

			// Второй запрос: Получение имени пользователя
			const userResponse = await fetch(
				`http://localhost:8080/api/users/username`, // Передача токена в URL
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			)

			if (!userResponse.ok) {
				const errorData = await userResponse.text()
				throw new Error(errorData || 'Failed to retrieve username')
			}

			const user = await userResponse.text() // Получаем имя пользователя как строку
			localStorage.setItem('username', user) // Сохранение имени пользователя в локальном хранилище

			const userData = await axios.post('http://localhost:8080/api/users/all', {
				username: user,
			})

			const userId =
				userData.data.content.length > 0 ? userData.data.content[0].id : null

			localStorage.setItem('userId', userId)

			onClose() // Закрываем модальное окно
			location.reload()
		} catch (err) {
			setError(
				err.message ||
					'Failed to login. Please check your username and password.'
			)
		}
	}

	return (
		<div className='modal-overlay-login'>
			<div className='modal-content'>
				<form onSubmit={handleLoginSubmit}>
					<div className='form-top'>
						<h2>Вход</h2>
						<button className='close-button' onClick={onClose}>
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
									d='M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z'
									fill='#0F1729'
								/>
							</svg>
						</button>
					</div>

					{/* Отображение ошибки */}
					{error && (
						<div className='error-message'>Неправильный логин или пароль</div>
					)}

					<Input
						id='username'
						value={username}
						placeholder='Имя пользователя'
						onChange={handleUsernameChange}
					/>

					<Input
						id='password'
						value={password}
						placeholder='Пароль'
						type='password'
						onChange={handlePasswordChange}
					/>

					<button type='submit' className='enter-button'>
						Войти
					</button>
					<button
						type='button'
						className='register-button'
						onClick={handleRegisterClick}
					>
						Зарегистрироваться
						<svg
							width='25px'
							height='25px'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M4 12H20M20 12L16 8M20 12L16 16'
								stroke='#faf9f8'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</button>
				</form>
			</div>
			<RegisterModal
				isOpen={isRegisterOpen}
				onClose={() => setIsRegisterOpen(false)}
			/>
		</div>
	)
}

export default LoginModal
