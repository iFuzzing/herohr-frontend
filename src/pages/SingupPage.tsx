import { Form, Link, redirect, useActionData } from 'react-router-dom'
import ImageFlipLogin from '../assets/images/login/flipToLogin.svg'
import ImageHeroSingup from '../assets/images/singup/bg-hero-singup-SE.svg'
import ImagemUxLoginIndicator from '../assets/images/singup/ux-singin-indicator.svg'
import { API_SERVER, isEmail, isPassword, isRecruiterAuthenticated, isUsername } from '../utils/utils'

export async function loader(){
    if(await isRecruiterAuthenticated()){
        return redirect('/')
    }
    return null
}

export async function action({request}: { request: Request}){
    const data = Object.fromEntries(await request.formData())
   
    const email: string = data.email as string
    const password: string = data.password as string
    const firstname:string = data.firstname as string
    const lastname:string = data.lastname as string
   
    if(!email || !password || !firstname || !lastname){
        return 'Todos os campos precisam ser preenchidos'
    }

    if(!isEmail(email) || email.length > 42){
        return 'Email inválido'
    }

    if(!isPassword(password)){
        return 'Sua senha deve conter de 8 a 32 caracteres com pelo menos 1 número e 1 caracter especial (!@#$%^&*])'
    }

    if(!isUsername(firstname)||!isUsername(lastname)){
        return 'Preencha seu nome corretamente'
    }

    if(firstname.length > 32 || lastname.length > 32){
        return 'Nome e sobrenome deve ter no máximo 32 caracteres'
    }

    const res = await fetch(API_SERVER+'http://localhost:3500/api/recruiter/singup',
        {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                firstname: firstname,
                lastname: lastname
            }),
            credentials: 'include'
        }
    )
    
    if(res.status == 409){
        return 'Esse email já está em uso'
    }

    if(res.status == 500){
        return 'Falha ao fazer registro, espere um pouco e tente novamente.'
    }

    if(!res.ok){
        return 'O servidor não processou corretamente os dados, verifique se você digitou tudo corretamente e tente novamente'
    }

    return redirect('/') //'Usuário registrado' 
}

export default function SingupPage(){
    const actionReturn: string = useActionData() as string
    return(
        <main className='bg-slate-200 w-screen h-screen overflow-hidden sm:bg-none sm:flex sm:items-center'>
        <div className='sm:bg-white max-w-5xl sm:w-11/12 sm:flex sm:flex-row sm:mx-auto sm:items-center sm:h-5/6 sm:shadow-lg sm:shadow-black/20 sm:rounded-md sm:border-2 sm:border-active-primary'>
            <div className="sm:w-1/2 sm:relative sm:bg-gradient-to-b sm:from-active-primary sm:h-full sm:justify-around sm:flex sm:flex-col">
                <div className="relative sm:w-full w-screen h-[290px] flex flex-wrap justify-center py-7">
                    <img src={ImageHeroSingup} alt="Hero image"  className="absolute w-full z-[5]" />
                </div>
                <p className='hidden sm:block font-Roboto font-normal text-xs text-label-secondary p-6 relative z-20'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus fuga nesciunt harum temporibus velit nostrum qui natus voluptatibus impedit veritatis sit id asperiores sed, sint perferendis quo, sapiente hic quisquam.</p>
            </div>
            <div className="sm:hidden bg-title-primary fixed w-screen h-4/5 bottom-0 z-0"></div>
            <div className="sm:w-1/2">
                <div className="text-center relative z-20">
                    <h1 className="font-Kanit font-bold text-2xl text-white sm:text-title-primary  mb-[-5px]">HERO HR</h1>
                    <h5 className="font-Roboto text-[11px] text-white sm:text-label-secondary font-medium">Encontrar o talento certo<br/>no momento certo, pode te fazer um herói.</h5>
                </div>
                <section className="flex justify-center sm:flex-col ">
                    <Form className='relative z-20 flex flex-col h-1/2 self-center w-4/5 p-5 font-Roboto font-medium text-[10px] text-slate-100 sm:text-label-primary sm:text-base' method='post'>
                        <label className='ml-3' htmlFor="email">E-mail:</label>
                        <div className="relative">
                            <i className="fa fa-envelope absolute left-4 bottom-2 text-label-tertiary text-lg" aria-hidden="true"></i>
                            <input className='text-label-primary focus:outline-active-primary rounded-3xl shadow-md shadow-black/20 border-[1px] border-black/20 h-10 w-full px-10' type="email" name="email" id="email" autoFocus/>
                        </div>
                        <label className='ml-3 mt-3' htmlFor="password">Senha:</label>
                        <div className="relative">
                            <i className="fa fa-lock  absolute left-4 bottom-2 text-label-tertiary text-lg" aria-hidden="true"></i>
                            <input className='text-label-primary focus:outline-active-primary rounded-3xl shadow-md shadow-black/20 border-[1px] border-black/20 h-10 w-full px-10' type="password" name="password" id="password" />
                        </div>
                        <div className='flex flex-nowrap py-2 gap-3 mx-auto'>
                            <div className="flex flex-col">
                                <label className='ml-3' htmlFor="firstname">Primeiro nome</label>
                                <input className='text-label-primary focus:outline-active-primary rounded-3xl shadow-md shadow-black/20 border-[1px] border-black/20 h-10 w-full px-10' type="text" name="firstname" id="firstname" />
                            </div>
                            <div className="flex flex-col">
                                <label className='ml-3' htmlFor="lastname">Segundo nome</label>
                                <input className='text-label-primary focus:outline-active-primary rounded-3xl shadow-md shadow-black/20 border-[1px] border-black/20 h-10 w-full px-10' type="text" name="lastname" id="lastname" />
                            </div>
                        </div>
                        { actionReturn && 
                            <div className='fadein w-full bg-alert/70 rounded-sm'>
                                <p className='text-white font-Roboto font-light text-sm text-center p-2'>
                                    {actionReturn}
                                </p>
                            </div>
                        }
                        <button className="w-44 mt-5 self-center font-Roboto font-medium text-sm shadow-lg shadow-black/30 text-white p-3 rounded-full bg-gradient-to-r from-active-primary to-blue-gradient-value uppercase duration-300 hover:hue-rotate-[45deg]">Registrar <i className="fa fa-user-plus text-sm text-white/95" aria-hidden="true"></i></button>
                    </Form>
                    <img src={ImagemUxLoginIndicator} alt="" className="hidden tall:block sm:hidden absolute w-40 bottom-10 right-0" />
                    <button className='absolute bottom-0 right-0 cursor-default sm:hidden'>
                        <Link className="cursor-pointer w-10 h-12 rotate-45 absolute right-3 bottom-3" to='/login'></Link>
                        <img src={ImageFlipLogin} alt="" />
                    </button>
                    <span className="hidden sm:block font-medium self-center text-xs text-label-primary font-Roboto">Já tem uma conta? <Link className='underline text-link-primary' to='/login'>Entrar</Link></span>
                </section>
            </div>
        </div>
    </main>
    )
}
