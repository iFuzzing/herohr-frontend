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
import {action as actionCompanies} from './pages/CompaniesPage' 
import {action as actionJobs} from './pages/JobsPage'
import {action as actionSteps} from './pages/StepsPage'
import {action as actionApplicants} from './pages/ApplicantsPage'

import {loader as loaderLogin} from './pages/LoginPage'
import {loader as loaderSingup} from './pages/SingupPage'
import {loader as loaderCompanies} from './pages/CompaniesPage'
import {loader as loaderJobs} from './pages/JobsPage'
import {loader as loaderSteps} from './pages/StepsPage'
import {loader as loaderApplicants} from './pages/ApplicantsPage'
import LogoutPage from './pages/LogoutPage'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<MainLayout />}>
    <Route index loader={loaderCompanies} action={actionCompanies} element={<CompaniesPage />} />
    <Route path='login' loader={loaderLogin} action={actionLogin} element={<LoginPage />} />
    <Route path='logout' element={<LogoutPage />} />
    <Route path='singup' loader={loaderSingup} action={actionSingup} element={<SingupPage />} />
    <Route path='jobs' loader={loaderJobs} action={actionJobs} element={<JobsPage />} />
    <Route path='steps' loader={loaderSteps} action={actionSteps} element={<StepsPage />} />
    <Route path='applicants' loader={loaderApplicants} action={actionApplicants} element={<ApplicantsPage />} />
  </Route>
))

function App() {
  return (<RouterProvider router={router} />)
}

export default App

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />)
