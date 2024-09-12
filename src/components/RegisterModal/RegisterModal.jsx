import React, { useState } from 'react'
import './RegisterModal.css'
import Input from '../Input/Input'
import axios from 'axios'

function RegisterModal({ isOpen, onClose }) {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [email, setEmail] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [address, setAddress] = useState('')
	const [phoneNumber, setPhoneNumber] = useState('')
	const [role, setRole] = useState('USER') // Предположим, что роль по умолчанию "USER"
	const [errorMessage, setErrorMessage] = useState('')

	if (!isOpen) return null

	const handleSubmit = async e => {
		e.preventDefault()
		setErrorMessage('')

		try {
			// POST-запрос на сервер для регистрации
			const response = await axios.post('http://localhost:8080/api/users', {
				username,
				password,
				email,
				firstName,
				lastName,
				address,
				phoneNumber,
				role: { name: role }, // Пример роли
				createdDate: new Date().toISOString(),
				lastModifiedDate: new Date().toISOString(),
			})

			// Обработка успешной регистрации
			if (response.status === 201) {
				console.log('Пользователь успешно создан:', response.data)
				onClose() // Закрытие модального окна после успешной регистрации
				alert('Подтвердите свой аккаунт')
			}
		} catch (error) {
			// Обработка ошибок
			console.error('Ошибка при регистрации:', error)
			setErrorMessage('Ошибка при регистрации. Пожалуйста, попробуйте снова.')
		}
	}

	return (
		<div className='modal-overlay-register'>
			<div className='modal-content'>
				<form onSubmit={handleSubmit}>
					<div className='form-top'>
						<h2>Регистрация</h2>
						<button className='close-button' onClick={onClose}>
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
									d='M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z'
									fill='#0F1729'
								/>
							</svg>
						</button>
					</div>
					<Input
						id='username'
						value={username}
						placeholder='Имя пользователя'
						onChange={e => setUsername(e.target.value)}
					/>
					<Input
						id='password'
						value={password}
						placeholder='Пароль'
						onChange={e => setPassword(e.target.value)}
					/>
					<Input
						id='email'
						value={email}
						placeholder='Email'
						onChange={e => setEmail(e.target.value)}
					/>
					<Input
						id='firstName'
						value={firstName}
						placeholder='Имя'
						onChange={e => setFirstName(e.target.value)}
					/>
					<Input
						id='lastName'
						value={lastName}
						placeholder='Фамилия'
						onChange={e => setLastName(e.target.value)}
					/>
					<Input
						id='address'
						value={address}
						placeholder='Адрес'
						onChange={e => setAddress(e.target.value)}
					/>
					<Input
						id='phoneNumber'
						value={phoneNumber}
						placeholder='Номер телефона'
						onChange={e => setPhoneNumber(e.target.value)}
					/>
					{errorMessage && <div className='error-message'>{errorMessage}</div>}

					<button type='submit' className='register-submit-button'>
						Зарегистрироваться
					</button>
				</form>
			</div>
		</div>
	)
}

export default RegisterModal
