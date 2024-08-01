import { Routes, Route } from 'react-router-dom'
import AddPage from './pages/Add/AddPage.jsx'
import MainPage from './pages/Main/MainPage.jsx'
import './App.css'

function App() {
	return (
		<>
			<Routes>
				<Route path='/' element={<MainPage />} />
				<Route path='/add' element={<AddPage />}></Route>
			</Routes>
		</>
	)
}

export default App
