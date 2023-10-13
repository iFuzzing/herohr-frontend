import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom'
import ImageGGprofile from '../assets/images/mix/gg_profile.png'
import ImageUxNavIndicator from '../assets/images/mix/ux-nav-Indicator.svg'
import ImageUxNavIndicatorBullet from '../assets/images/mix/ux-nav-indicator-bullet.svg'
import ImageUxNavIndicatorBulletEmpty from '../assets/images/mix/ux-nav-indicator-bullet-empty.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBars, faBriefcase, faCircleUser, faFlag, faHome, faUsers } from '@fortawesome/free-solid-svg-icons'
import { getRecruiterName } from '../utils/utils'
import { useState } from 'react'

export default function Header(){
    const currentPage = useLocation().pathname
    const [searchparams, setSearchParams] = useSearchParams()
    const company_id = searchparams.get('company')
    const jobid = searchparams.get('job')
    const step = searchparams.get('step')

    const [recruiterName, setRecruiterName] = useState('')

    getRecruiterName().then(name=>{
        setRecruiterName(name)
    })

    return(
        <>
        <header className='sm:hidden justify-between flex flex-col px-5 py-2 h-48 bg-app-base-primary text-white font-Kanit font-bold'>
            <div className='flex justify-between'>
                <button>
                    <FontAwesomeIcon className='text-2xl' icon={faBars} />
                </button>
                <button>
                    <FontAwesomeIcon className='text-2xl' icon={faCircleUser} />
                </button>
            </div>
            <h1 className="text-center uppercase text-2xl">HERO HR</h1>
            <nav className="overflow-hidden shadow-lg shadow-black/25 bg-white text-label-primary p-3 rounded-md flex flex-row items-center justify-center">
                <ul className='flex flex-row gap-7 uppercase font-Roboto font-medium items-center text-2xl'>
                    <NavLink to='.' className={isActive=>(isActive.isActive?'text-app-base-primary':'')}><li><FontAwesomeIcon icon={faHome} /></li></NavLink>
                    <NavLink to='jobs' className={isActive=>(isActive.isActive?'text-app-base-primary':'')}><li><FontAwesomeIcon icon={faBriefcase} /></li></NavLink>
                    <NavLink to='steps' className={isActive=>(isActive.isActive?'text-app-base-primary':'')}><li><FontAwesomeIcon icon={faFlag} /></li></NavLink>
                    <NavLink to='applicants' className={isActive=>(isActive.isActive?'text-app-base-primary':'')}><li><FontAwesomeIcon icon={faUsers} /></li></NavLink>
                </ul>
            </nav>
        </header>
        <aside className='hidden overflow-hidden sm:block h-screen bg-gradient-to-b from-app-base-primary to-app-base-primary/60 text-white w-1/4 max-w-[250px] float-left'>
            <div className="p-4 flex flex-row items-center gap-2 w-full border-b-[1px] border-active-primary/20">
                <img className="w-16 bg-white rounded-full p-5" src={ImageGGprofile} alt=""  />
                <h1 className="font-Roboto font-normal text-base flex flex-col">
                   {recruiterName} 
                    <span className='text-xs'>Recrutador (a)</span>
                </h1>
            </div>
            <div className="h-4/5 flex flex-col text-center items-center content-center pt-10 justify-between">
                <nav className="flex flex-col gap-5 w-full text-center">
                    <h1 className="font-Kanit font-bold text-3xl uppercase">HERO HR</h1>
                    <ul className="sm:relative font-Kanit font-normal text-base flex flex-col">
                    <div className="hidden sm:block absolute w-[25%] h-[95%]">
                        <img className='w-full h-full' src={ImageUxNavIndicator} alt="" />
                        <img className='animate-pulsein absolute top-[10%] w-full h-[10%] scale-90' src={ImageUxNavIndicatorBullet} alt="" />
                        <img className={'absolute top-[35%] w-full h-[10%] '+(currentPage == '/jobs'||currentPage=='/steps'||currentPage=='/applicants'?'scale-90 animate-pulsein':'scale-50')} src={currentPage == '/jobs'||currentPage=='/steps'||currentPage == '/applicants'?ImageUxNavIndicatorBullet:ImageUxNavIndicatorBulletEmpty} alt="" />
                        <img className={'absolute top-[60%] w-full h-[10%] '+(currentPage == '/steps'||currentPage=='/applicants'?'scale-90 animate-pulsein':'scale-50')} src={currentPage == '/steps'||currentPage=='/applicants'?ImageUxNavIndicatorBullet:ImageUxNavIndicatorBulletEmpty} alt="" />
                        <img className={'absolute top-[85%] w-full h-[10%] '+(currentPage == '/applicants'?'scale-90 animate-pulsein':'scale-50')} src={currentPage == '/applicants'?ImageUxNavIndicatorBullet:ImageUxNavIndicatorBulletEmpty} alt="" />
                    </div>
                        <NavLink to='.' className={({isActive})=>{return 'duration-100 py-5 h-10 flex items-center justify-start text-white  pl-[20%] w-full hover:border-white hover:border-r-4' + (isActive?' border-r-4 border-active-primary':'')}}>
                            <li className="">
                                <FontAwesomeIcon className='mr-2 float-left text-xl' icon={faHome} />
                                Empresas
                            </li>
                        </NavLink>
                            <NavLink to={'/jobs'+(company_id!=null?`?company=${company_id}`:'')} className={({isActive})=>{return 'duration-100 py-5 h-10 flex items-center justify-start pl-[20%] w-full hover:border-white hover:border-r-4 ' +(isActive?' border-r-4 border-active-primary ':'') +(isActive || currentPage == '/steps' || currentPage == '/applicants'?' text-white':' text-white/50')}}>
                            <li className="">
                                    <FontAwesomeIcon className='mr-2 float-left text-xl' icon={faBriefcase} />
                                Vagas
                            </li>
                        </NavLink>
                        <NavLink to={`/steps?company=${company_id}&job=${jobid}`} className={({isActive})=>{return 'duration-100 py-5 h-10 flex items-center justify-start pl-[20%] w-full hover:border-white hover:border-r-4 ' +(isActive?'border-r-4 border-active-primary':'') + (isActive||currentPage=='/applicants'?' text-white':' text-white/50')}}>
                            <li className="">
                                    <FontAwesomeIcon className='mr-2 float-left text-xl' icon={faFlag} />
                                Etapas
                            </li>
                        </NavLink>
                        <NavLink to='/applicants' className={({isActive})=>{return 'duration-100 py-5 h-10 flex items-center justify-start pl-[20%] w-full hover:border-white hover:border-r-4' + (isActive?' border-r-4 border-active-primary text-white':' text-white/50')}}>
                            <li className="">
                                <FontAwesomeIcon className='mr-2 float-left text-xl' icon={faUsers} />
                                Candidatos
                            </li>
                        </NavLink>
                    </ul>
                </nav>
                    <Link to='/logout' className='duration-300 text-white hover:text-gray-800 flex items-center gap-2'>
                        Sair
                        <FontAwesomeIcon className='float-left text-sm' icon={faArrowRight} />
                    </Link>
                <div className='flex flex-col items-center mt-[2%]'>
                    <div className='flex flex-row gap-3'>
                       <Link target='blank' className='hover:scale-150' to={'https://github.com/iFuzzing'}><i className="fa fa-github" aria-hidden="true"></i></Link>  
                       <Link target='blank' className='hover:scale-150' to={'https://www.linkedin.com/in/josivan-sousa-22091a253/'}><i className="fa fa-linkedin" aria-hidden="true"></i></Link> 
                    </div>
                    <span>iFuzzing</span>
                </div>
            </div>
        </aside>
        </>

    )
}
