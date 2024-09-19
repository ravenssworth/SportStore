import { Route, Routes } from 'react-router-dom'
import './App.css'
import AddPage from './pages/Add/AddPage.jsx'
import MainPage from './pages/Main/MainPage.jsx'
import ProductInfo from './pages/ProductInfoPage/ProductInfoPage.jsx'

function App() {
	return (
		<Routes>
			<Route path='/' element={<MainPage />} />
			<Route path='/add' element={<AddPage />}></Route>
			<Route path='/product/:id' element={<ProductInfo />}></Route>
		</Routes>
	)
}

export default App
