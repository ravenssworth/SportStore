import React from 'react'
import './Input.css'

function Input({ id, name, value, placeholder, onChange }) {
	return (
		<div className='input-container'>
			<input
				type='text'
				id={id}
				name={name} // Добавьте этот атрибут
				value={value}
				onChange={onChange}
				required=''
				placeholder={placeholder}
			/>
			<div className='underline'></div>
		</div>
	)
}

export default Input
