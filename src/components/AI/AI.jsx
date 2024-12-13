import React, { useState, useEffect } from 'react'
import './AI.css'
import Input from '../Input/Input'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

function AI(props) {
	const [showForm, setShowForm] = useState(false)
	const [messages, setMessages] = useState([])
	const [inputValue, setInputValue] = useState('')
	const [isTyping, setIsTyping] = useState(false)
	const [typingDots, setTypingDots] = useState('')

	const handleSendMessage = async event => {
		event.preventDefault()

		if (!inputValue.trim()) return

		const newMessage = { sender: 'user', text: inputValue }
		setMessages(prevMessages => [...prevMessages, newMessage])
		setInputValue('')
		setIsTyping(true)

		try {
			const response = await axios.post('http://localhost:8080/chat', {
				inputValue,
			})

			const aiMessage = { sender: 'ai', text: response.data }
			setMessages(prevMessages => [...prevMessages, aiMessage])
		} catch (error) {
			const errorMessage = {
				sender: 'ai',
				text: 'Произошла ошибка. Попробуйте еще раз.',
			}
			setMessages(prevMessages => [...prevMessages, errorMessage])
			console.error('Error while sending message:', error)
		} finally {
			setIsTyping(false)
		}
	}

	useEffect(() => {
		if (isTyping) {
			const interval = setInterval(() => {
				setTypingDots(prev => {
					if (prev.length < 3) {
						return prev + '.'
					} else {
						return ''
					}
				})
			}, 500)

			return () => clearInterval(interval)
		} else {
			setTypingDots('')
		}
	}, [isTyping])

	return (
		<div className='ai'>
			{showForm ? (
				<div className='ai__chat-container'>
					<div className='ai__chat-container__header'>
						<svg
							width='40px'
							height='35px'
							viewBox='0 0 64 64'
							xmlns='http://www.w3.org/2000/svg'
							strokeWidth='3'
							stroke='#494646'
							fill='none'
						>
							<circle cx='34.52' cy='11.43' r='5.82' />
							<circle cx='53.63' cy='31.6' r='5.82' />
							<circle cx='34.52' cy='50.57' r='5.82' />
							<circle cx='15.16' cy='42.03' r='5.82' />
							<circle cx='15.16' cy='19.27' r='5.82' />
							<circle cx='34.51' cy='29.27' r='4.7' />
							<line x1='20.17' y1='16.3' x2='28.9' y2='12.93' />
							<line x1='38.6' y1='15.59' x2='49.48' y2='27.52' />
							<line x1='50.07' y1='36.2' x2='38.67' y2='46.49' />
							<line x1='18.36' y1='24.13' x2='30.91' y2='46.01' />
							<line x1='20.31' y1='44.74' x2='28.7' y2='48.63' />
							<line x1='17.34' y1='36.63' x2='31.37' y2='16.32' />
							<line x1='20.52' y1='21.55' x2='30.34' y2='27.1' />
							<line x1='39.22' y1='29.8' x2='47.81' y2='30.45' />
							<line x1='34.51' y1='33.98' x2='34.52' y2='44.74' />
						</svg>
						<span>AI ассистент</span>
						<button
							className='ai__chat-container__header__close-button'
							onClick={() => setShowForm(false)}
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
									d='M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z'
									fill='#0F1729'
								/>
							</svg>
						</button>
					</div>
					<div className='ai__chat-container__chat-messages'>
						{messages.map((message, index) => (
							<div
								key={index}
								className={`ai__chat-container__chat-messages__message ai__chat-container__chat-messages__message--${message.sender}`}
							>
								{message.sender === 'ai' ? (
									<ReactMarkdown>{message.text}</ReactMarkdown>
								) : (
									message.text
								)}
							</div>
						))}
						{isTyping && (
							<div className='ai__chat-container__chat-messages__message ai__chat-container__chat-messages__message--ai'>
								Печатает{typingDots}
							</div>
						)}
					</div>
					<div className='ai__chat-container__input'>
						<Input
							type='text'
							value={inputValue}
							onChange={e => setInputValue(e.target.value)}
							placeholder='Введите сообщение...'
						/>
						<button onClick={handleSendMessage}>
							<svg
								width='40px'
								height='25px'
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M20.7639 12H10.0556M3 8.00003H5.5M4 12H5.5M4.5 16H5.5M9.96153 12.4896L9.07002 15.4486C8.73252 16.5688 8.56376 17.1289 8.70734 17.4633C8.83199 17.7537 9.08656 17.9681 9.39391 18.0415C9.74792 18.1261 10.2711 17.8645 11.3175 17.3413L19.1378 13.4311C20.059 12.9705 20.5197 12.7402 20.6675 12.4285C20.7961 12.1573 20.7961 11.8427 20.6675 11.5715C20.5197 11.2598 20.059 11.0295 19.1378 10.5689L11.3068 6.65342C10.2633 6.13168 9.74156 5.87081 9.38789 5.95502C9.0808 6.02815 8.82627 6.24198 8.70128 6.53184C8.55731 6.86569 8.72427 7.42461 9.05819 8.54246L9.96261 11.5701C10.0137 11.7411 10.0392 11.8266 10.0493 11.9137C10.0583 11.991 10.0582 12.069 10.049 12.1463C10.0387 12.2334 10.013 12.3188 9.96153 12.4896Z'
									stroke='#faf9f8'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						</button>
					</div>
				</div>
			) : (
				<button className='ai__open-button' onClick={() => setShowForm(true)}>
					<svg
						width='40px'
						height='35px'
						viewBox='0 0 64 64'
						xmlns='http://www.w3.org/2000/svg'
						strokeWidth='3'
						stroke='#faf9f8'
						fill='none'
					>
						<circle cx='34.52' cy='11.43' r='5.82' />
						<circle cx='53.63' cy='31.6' r='5.82' />
						<circle cx='34.52' cy='50.57' r='5.82' />
						<circle cx='15.16' cy='42.03' r='5.82' />
						<circle cx='15.16' cy='19.27' r='5.82' />
						<circle cx='34.51' cy='29.27' r='4.7' />
						<line x1='20.17' y1='16.3' x2='28.9' y2='12.93' />
						<line x1='38.6' y1='15.59' x2='49.48' y2='27.52' />
						<line x1='50.07' y1='36.2' x2='38.67' y2='46.49' />
						<line x1='18.36' y1='24.13' x2='30.91' y2='46.01' />
						<line x1='20.31' y1='44.74' x2='28.7' y2='48.63' />
						<line x1='17.34' y1='36.63' x2='31.37' y2='16.32' />
						<line x1='20.52' y1='21.55' x2='30.34' y2='27.1' />
						<line x1='39.22' y1='29.8' x2='47.81' y2='30.45' />
						<line x1='34.51' y1='33.98' x2='34.52' y2='44.74' />
					</svg>
				</button>
			)}
		</div>
	)
}

export default AI
