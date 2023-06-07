import { Navigate} from "react-router-dom";
import {useEffect, useState} from 'react'

export default function LogoutPage(){
    
    const [LogoutState, setLogoutState] = useState(false)

    useEffect(()=>{
        const logoutRecruiter = async ()=> {
            const res = await fetch('http://localhost:3500/api/recruiter/logout', {credentials: 'include'})
            if(res.ok){
                setLogoutState(true)
            }
        }
        logoutRecruiter()
    },[])

    return (LogoutState?<Navigate to={'/login'} replace={true} />:<h1>Saindo...</h1>)
}
