import { Route, Routes } from 'react-router-dom'
import './App.css'
import AddPage from './pages/Add/AddPage.jsx'
import MainPage from './pages/Main/MainPage.jsx'

function App() {
	return (
		<Routes>
			<Route path='/' element={<MainPage />} />
			<Route path='/add' element={<AddPage />}></Route>
		</Routes>
	)
}

export default App
