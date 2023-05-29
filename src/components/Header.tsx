import { Link, NavLink } from 'react-router-dom'
import ImageGGprofile from '../assets/images/mix/gg_profile.png'
import ImageUxNavIndicator from '../assets/images/mix/ux-nav-Indicator.svg'
import ImageUxNavIndicatorBullet from '../assets/images/mix/ux-nav-indicator-bullet.svg'
import ImageUxNavIndicatorBulletEmpty from '../assets/images/mix/ux-nav-indicator-bullet-empty.svg'

export default function Header(){
    return(
        <>
        <header className='sm:hidden justify-between flex flex-col px-5 py-2 h-48 bg-app-base-primary text-white font-Kanit font-bold'>
            <div className='flex justify-between'>
                <button>
                    <span className="material-symbols-outlined text-3xl">menu</span>
                </button>
                <button>
                    <span className="material-symbols-outlined text-3xl">account_circle</span>
                </button>
            </div>
            <h1 className="text-center uppercase text-2xl">HERO HR</h1>
            <nav className="overflow-hidden shadow-lg shadow-black/25 bg-white text-label-primary p-3 rounded-md flex flex-row items-center justify-center">
                <ul className='flex flex-row gap-2 s320:gap-7  text-xs uppercase font-Roboto font-medium items-center'>
                    <NavLink to='.' className={isActive=>(isActive.isActive?'bg-app-base-primary text-white p-2 rounded-full shadow-md shadow-black/30':'')}><li>Empresas</li></NavLink>
                    <NavLink to='jobs' className={isActive=>(isActive.isActive?'bg-app-base-primary text-white p-2 rounded-full shadow-md shadow-black/30':'')}><li>Vagas</li></NavLink>
                    <NavLink to='steps' className={isActive=>(isActive.isActive?'bg-app-base-primary text-white p-2 rounded-full shadow-md shadow-black/30':'')}><li>Etapas</li></NavLink>
                    <NavLink to='applicants' className={isActive=>(isActive.isActive?'bg-app-base-primary text-white p-2 rounded-full shadow-md shadow-black/30':'')}><li>Candidatos</li></NavLink>
                </ul>
            </nav>
        </header>
        <aside className='hidden overflow-hidden sm:block h-screen bg-gradient-to-b from-app-base-primary to-app-base-primary/60 text-white w-1/4 max-w-[250px] float-left'>
            <div className="p-4 flex flex-row items-center gap-2 w-full border-b-[1px] border-active-primary/20">
                <img src={ImageGGprofile} alt="" className="" />
                <h1 className="font-Roboto font-normal text-base flex flex-col">
                    Thalita Martins
                    <span className='text-xs'>Recrutador (a)</span>
                </h1>
            </div>
            <div className="h-4/5 flex flex-col text-center items-center content-center pt-10 justify-between">
                <nav className="flex flex-col gap-5 w-full text-center">
                    <h1 className="font-Kanit font-bold text-3xl uppercase">HERO HR</h1>
                    <ul className="sm:relative font-Kanit font-normal text-base flex flex-col">
                    <div className="hidden sm:block absolute w-[25%] h-[95%]">
                        <img className='w-full h-full' src={ImageUxNavIndicator} alt="" />
                        <img className='absolute top-[10%] w-full h-[10%] scale-90' src={ImageUxNavIndicatorBullet} alt="" />
                        <img className='absolute top-[35%] w-full h-[10%] scale-50' src={ImageUxNavIndicatorBulletEmpty} alt="" />
                        <img className='absolute top-[60%] w-full h-[10%] scale-50' src={ImageUxNavIndicatorBulletEmpty} alt="" />
                        <img className='absolute top-[85%] w-full h-[10%] scale-50' src={ImageUxNavIndicatorBulletEmpty} alt="" />
                    </div>
                        <NavLink to='.' className={({isActive})=>{return 'duration-100 py-5 h-10 flex items-center justify-start pl-[20%] w-full hover:border-white hover:border-r-4' + (isActive?' border-r-4 border-active-primary':'')}}><li className=""><span className="material-symbols-outlined mr-2 float-left">domain</span>Empresas</li></NavLink>
                        <NavLink to='jobs' onClick={(event)=>{event.preventDefault()}} className={({isActive})=>{return 'cursor-not-allowed text-white/50 duration-100 py-5 h-10 flex items-center justify-start pl-[20%] w-full hover:border-white hover:border-r-4' + (isActive?' border-r-4 border-active-primary':'')}}><li className=""><span className="material-symbols-outlined mr-2 float-left">work</span>Vagas</li></NavLink>
                        <NavLink to='steps' onClick={(event)=>{event.preventDefault()}} className={({isActive})=>{return 'cursor-not-allowed text-white/50 duration-100 py-5 h-10 flex items-center justify-start pl-[20%] w-full hover:border-white hover:border-r-4' + (isActive?' border-r-4 border-active-primary':'')}}><li className=""><span className="material-symbols-outlined mr-2 float-left">flag</span>Etapas</li></NavLink>
                        <NavLink to='applicants' onClick={(event)=>{event.preventDefault()}} className={({isActive})=>{return 'cursor-not-allowed text-white/50 before:text-white/50 duration-100 py-5 h-10 flex items-center justify-start pl-[20%] w-full hover:border-white hover:border-r-4' + (isActive?' border-r-4 border-active-primary':'')}}><li className=""><span className="material-symbols-outlined mr-2 float-left">group</span>Candidatos</li></NavLink>                        
                    </ul>
                </nav>
                <Link to='/logout' className=' duration-300 text-gray-800 hover:text-white'><span className="material-symbols-outlined float-left">logout</span>Sair</Link>
                
            </div>
        </aside>
        </>

    )
}