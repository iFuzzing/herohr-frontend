import ReactDOM from 'react-dom/client'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'

import './css/App.css'

import MainLayout from './pages/MainLayout'
import LoginPage from './pages/LoginPage'
import SingupPage from './pages/SingupPage'
import CompaniesPage from './pages/CompaniesPage'
import JobsPage from './pages/JobsPage'
import StepsPage from './pages/StepsPage'
import ApplicantsPage from './pages/ApplicantsPage'

import {action as actionSingup} from './pages/SingupPage'
import {action as actionLogin} from './pages/LoginPage'
import {loader as loaderLogin} from './pages/LoginPage'
import {loader as loaderSingup} from './pages/SingupPage'
import LogoutPage from './pages/LogoutPage'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<MainLayout />}>
    <Route index element={<CompaniesPage />} />
    <Route path='login' loader={loaderLogin} action={actionLogin} element={<LoginPage />} />
    <Route path='logout' element={<LogoutPage />} />
    <Route path='singup' loader={loaderSingup} action={actionSingup} element={<SingupPage />} />
    <Route path='jobs' element={<JobsPage />} />
    <Route path='steps' element={<StepsPage />} />
    <Route path='applicants' element={<ApplicantsPage />} />
  </Route>
))

function App() {
  return (<RouterProvider router={router} />)
}

export default App

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />)
