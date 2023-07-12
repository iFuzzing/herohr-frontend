import { Navigate} from "react-router-dom";
import {useEffect, useState} from 'react'
import { API_SERVER } from "../utils/utils";

export default function LogoutPage(){
    
    const [LogoutState, setLogoutState] = useState(false)

    useEffect(()=>{
        const logoutRecruiter = async ()=> {
            const res = await fetch(API_SERVER+'/api/recruiter/logout', {credentials: 'include'})
            if(res.ok){
                setLogoutState(true)
            }
        }
        logoutRecruiter()
    },[])

    return (LogoutState?<Navigate to={'/login'} replace={true} />:<h1>Saindo...</h1>)
}
