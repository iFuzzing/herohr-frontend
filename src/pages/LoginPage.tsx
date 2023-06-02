import {Link} from 'react-router-dom'

import ImageBgSky from '../assets/images/login/bg-sky-login-SE.png'
import ImageBlob from '../assets/images/login/bg-blob-login-SE.png'
import ImageStars from '../assets/images/login/bg-stars-login-SE.png'
import ImageHero from '../assets/images/login/bg-hero-login.png'
import ImageFlipSingUp from '../assets/images/login/flipToSingup.svg'
import ImageUxSingUpIndicator from '../assets/images/login/SingupUxIndicator.svg'
import { Form } from 'react-router-dom'

export default function LoginPage(){
    return(
    <main style={{'--image-url': `url(${ImageBgSky})`} as React.CSSProperties} className='bg-slate-200 w-screen h-screen bg-[image:var(--image-url)] bg-cover overflow-hidden sm:bg-none sm:flex sm:items-center'>
        <div className='sm:bg-white max-w-5xl sm:w-11/12 sm:flex sm:flex-row sm:mx-auto sm:items-center sm:h-5/6 sm:shadow-lg sm:shadow-black/20 sm:rounded-md sm:border-2 sm:border-active-primary'>
            <div className="sm:w-1/2 sm:relative sm:bg-gradient-to-b sm:from-active-primary sm:h-full sm:justify-around sm:flex sm:flex-col">
                <div className="relative sm:w-full w-screen h-[290px] flex flex-wrap justify-center py-7">
                    <img src={ImageHero} alt="Hero image"  className="z-20 absolute w-[239px] h-[202px]" />
                    <img src={ImageStars} alt="Stars image"  className="z-10 absolute w-[320px] h-[280]" />
                    <img src={ImageBlob} alt="Blob image"  className="z-0 absolute w-[262px] h-[250px]" />
                </div>
                <p className='hidden sm:block font-Roboto font-normal text-xs text-label-secondary p-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus fuga nesciunt harum temporibus velit nostrum qui natus voluptatibus impedit veritatis sit id asperiores sed, sint perferendis quo, sapiente hic quisquam.</p>
            </div>
            <div className="sm:w-1/2">
                <div className="text-center">
                    <h1 className="font-Kanit font-bold text-2xl text-title-primary mb-[-5px]">HERO HR</h1>
                    <h5 className="font-Roboto text-[11px] text-label-secondary font-medium">Encontre talentos<br/>de maneira eficiente.</h5>
                </div>
                <section className="flex justify-center sm:flex-col">
                    <Form className='flex flex-col h-1/2 self-center w-4/5 p-5 font-Roboto font-medium text-[10px] sm:text-base text-label-primary' method='post'>
                        <label className='ml-3 sm:' htmlFor="email">E-mail:</label>
                        <div className="relative">
                            <i className="fa fa-envelope absolute left-4 bottom-2 text-label-tertiary text-lg" aria-hidden="true"></i>
                            <input className='focus:outline-active-primary rounded-3xl shadow-md shadow-black/20 border-[1px] border-black/20 h-10 w-full px-10' type="email" name="email" id="email" autoFocus />
                        </div>
                        <label className='ml-3 mt-3' htmlFor="pass">Senha:</label>
                        <div className="relative">
                            <i className="fa fa-lock  absolute left-4 bottom-2 text-label-tertiary text-lg" aria-hidden="true"></i>
                            <input className='focus:outline-active-primary rounded-3xl shadow-md shadow-black/20 border-[1px] border-black/20 h-10 w-full px-10' type="password" name="pass" id="pass" />
                        </div>
                        <div className='flex flex-nowrap py-2'>
                            <input className='ml-2' type="checkbox" name="keepsession" id="keepsession" />
                            <label htmlFor="keepsession" className='ml-3'>Permanecer conectado</label>
                        </div>
                        <button className="w-44 mt-5 self-center font-Roboto font-medium text-sm shadow-lg shadow-black/30 text-white p-3 rounded-full bg-gradient-to-r from-active-primary to-blue-gradient-value uppercase duration-300 hover:hue-rotate-[45deg]">Entrar <i className="fa fa-sign-in ext-base text-white/95" aria-hidden="true"></i></button>
                    </Form>
                    <img src={ImageUxSingUpIndicator} alt="" className="hidden tall:block sm:hidden absolute w-48 bottom-10 right-0" />
                    <button className='absolute bottom-0 right-0 cursor-default sm:hidden'>
                        <Link className="cursor-pointer w-10 h-12 rotate-45 absolute right-3 bottom-3" to='/singup'></Link>
                        <img src={ImageFlipSingUp} alt="" />
                    </button>
                    <span className="hidden sm:block font-medium self-center text-xs text-label-primary font-Roboto">Não tem uma conta? <Link className='underline text-link-primary' to='/singup'>Registrar</Link></span>
                </section>
            </div>
        </div>
    </main>
    )
}
