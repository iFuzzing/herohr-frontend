import ContentPage from '../components/ContentPage'
import {Link, Form} from 'react-router-dom'
import {useState} from 'react'
import ImageApplicant1 from '../assets/images/applicants/applicant (1).png'
import ImageApplicant2 from '../assets/images/applicants/applicant (2).png'
import ImageApplicant3 from '../assets/images/applicants/applicant (3).png'
import ImageApplicant4 from '../assets/images/applicants/applicant (4).png'
//import ImageFormPlaceHolder from '../assets/images/companies/form-placeholder.png'
import FormContentPage from '../components/FormContentPage'

export default function ApplicantsPage(){
    
    const [isFormVisible, setIsFormVisible] = useState(false)

    function toggleForm(arg:{'is_addAction'?:boolean}={}){
        if(arg?.is_addAction === true){
            console.log('From applicant page')
        }
        setIsFormVisible((prevIsFormVisible)=> !prevIsFormVisible)
    }

    const formContent = 
        <Form className='pb-5 overflow-auto w-11/12 h-[550px] s400:h-[700px] md:h-fit flex flex-col gap-2 text-left sm:items-start m-5 font-Roboto text-label-primary' method='post'>
                    <img className='self-center sm:hidden w-25 h-25 border-[1px] border-active-primary/30 shadow-md shadow-black/20 rounded-full' src={ImageApplicant1} alt="" placeholder=''/>
                    <h3 className='font-bold text-title-primary text-center'>Angela Machado</h3>
                    <label className='text-sm' htmlFor="company_name">Tags para esse candidato</label>
                    <div className='w-full border-[1px] border-label-secondary/20 p-2 rounded-md'>
                       <span className='text-gray-500 text-sm'>(Clique para definir tags)</span> 
                    </div>
                    <label className='text-sm' htmlFor="company_name">Sobre mim</label>
                    <div className='w-full border-[1px] border-label-secondary/20 p-2 rounded-md'>
                    <p className='overflow-auto h-24'>Sou simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                    </div>
                    <label className='text-sm' htmlFor="company_name">Contato</label>
                    <div className='w-full border-[1px] border-label-secondary/20 p-2 rounded-md'>
                        <div className='grid grid-flow-col grid-rows-3 w-64'>
                            <i className="fa-brands fa-linkedin-in"></i> 
                            <i className="fa-regular fa-envelope"></i>
                            <i className="fa-solid fa-address-book"></i>
                            <Link to={'/'} className='underline'>Angela Machado</Link>
                            <Link to={'/'} className='underline'>angela.machado@email.com</Link>
                            <Link to={'/'} className='underline'>(01) 99123-4567</Link>
                        </div>
                    </div>
                    <label className='text-sm' htmlFor="company_name">Habilidades</label> 
                    <div className='w-full border-[1px] border-label-secondary/20 p-2 rounded-md'>
                       <span className='font-Roboto font-light text-sm'>React</span>
                       <div className='w-full flex justify-evenly items-center'>
                            <span className='float-left block text-gray-400'>0</span>
                            <div className='relative w-full bg-gray-300 rounded-lg mx-2'>
                                <span className='absolute top-[-20px] left-[80%] text-gray-400'>8</span>
                                <div className='p-1 w-[80%] bg-app-base-primary rounded-lg'></div>
                            </div> 
                            <span className='float-right block text-gray-400'>10</span>
                       </div>
                       <span className='font-Roboto font-light text-sm'>Next.js</span>
                       <div className='w-full flex justify-evenly items-center'>
                            <span className='float-left block text-gray-400'>0</span>
                            <div className='relative w-full bg-gray-300 rounded-lg mx-2'>
                                <span className='absolute top-[-20px] left-[70%] text-gray-400'>7</span>
                                <div className='p-1 w-[70%] bg-app-base-primary rounded-lg'></div>
                            </div> 
                            <span className='float-right block text-gray-400'>10</span>
                       </div>
                       <span className='font-Roboto font-light text-sm'>Tailwindcss</span>
                       <div className='w-full flex justify-evenly items-center'>
                            <span className='float-left block text-gray-400'>0</span>
                            <div className='relative w-full bg-gray-300 rounded-lg mx-2'>
                                <span className='absolute top-[-20px] left-[90%] text-gray-400'>9</span>
                                <div className='p-1 w-[90%] bg-app-base-primary rounded-lg'></div>
                            </div> 
                            <span className='float-right block text-gray-400'>10</span>
                       </div>
                    </div>
                    <label className='text-sm' htmlFor="company_name">Portfólio/Trabalhos</label> 
                    <div className='w-full border-[1px] border-label-secondary/20 p-2 rounded-md'>
                        <i className="fa-solid fa-globe"></i>
                        <Link to={'/'} className='ml-2 underline'>https://meuportifolio.com</Link>
                    </div>
                    <button className="w-44 mt-5 self-center font-Roboto font-medium text-sm shadow-lg shadow-black/30 text-white p-3 rounded-full bg-gradient-to-r from-active-primary to-blue-gradient-value uppercase duration-300 hover:hue-rotate-[45deg]">Salvar</button>
                </Form>


    const content = 
    <>
    { isFormVisible && 
         <FormContentPage toggleForm={toggleForm} hasImgOnForm={true} formContent={formContent}/>
    }
 
    <ul className="flex flex-col sm:w-full sm:block">
        <button onClick={()=>toggleForm()}>
        <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block  hover:bg-active-primary/10">
            <img src={ImageApplicant1} alt="" className="w-16 sm:float-left" />
            <div className="flex flex-row">
                <div className="w-full flex flex-col ml-3 font-Roboto text-left">
                   <h3 className="font-medium">Angela Machado</h3>
                   <div className='flex flex-wrap gap-1 px-2 font-Roboto font-medium text-[10px] text-label-primary'>
                    <span className='py-1 px-2 rounded-full bg-gray-400'># 1ª Etapa</span>
                    <span className='py-1 px-2 rounded-full bg-[#31DCA9]'># Experiente</span>
                    <span className='py-1 px-2 rounded-full bg-[#32D0E5]'># Ágil</span>
                    <span className='py-1 px-2 rounded-full bg-[#6B91F2]'># Habilidosa</span>
                    <span className='py-1 px-2 rounded-full bg-[#BADC31]'># Falta alguma hardskill</span>
                   </div>
                </div>
                <div className="flex flex-col justify-between">
                    <Link to='/1'><span className="material-symbols-outlined text-label-secondary/40" >visibility</span></Link>
                </div>
            </div>
        </li>
        </button>

    <button>
        <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block hover:bg-active-primary/10">
            <img src={ImageApplicant2} alt="" className="w-16 sm:float-left" />
            <div className="flex flex-row">
                <div className="w-full flex flex-col ml-3 font-Roboto text-left">
                    <h3 className="font-medium">Counrtney Henry</h3>
                   <div className='flex flex-wrap gap-1 px-2 font-Roboto font-medium text-[10px] text-label-primary'>
                        <span className='py-1 px-2 rounded-full bg-gray-400'># 1ª Etapa</span>
                   </div>
                </div>
                <div className="flex flex-col justify-between">
                    <Link to='/1'><span className="material-symbols-outlined text-label-secondary/40" >visibility</span></Link>
                </div>
            </div>
        </li>
    </button>

    <button>
        <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block hover:bg-active-primary/10">
            <img src={ImageApplicant3} alt="" className="w-16 sm:float-left" />
            <div className="flex flex-row">
                <div className="w-full flex flex-col ml-3 font-Roboto text-left">
                    <h3 className="font-medium">Darrel Steward</h3>
                    <div className='flex flex-wrap gap-1 px-2 font-Roboto font-medium text-[10px] text-label-primary'>
                    <span className='py-1 px-2 rounded-full bg-[#00D1FF]'># 2ª Etapa</span>
                    <span className='py-1 px-2 rounded-full bg-[#31DCA9]'># Experiente</span>
                    <span className='py-1 px-2 rounded-full bg-[#32D0E5]'># Ágil</span>
                    <span className='py-1 px-2 rounded-full bg-[#6B91F2]'># Habilidosa</span>
                    <span className='py-1 px-2 rounded-full bg-[#BADC31]'># Falta alguma hardskill</span>
                   </div>
                </div>
                <div className="flex flex-col justify-between">
                    <Link to='/1'><span className="material-symbols-outlined text-label-secondary/40" >visibility</span></Link>
                </div>
            </div>
        </li>
    </button>

    <button>
        <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block hover:bg-active-primary/10">
            <img src={ImageApplicant4} alt="" className="w-16 sm:float-left" />
            <div className="flex flex-row">
                <div className="w-full flex flex-col ml-3 font-Roboto text-left">
                    <h3 className="font-medium">Theresa Webb</h3>
                    <div className='flex flex-wrap gap-1 px-2 font-Roboto font-medium text-[10px] text-label-primary'>
                    <span className='py-1 px-2 rounded-full bg-gray-400'># 1ª Etapa</span>
                    <span className='py-1 px-2 rounded-full bg-[#31DCA9]'># Experiente</span>
                    <span className='py-1 px-2 rounded-full bg-[#32D0E5]'># Ágil</span>
                    <span className='py-1 px-2 rounded-full bg-[#6B91F2]'># Habilidosa</span>
                    <span className='py-1 px-2 rounded-full bg-[#BADC31]'># Falta alguma hardskill</span>
                   </div>
                </div>
                <div className="flex flex-col justify-between">
                    <Link to='/1'><span className="material-symbols-outlined text-label-secondary/40" >visibility</span></Link>
                </div>
            </div>
        </li>
    </button>
    </ul>
    </>
    return (
        <ContentPage title={'Todos os candidatos'} content={content} addAction={()=> toggleForm({'is_addAction': true})} isFormVisible={isFormVisible}/>
    )
}
