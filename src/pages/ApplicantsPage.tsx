import ContentPage from '../components/ContentPage'
import {Link, Form, redirect, useActionData} from 'react-router-dom'
import {useEffect, useState} from 'react'
import ImageApplicant1 from '../assets/images/applicants/applicant (1).png'
import ImageApplicant2 from '../assets/images/applicants/applicant (2).png'
import ImageApplicant3 from '../assets/images/applicants/applicant (3).png'
import ImageApplicant4 from '../assets/images/applicants/applicant (4).png'
import ImageFormPlaceHolder from '../assets/images/companies/form-placeholder.png'
//import ImageFormPlaceHolder from '../assets/images/companies/form-placeholder.png'
import FormContentPage from '../components/FormContentPage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { API_SERVER, isEmail, isRecruiterAuthenticated } from '../utils/utils'

export async function loader(){
    if(!await isRecruiterAuthenticated()){
        return redirect('/login')
    }

    return null
}

type SkillsType = {
    skill: string,
    value: string
}

export async function action({request}:{request: Request}){
    const dataForm = Object.fromEntries(await request.formData())
    
    const params = new URL(request.url).searchParams
    const jobId = params.get('job') as string

    if(typeof(dataForm.aboutme) == 'undefined' || typeof(dataForm.email) == 'undefined' || typeof(dataForm.github) == 'undefined' || typeof(dataForm.image) == 'undefined' || typeof(dataForm.name) == 'undefined' || typeof(dataForm.phone) == 'undefined' || typeof(dataForm.portfolio) == 'undefined' || typeof(dataForm.skill_0) == 'undefined' ){
        return 'O formulário precisa ser preenchido corretamente'
    }

    const aboutme = dataForm.aboutme as string
    const email = dataForm.email as string
    const github = dataForm.github as string
    const linkedin = dataForm.linkedin as string
    const phone = dataForm.phone as string
    const name = dataForm.name as string
    const portfolio = dataForm.portfolio as string
    const image: File = dataForm.image as File
    let skills: Array<SkillsType> = []

    if(!image.name){
        return 'Selecione uma imagem'
    }

    if(image.type!='image/png' && image.type!='image/jpg' && image.type!='image/jpeg'){
        return 'Somente .png, jpg, jpeg 🤭'
    }

    const maxImgSize = 1024*1000
    if(image.size > maxImgSize){
        return 'A imagem deve ter no máximo 1mb'
    } 

    if(name.length > 62 || name.length == 0){
        return 'Nome deve ter entre 1 e 62 caracteres'
    }

    if(aboutme.length > 450){
        return 'A descrição deve ter no máximo 450 caracteres'
    } 

    if(email.length > 42 ){
        return 'Email deve ter no máximo 42 caracteres'
    }

    if(email && !isEmail(email)){
        return 'Email inválido'
    }
    
    if(github.length > 42){
        return 'Github deve ter no máximo 42 caracteres'
    }

    let skillsError = false
    for(let x = 0; x<10; x++){
        if(typeof(dataForm[`skill_${x}`])=='undefined' || typeof(dataForm[`value_${x}`]) == 'undefined'){
            break
        }
        
        const skill = dataForm[`skill_${x}`] as string
        const value = dataForm[`value_${x}`] as string
        if(parseInt(value)<0 || parseInt(value)>10){
            skillsError =  true
        }

        if(skill==''){
            return 'Campo de habilidade vazio'
        }

        skills.push({'skill': skill, 'value': value})
    }

    if(skillsError){
        return 'Habilidade com valor inválido'
    }

    if(linkedin.length > 42){
        return 'Linkedin deve ter no máximo 42 caracteres'
    }

    if(portfolio.length > 150){
        return 'Portfólio deve ter no máximo 150 caracteres'
    }

    const contact = JSON.stringify({
        email: email,
        github: github,
        phone: phone,
        linkedin: linkedin
    })
    let bodyData = new FormData() 
    bodyData.append('aboutme', aboutme)
    bodyData.append('name', name)
    bodyData.append('contact', contact)
    bodyData.append('portfolio', portfolio)
    bodyData.append('image', image)
    bodyData.append('skills', JSON.stringify(skills))
    bodyData.append('job', jobId)

    const res = await fetch(API_SERVER+ '/api/applicant/new/ref', {
        credentials: 'include',
        method: 'post',
        body: bodyData
    })
    
    if(!res.ok){
        return 'Alguma coisa errada com o formulário'
    }

    return '200'
}

