import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header'

export default function MainLayout(){
    const currentLocation = useLocation()
    return (
    <>
        {currentLocation.pathname!='/login' && currentLocation.pathname!='/singup' && <Header />}
        <Outlet />
    </>)
}