export default function ApplicantsPage(){
    
    const [isFormAdditionVisible, setIsFormAdditionVisible] = useState(false)
    const [isFormViwerVisible, setIsFormViwerVisible] = useState(false)
    const [FormImgSrc, setFormImgSrc] = useState(ImageFormPlaceHolder)

    const actionReturn = useActionData() as string

    function toggleAdditionForm(){
        setIsFormAdditionVisible((prevIsFormVisible)=> !prevIsFormVisible)
    }

    function toggleViwerForm(){
        setIsFormViwerVisible((prevIsFormViwerVisible)=> !prevIsFormViwerVisible)
    }

    const formViwerContent = 
        <Form className='pb-5 overflow-auto w-11/12 h-[550px] s400:h-[700px] md:h-fit flex flex-col gap-2 text-left sm:items-start m-5 font-Roboto text-label-primary' method='post' encType="multipart/form-data">
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
                        <Link to={'/'} className='ml-2 underline'>https://meuportfolio.com</Link>
                    </div>
                    <button className="w-44 mt-5 self-center font-Roboto font-medium text-sm shadow-lg shadow-black/30 text-white p-3 rounded-full bg-gradient-to-r from-active-primary to-blue-gradient-value uppercase duration-300 hover:hue-rotate-[45deg]">Salvar</button>
                </Form>


    const [Skills, setSkills] = useState([{'skill':'React','value':0}])
    const [SkillsEl, setSkillsEl] = useState([
        <>
            <input className='w-1/2 border border-black/20 px-3' type='text' placeholder='' />
            <div className=''>
                <span>{Skills[0].value}</span>
                <input onChange={(event)=>handleSkillChange(event, 0)} type='range' value={Skills[0].value} max={10} min={0} />
            </div>
        </>
    ]
    )

    function handleSkillChange(event:any, skillid:number){
        setSkills((prevSkills:any)=>{
            return prevSkills.map((skill:any, index:number)=>{
               if(index == skillid){
                    const targetName = event.target.name as string
                    if(targetName.startsWith('skill')){
                        return {skill: event.target.value as string, value: skill.value as number}
                    }else{
                        return {skill: skill.skill as string, value: parseInt(event.target.value) as number}
                    }
                }

                return skill
            }) 
        })
    }

    function createSkillField(event:any){
        event.preventDefault()
        setSkills(prevSkills=>[...prevSkills, {'skill':'new','value':0}])
    }

    function deleteSkillField(event:any){
        event.preventDefault()
        setSkills(prevSkills=>{
            let copy = prevSkills
            return copy.slice(0, -1)
        })
    }

    function handleFormImgChange(event:any){
        
        if(!event.target?.files[0]?.type){
            event.preventDefault()
            return
        }

        if(event.target.files[0].type!='image/png' && event.target.files[0].type!='image/jpg' && event.target.files[0].type!='image/jpeg'){
            event.preventDefault()
            return
        }

        let reader = new FileReader()
        
        reader.onload = function(e){
            setFormImgSrc(e.target?.result as string)
        }

        reader.readAsDataURL(event.target.files[0])
    }

    useEffect(()=>{
        setSkillsEl(Skills.map((skill, index)=>{
            return (<>
                <input key={index} name={`skill_${index}`} onChange={(event)=>handleSkillChange(event, index)} className='fadein w-full border border-black/20 px-2 text-center' type='text' placeholder='' />
                <div key={index+1} className='fadein'>
                    <span>{skill.value}</span>
                    <input name={`value_${index}`} onChange={(event)=>handleSkillChange(event, index)} type='range' value={skill.value} max={10} min={0} />
                </div>
            </>)
 
        }))

    },[Skills])

    const formAdditionContent = 
        <>
        <Form className='w-11/12 flex flex-col gap-3 items-center sm:items-start m-5 font-Roboto text-label-primary max-h-[500px] overflow-auto' method='post' encType="multipart/form-data">
            <h1 className='w-full uppercase text-center text-app-base-primary font-Roboto font-bold'>Cadastro manual de candidato</h1>
            <label className='self-center cursor-pointer' htmlFor='image'><img className='w-20 h-20 border-[1px] border-active-primary/30 shadow-md shadow-black/20 rounded-md self-center' src={FormImgSrc} alt="" placeholder=''/></label>
            <input className='hidden' onChange={handleFormImgChange} id={'image'} type="file" accept=".jpg, .png, .jpeg" name={'image'} />
            <span className='text-[10px] text-label-primary/60 mx-auto' >Clique para adicionar/trocar imagem</span>
            <label className='text-sm' htmlFor="name">Nome</label> 
            <input className='w-full p-2 rounded-full border-[1px] shadow-md shadow-black/20 text-center sm:text-left sm:rounded-md sm:w-full' type="text" name="name" id="name" placeholder='Ex.: Julia Machado'/>
            <label className='text-sm' htmlFor="aboutme">Sobre mim</label> 
            <textarea className='w-full min-h-[200px] resize-none p-1 s320:p-4 border-[1px] border-black/20 rounded-md shadow-md shadow-black/20 sm:rounded-md' name="aboutme" id="aboutme" cols={30} rows={5} maxLength={450}  placeholder='Descrição sobre o candidato...'></textarea>
            <label className='text-sm'>Contato</label>
            <div className='w-full border-[1px] border-label-secondary/20 p-2 rounded-md'>
                <div className='w-full grid grid-flow-col grid-rows-4 gap-3'>
                    <i className="fa-brands fa-linkedin-in"></i> 
                    <i className="fa-regular fa-envelope"></i>
                    <i className="fa-solid fa-address-book"></i>
                    <i className="fa fa-github-alt" aria-hidden="true"></i>
                    <input className='w-full border border-black/20 px-3' name='linkedin' type='text' placeholder='Linkedin' />
                    <input className='w-full border border-black/20 px-3' name='email' type='email' placeholder='Email' />
                    <input className='w-full border border-black/20 px-3' name='phone' type='tel' placeholder='Número de telefone'/>
                    <input className='w-full border border-black/20 px-3' name='github' type='text' placeholder='Github'/>
                </div>
            </div>
            <div className='gap-3 w-full border-[1px] border-label-secondary/20 p-2 rounded-md font-Roboto'>
                <div className='w-full grid grid-flow-row grid-cols-2 gap-3'>
                    <label className='text-sm'>Habilidade</label> 
                    <label className='text-sm'>Nível</label> 
                    {SkillsEl}
                    <button disabled={SkillsEl.length<=1?true:false} className={SkillsEl.length<=1?'bg-alert/50':'bg-alert' + ' p-1 text-sm rounded-sm text-white'} onClick={deleteSkillField}>- Remover</button>
                    <button disabled={SkillsEl.length>=10?true:false} className={SkillsEl.length>=10?'bg-app-base-primary/30':'bg-app-base-primary' + ' p-1 text-sm rounded-sm text-white'} onClick={createSkillField}>+ Adicionar</button>
                </div>
            </div>
            <label className='text-sm' htmlFor="portfolio">Portfólio/Trabalhos</label> 
            <div className='w-full border-[1px] border-label-secondary/20 p-2 rounded-md font-Roboto text-start'>
                <i className="fa-solid fa-globe"></i> 
                <input name='portfolio' id='portfolio' className='ml-2 w-5/6 border border-black/20 px-3' type='text' placeholder='https://meuportfolio.com' />
            </div>
            {actionReturn && <span className={'fadein w-full p-2 text-white text-sm '+(actionReturn=='200'?'bg-green-400':'bg-alert/70')} >{actionReturn==='200'?'Novo candidato registrado':'⚠️ ' + actionReturn}</span>}
            <button className="my-3 w-44 mt-5 self-center font-Roboto font-medium text-sm shadow-lg shadow-black/30 text-white p-3 rounded-full bg-gradient-to-r from-active-primary to-blue-gradient-value uppercase duration-300 hover:hue-rotate-[45deg]">Adicionar</button> 
        </Form>
        </>

    const content = 
    <>
    { isFormAdditionVisible && 
         <FormContentPage toggleForm={toggleAdditionForm} formContent={formAdditionContent} isFormVisible={isFormAdditionVisible}/>
    }

    { isFormViwerVisible && 
         <FormContentPage toggleForm={toggleViwerForm} formProfileImage={ImageApplicant1} formContent={formViwerContent} isFormVisible={isFormViwerVisible}/>
    }
 
    <ul className="flex flex-col flex-nowrap :w-full ">
        <button onClick={toggleViwerForm}>
        <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block  hover:bg-active-primary/10">
            <img src={ImageApplicant1} alt="" className="w-16 sm:float-left" />
            <div className="flex flex-row  w-full sm:w-auto">
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
                    <Link to='/1'>
                            <FontAwesomeIcon className='text-label-secondary/40' icon={faEye} />
                    </Link>
                </div>
            </div>
        </li>
        </button>

    <button>
        <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block hover:bg-active-primary/10">
            <img src={ImageApplicant2} alt="" className="w-16 sm:float-left" />
            <div className="flex flex-row  w-full sm:w-auto">
                <div className="w-full flex flex-col ml-3 font-Roboto text-left">
                    <h3 className="font-medium">Counrtney Henry</h3>
                   <div className='flex flex-wrap gap-1 px-2 font-Roboto font-medium text-[10px] text-label-primary'>
                        <span className='py-1 px-2 rounded-full bg-gray-400'># 1ª Etapa</span>
                   </div>
                </div>
                <div className="flex flex-col justify-between">
                    <Link to='/1'>
                            <FontAwesomeIcon className='text-label-secondary/40' icon={faEye} />
                    </Link>
                </div>
            </div>
        </li>
    </button>

    <button>
        <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block hover:bg-active-primary/10">
            <img src={ImageApplicant3} alt="" className="w-16 sm:float-left" />
            <div className="flex flex-row  w-full sm:w-auto">
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
                    <Link to='/1'>
                            <FontAwesomeIcon className='text-label-secondary/40' icon={faEye} />
                    </Link>
                </div>
            </div>
        </li>
    </button>

    <button>
        <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block hover:bg-active-primary/10">
            <img src={ImageApplicant4} alt="" className="w-16 sm:float-left" />
            <div className="flex flex-row  w-full sm:w-auto">
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
                    <Link to='/1'>
                            <FontAwesomeIcon className='text-label-secondary/40' icon={faEye} />
                    </Link>
                </div>
            </div>
        </li>
    </button>
    </ul>
    </>
    return (
        <ContentPage title={'Todos os candidatos'} content={content} addAction={()=> toggleAdditionForm()} isFormVisible={isFormAdditionVisible}/>
    )
}
