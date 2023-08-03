import ContentPage from '../components/ContentPage'
import {Link, Form, redirect, useActionData, useSearchParams, useNavigation} from 'react-router-dom'
import {useEffect, useRef, useState} from 'react'
import ImageFormPlaceHolder from '../assets/images/companies/form-placeholder.png'
import ImageWaitingApplicants from '../assets/images/applicants/applicants_idle.svg'
import FormContentPage from '../components/FormContentPage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faEye, faFlag, faTrash } from '@fortawesome/free-solid-svg-icons'
import { API_SERVER, isEmail, isHexColor, isRecruiterAuthenticated } from '../utils/utils'

export async function loader({request}:{request: Request}){
    if(!await isRecruiterAuthenticated()){
        return redirect('/login')
    }
    const params = new URL(request.url).searchParams
    const companyId = params.get('company')
    const jobId = params.get('job')

    let res:any
    
    res = await fetch(API_SERVER+`/api/recruiter/companies/company?id=${companyId}`, {credentials: 'include'})
    if(!res.ok){
        return redirect('/')
    }

    res = await fetch(API_SERVER+`/api/recruiter/jobs/job?company=${companyId}&job=${jobId}`, {credentials: 'include'})
    if(!res.ok){
        return redirect(`/jobs?company=${companyId}`)
    }

    return null
}

type SkillsType = {
    skill: string,
    value: string
}

type TagsType = {
    tag: string,
    color: string
}

export async function action({request}:{request: Request}){
    const dataForm = Object.fromEntries(await request.formData())
    
    const params = new URL(request.url).searchParams
    const jobId = params.get('job') as string

    if(typeof(dataForm.aboutme) == 'undefined' || typeof(dataForm.email) == 'undefined' || typeof(dataForm.github) == 'undefined' || typeof(dataForm.image) == 'undefined' || typeof(dataForm.name) == 'undefined' || typeof(dataForm.phone) == 'undefined' || typeof(dataForm.portfolio) == 'undefined' || typeof(dataForm.skill_0) == 'undefined' ){
        return 'O formulário precisa ser preenchido corretamente'
    }

    const formType = dataForm.formtype as string
    const applicant = dataForm.applicant as string
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

    let res
    if(!formType || formType != 'edition'){
        res = await fetch(API_SERVER+ '/api/applicant/new/ref', {
            credentials: 'include',
            method: 'post',
            body: bodyData
        })
    }else{
        bodyData.append('applicant', applicant)
        res = await fetch(API_SERVER+ '/api/applicant/edit/ref', {
            credentials: 'include',
            method: 'post',
            body: bodyData
        })
    }
    
    if(!res.ok){
        return 'Alguma coisa errada com o formulário'
    }

    return '200'
}

export default function ApplicantsPage(){
    
    const [isFormAdditionVisible, setIsFormAdditionVisible] = useState(false)
    const [isFormViwerVisible, setIsFormViwerVisible] = useState(false)
    const [ControlsApplicantReturn, setControlsApplicantReturn] = useState('')
    const [isFormEditionVisible, setIsFormEditionVisible] = useState(false)
    const [FormImgSrc, setFormImgSrc] = useState(ImageFormPlaceHolder)
    const [ApplicantsEl, setApplicantsEl] = useState([] as JSX.Element[]) 

    const [InputTag, setInputTag] = useState({tag: '', color: ''} as TagsType)
    const [Tags, setTags] = useState([{}] as TagsType[])
    const [TagsEl, setTagsEl] = useState([] as JSX.Element[])
    const [ViwerFormData, setViwerFormData] = useState(
        {
            _id: '',
            picture: ImageFormPlaceHolder as string,
            name: '',
            aboutme: '',
            contact: {
                linkedin: '',
                email: '',
                phone: '',
                github: ''
            },
            skills:[
                {skill:'',value: 0}
            ],
            portfolio: ''
        }
    )
    const [ViwerSkillsEl, setViwerSkillsEl] = useState([] as JSX.Element[])
    const [EditionSkillsEl, setEditionSkillsEl] = useState([] as JSX.Element[])

    const [Skills, setSkills] = useState([{'skill':'React','value':0}])
    const [EditionSkills, setEditionSkills] = useState(Skills)

    const refInputImage = useRef<any>(null)
    const refInputImageEdit = useRef<any>(null)

    const [FormStatus, setFormStatus] = useState('idle')
    const [actionReturn, setActionReturn] = useState('')
    const actreturn = useActionData() as string
    const [searchParams] = useSearchParams()
    const jobId = searchParams.get('job')
    const stepId = searchParams.get('step')

    const navigationStatus = useNavigation()
    const navState = navigationStatus.state

    function toggleAdditionForm(){
        setFormImgSrc(ImageFormPlaceHolder)
        setIsFormAdditionVisible((prevIsFormVisible)=> !prevIsFormVisible)
    }

    function toggleViwerForm(event:any, applicant: string = ''){
        if(event)
            event.preventDefault()
        
        if(applicant)
            getApplicantRef(applicant)

        setIsFormViwerVisible((prevIsFormViwerVisible)=> !prevIsFormViwerVisible)
    }
    
    async function toggleEditionForm(event: any = undefined){
        if(event)
            event.preventDefault()

        setIsFormViwerVisible((prevIsFormViwerVisible)=> !prevIsFormViwerVisible)
        setIsFormEditionVisible((prevIsFormVisible)=> !prevIsFormVisible) 
    }


    async function getApplicantRef(id: string){
        const res = await fetch(API_SERVER+`/api/applicant?id=${id}&job=${jobId}`,{credentials: 'include'}) 
        if(!res.ok){
            console.log(res.text())
            return 
        }

       fillViwerForm(await res.json()) 
    }

    async function fillViwerForm(applicant: any){
        const applicantData = {
            _id: applicant._id,
            picture: API_SERVER+'/uploads/'+applicant.picture,
            name: applicant.name,
            aboutme: applicant.aboutme,
            contact: {
                linkedin: applicant.contact.linkedin,
                email: applicant.contact.email,
                phone: applicant.contact.phone,
                github: applicant.contact.github
            },
            skills: applicant.skills,
            portfolio: applicant.portfolio
        }

        setViwerFormData(applicantData)
        setViwerSkillsEl(applicant.skills.map((skill: any, index: any)=>{
            return (<div key={index}>
               <span className='font-Roboto font-light text-sm'>{skill.skill}</span>
               <div className='w-full flex justify-evenly items-center'>
                    <span className='float-left block text-gray-400'>0</span>
                    <div className='relative w-full bg-gray-300 rounded-lg mx-2'>
                        { skill.value>0&&skill.value<10 && <span style={{left: `${skill.value}0%`}} className={`absolute top-[-20px] text-gray-400`}>{skill.value}</span>}
                        <div style={{width: `${skill.value}0%`}} className={`p-1 bg-app-base-primary rounded-lg`}></div>
                    </div> 
                    <span className='float-right block text-gray-400'>10</span>
               </div></div>)
        }))
        setEditionSkills(applicantData.skills)
        
        const imgBlob:any = await getImgURL(API_SERVER+`/uploads/${applicant.picture}`)
        let fileName = 'dejavu.png'
        let file = new File([imgBlob], fileName, {type:"image/png", lastModified:new Date().getTime()})
        let container = new DataTransfer()
        container.items.add(file)
        if(refInputImage.current != null && refInputImageEdit != null){
            setFormImgSrc(API_SERVER+'/uploads/'+applicant.picture)
            refInputImage.current.files = container.files
            refInputImageEdit.current.files = container.files
        }

    }

    async function getImgURL(url: string){
        /* var xhr = new XMLHttpRequest()
        xhr.withCredentials = true;
        xhr.onload = function() {
          callback(xhr.response)
        }
        xhr.open('GET', url)
        xhr.responseType = 'blob'
        xhr.send() */
        const res = await fetch(url, {credentials: 'include'})
        //callback(await res.blob())
        return await res.blob()
    }

    async function deleteApplicant(event: any, applicant: string){
        event.preventDefault()
        const res = await fetch(API_SERVER+`/api/applicant/delete/ref?id=${applicant}`, {credentials: 'include'})
        if(!res.ok){
            setControlsApplicantReturn('Falha ao deletar candidato')
            return
        }

        setControlsApplicantReturn('Candidato deletado')
        getApplicants()
    } 

    async function nextStepApplicant(event: any, applicant: string){
        event.preventDefault()
        const res = await fetch(API_SERVER+`/api/applicant/nextstep?applicant=${applicant}&&job=${jobId}`, {credentials: 'include'})
        if(!res.ok){
            setControlsApplicantReturn('Não foi possível mover o candidato para a próxima etapa')
            return
        }


        console.log(await res.text())
        setControlsApplicantReturn('Candidato foi aprovado para a próxima etapa')
        
    }

    async function prevStepApplicant(event: any, applicant: string){
        event.preventDefault()
        const res = await fetch(API_SERVER+`/api/applicant/prevstep?applicant=${applicant}&&job=${jobId}`, {credentials: 'include'})
        if(!res.ok){
            setControlsApplicantReturn('Não foi possível mover o candidato para a etapa anterior')
            return
        }


        console.log(await res.text())
        setControlsApplicantReturn('Candidato voltou uma etapa')
        
    }

    async function addTag(event: any){
        event.preventDefault()

        if(InputTag.tag.length > 0 && InputTag.tag.length <= 32 && InputTag.color.length == 7 && !Tags.find((tag) => tag.tag == InputTag.tag) && Tags.length <= 10 && await isHexColor(InputTag.color))
            setTags(prevTags=>[...prevTags, InputTag])

    }

    async function addTagFromDefaults(event: any, tag: string, color: string){ 
        event.preventDefault()
        if(!Tags.find((cTag) => cTag.tag == tag) && Tags.length <= 10 && await isHexColor(color))
            setTags(prevTags=>[...prevTags, {tag: tag, color: color}])
    }

    async function removeTag(event: any, tag: string){
        event.preventDefault()
        setTags(prevTags=>prevTags.filter(ptag=> ptag.tag != tag))
    }

    async function handleTagAction(event: any){
        event.preventDefault()
    }

    useEffect(()=>{
        setTagsEl(Tags.filter(tag => tag?.tag).map((tag, index)=>{
            return (<button onClick={(event)=> handleTagAction(event)} key={index} style={{background: `${tag.color}`}} className='text-white w-fit p-2 rounded-full text-sm shadow shadow-black/50'>{tag.tag} | <button onClick={(event)=> removeTag(event, tag.tag)} className='text-alert hover:scale-110 '><FontAwesomeIcon className='' icon={faClose} /></button> </button>)
        }))
        setInputTag({tag: '', color: ''})
    },[Tags])

    async function handleTagInputs(event: any){
        event.preventDefault()
        setInputTag((prevInputTag: any)=>{
            return {...prevInputTag, [event.target.name]: event.target.value}
        })
    }

    const formViwerContent = 
        <Form className='pb-5 overflow-auto w-11/12 h-[550px] s400:h-[700px] md:h-fit flex flex-col gap-2 text-left sm:items-start m-5 font-Roboto text-label-primary'>
                    <img className='self-center sm:hidden w-24 h-24 border-[1px] border-active-primary/30 shadow-md shadow-black/20 rounded-full' src={ViwerFormData.picture} alt="" placeholder=''/>
                    <h3 className='font-bold text-title-primary text-center'>{ViwerFormData.name}</h3>
                    <label className='text-sm' htmlFor="company_name">Tags ativas para esse candidato</label>
                    <div className='w-full flex flex-wrap gap-3 border-[1px] border-label-secondary/20 p-2 rounded-md justify-center'>
                    {TagsEl[0]?TagsEl:'(Adicione uma tag)'}
                    </div>
                    <label className='text-sm' htmlFor="company_name">Clique em uma tag abaixo para adicionar ao candidato ou crie a sua própria</label>
                    <div className='w-full flex flex-wrap gap-3 border-[1px] border-label-secondary/20 p-2 rounded-md justify-center'>
                <button onClick={(event)=> addTagFromDefaults(event, 'Habilidoso(a)','#1aabc4')} className='bg-gray-400 text-white w-fit p-2 rounded-full text-[11px] shadow shadow-black/50 hover:scale-110 hover:bg-sky-600'>Habilidoso(a)</button>
                    </div>
                    <div className='flex flex-row gap-3 w-full px-3 justify-center'>
                <input onChange={handleTagInputs} className='w-[120px] sm:w-auto self-center border border-black/20 rounded-md p-2' type='text' name='tag' placeholder='Bom portfólio' value={InputTag.tag}></input>
                <input onChange={handleTagInputs} className='w-[120px] sm:w-auto self-center border border-black/20 rounded-md p-2' type='text' name='color' placeholder='#000000' value={InputTag.color} ></input>
                    </div>
                    <button onClick={(event)=>addTag(event)} className='bg-app-base-primary text-white rounded-sm w-fit self-center text-sm p-2'>Adicionar tag</button>
                    <label className='text-sm' htmlFor="company_name">Sobre mim</label>
                    <div className='w-full border-[1px] border-label-secondary/20 p-2 rounded-md'>
                        <p className='overflow-auto h-24'>{ViwerFormData.aboutme}</p>
                    </div>
                    <label className='text-sm' htmlFor="company_name">Contato</label>
                    <div className='w-full border-[1px] border-label-secondary/20 p-2 rounded-md'>
                        <div className='grid grid-flow-col grid-rows-4 w-64'>
                            <i className="fa-brands fa-linkedin-in"></i> 
                            <i className="fa-regular fa-envelope"></i>
                            <i className="fa-solid fa-address-book"></i>
                            <i className="fa fa-github-alt" aria-hidden="true"></i>
                            <Link to={'/'} className='underline'>{ViwerFormData.contact.linkedin}</Link>
                            <Link to={'/'} className='underline'>{ViwerFormData.contact.email}</Link>
                            <Link to={'/'} className='underline'>{ViwerFormData.contact.phone}</Link>
                            <Link to={'/'} className='underline'>{ViwerFormData.contact.github}</Link>
                        </div>
                    </div>
                    <label className='text-sm' htmlFor="company_name">Habilidades</label> 
                    <div className='w-full border-[1px] border-label-secondary/20 p-2 rounded-md'>
                    {ViwerSkillsEl}
                    </div>
                    <label className='text-sm' htmlFor="company_name">Portfólio/Trabalhos</label> 
                    <div className='w-full border-[1px] border-label-secondary/20 p-2 rounded-md'>
                        <i className="fa-solid fa-globe"></i>
                        <Link to={'/'} className='ml-2 underline'>{ViwerFormData.portfolio}</Link>
                    </div>
                    <label className='text-sm text-alert' htmlFor="">Controles</label> 
                    <div className='flex flex-col gap-3 w-full border-[1px] border-alert/60 p-2 rounded-md font-Roboto text-start'>
                        <button onClick={(event)=> nextStepApplicant(event, ViwerFormData._id.toString())} className='text-start text-app-base-primary text-sm font-bold hover:underline'><FontAwesomeIcon className='' icon={faFlag} /> Aprovar para próxima etapa</button>
                        <button onClick={(event)=> prevStepApplicant(event, ViwerFormData._id.toString())} className='text-start text-yellow-500 text-sm font-bold hover:underline'><FontAwesomeIcon className='' icon={faFlag} /> Mover para etapa anterior</button>
                        <button className='text-start text-blue-500 text-sm font-bold hover:underline'><FontAwesomeIcon className='' icon={faEye} /> Marcar como visualizado</button>
                        <button onClick={(event)=>deleteApplicant(event, ViwerFormData._id)} className='text-start text-alert text-sm hover:underline'><FontAwesomeIcon className='' icon={faTrash} /> Deletar candidato</button>
                        {ControlsApplicantReturn && <span className={'fadein w-full p-1 text-white text-sm text-center bg-app-base-primary'}>{ControlsApplicantReturn}</span>}
                    </div>
                    <button onClick={(event)=>toggleEditionForm(event)} className="w-44 mt-5 self-center font-Roboto font-medium text-sm shadow-lg shadow-black/30 text-white p-3 rounded-full bg-gradient-to-r from-active-primary to-blue-gradient-value uppercase duration-300 hover:hue-rotate-[45deg]">Editar</button>
                </Form>


    const [SkillsEl, setSkillsEl] = useState([
        <div key={0} className='grid grid-flow-row grid-cols-2 gap-3'>
            <input className='w-1/2 border border-black/20 px-3' type='text' placeholder='' />
            <div className=''>
                <span>{Skills[0].value}</span>
                <input onChange={(event)=>handleSkillChange(event, 0)} type='range' value={Skills[0].value} max={10} min={0} />
            </div>
        </div>
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

    function handleEditionSkillChange(event:any, skillid:number){
        setEditionSkills((prevSkills:any)=>{
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
        if(event.target.name != 'edition'){
            setSkills(prevSkills=>[...prevSkills, {'skill':'new','value':0}])
        }else{
            setEditionSkills(prevSkills=>[...prevSkills, {'skill':'','value':0}])
        }
    }

    function deleteSkillField(event:any){
        event.preventDefault()
       
        if(event.target.name != 'edition'){
            setSkills(prevSkills=>{
                let copy = prevSkills
                return copy.slice(0, -1)
            })
        }else{
            setEditionSkills(prevSkills=>{
                let copy = prevSkills
                return copy.slice(0, -1)
            })

        }
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
            return (<div key={'skill'+index} className='grid grid-flow-row grid-cols-2 gap-3'>
                <input key={index} name={`skill_${index}`} onChange={(event)=>handleSkillChange(event, index)} className='fadein w-full border border-black/20 px-2 text-center' type='text' placeholder='' />
                <div key={index+1} className='fadein'>
                    <span>{skill.value}</span>
                    <input name={`value_${index}`} onChange={(event)=>handleSkillChange(event, index)} type='range' value={skill.value} max={10} min={0} />
                </div>
            </div>)
 
        }))

        setEditionSkills(Skills)
    },[Skills])

    useEffect(()=>{
        setEditionSkillsEl(EditionSkills.map((skill, index)=>{
            return (<div key={'skill-'+index} className='grid grid-flow-row grid-cols-2 gap-2 items-center'>
                    <input name={`skill_${index}`} onChange={(event)=>handleEditionSkillChange(event, index)} className='fadein w-full border border-black/20 px-2 text-center' type='text' placeholder='' value={skill.skill} />
                    <div className='fadein grid grid-flow-col grid-rows-2 w-full'>
                        <span>{skill.value}</span>
                        <input name={`value_${index}`} onChange={(event)=>handleEditionSkillChange(event, index)} type='range' value={skill.value} max={10} min={0} />
                    </div>
            </div>)
 
        }))

    },[EditionSkills])

    useEffect(()=>{
        if(FormStatus === 'submitting'){
            if(actreturn === '200'){
                getApplicants()
                setTimeout(()=>{setActionReturn('')},2000)
            }
        }
        setFormStatus(navigationStatus?.state)
        setActionReturn(actreturn)
    }, [navState])

    let textBtnAdd: string = ''
    if(FormStatus === 'idle'){
            textBtnAdd = 'Adicionar'
    }
    if(FormStatus === 'submitting')
        textBtnAdd = 'Enviando'
  
    let textResponse: string = ''
    if(actionReturn == '200')
        textResponse = '✔️ Novo candidato cadastrado'
    else if(actionReturn){
        textResponse = '⚠️ ' + actionReturn 
    }
    
    const formAdditionContent = 
        <>
        <Form className='w-11/12 flex flex-col gap-3 items-center sm:items-start m-5 font-Roboto text-label-primary max-h-[500px] overflow-auto' method='post' encType="multipart/form-data">
            <h1 className='w-full uppercase text-center text-app-base-primary font-Roboto font-bold'>Cadastro manual de candidato</h1>
            <label className='self-center cursor-pointer' htmlFor='image_add'><img className='w-20 h-20 border-[1px] border-active-primary/30 shadow-md shadow-black/20 rounded-md self-center' src={FormImgSrc} alt="" placeholder=''/></label>
            <input ref={refInputImage} className='hidden' onChange={handleFormImgChange} id={'image_add'} type="file" accept=".jpg, .png, .jpeg" name={'image'} />
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
                <div className='w-full grid grid-flow-row grid-cols-1 gap-3'>
                    <div className='grid grid-flow-row grid-cols-2 gap-3'>
                        <label className='text-sm'>Habilidade</label> 
                        <label className='text-sm'>Nível</label>
                    </div>
                    {SkillsEl}
                    <div className='grid grid-flow-row grid-cols-2 gap-3'>
                        <button disabled={SkillsEl.length<=1?true:false} className={SkillsEl.length<=1?'bg-alert/50':'bg-alert' + ' p-1 text-sm rounded-sm text-white'} onClick={deleteSkillField}>- Remover</button>
                        <button disabled={SkillsEl.length>=10?true:false} className={SkillsEl.length>=10?'bg-app-base-primary/30':'bg-app-base-primary' + ' p-1 text-sm rounded-sm text-white'} onClick={createSkillField}>+ Adicionar</button>
                    </div>
                </div>
            </div>
            <label className='text-sm' htmlFor="portfolio">Portfólio/Trabalhos</label> 
            <div className='w-full border-[1px] border-label-secondary/20 p-2 rounded-md font-Roboto text-start'>
                <i className="fa-solid fa-globe"></i> 
                <input name='portfolio' id='portfolio' className='ml-2 w-5/6 border border-black/20 px-3' type='text' placeholder='https://meuportfolio.com' />
            </div>
            <input type='hidden' name='formtype' value={'addition'} />
            {textResponse  && actreturn && <span className={'fadein w-full p-2 text-white text-sm '+(actionReturn=='200'?'bg-green-400':'bg-alert/70')} >{textResponse}</span>}
            <button className="my-3 w-44 mt-5 self-center font-Roboto font-medium text-sm shadow-lg shadow-black/30 text-white p-3 rounded-full bg-gradient-to-r from-active-primary to-blue-gradient-value uppercase duration-300 hover:hue-rotate-[45deg]">{textBtnAdd}</button> 
        </Form>
        </>


    async function getApplicants(){
            let res
                if(stepId){
                    res = await fetch(API_SERVER+`/api/applicant/linking?job=${jobId}&step=${stepId}`, {credentials: 'include'})
                }else{
                    res = await fetch(API_SERVER+`/api/applicant/linking?job=${jobId}`, {credentials: 'include'})
                }

            if(!res.ok){
                console.log("Falha ao obter candidatos: "+res.text())
                return
            }

            buildApplicantsElements(await res.json())
    }

    useEffect(()=>{
        getApplicants()
    },[])


    const formEditionContent = 
        <>
        <Form className='w-11/12 flex flex-col gap-3 items-center sm:items-start m-5 font-Roboto text-label-primary max-h-[500px] overflow-auto' method='post' encType="multipart/form-data">
            <h1 className='w-full uppercase text-center text-app-base-primary font-Roboto font-bold'>Edição manual de candidato</h1>
            <label className='self-center cursor-pointer' htmlFor='image_edit'><img className='w-20 h-20 border-[1px] border-active-primary/30 shadow-md shadow-black/20 rounded-md self-center' src={FormImgSrc} alt="" placeholder=''/></label>
            <input ref={refInputImageEdit} className='hidden' onChange={handleFormImgChange} id={'image_edit'} type="file" accept=".jpg, .png, .jpeg" name={'image'} />
            <span className='text-[10px] text-label-primary/60 mx-auto' >Clique para adicionar/trocar imagem</span>
            <label className='text-sm' htmlFor="name">Nome</label> 
            <input className='w-full p-2 rounded-full border-[1px] shadow-md shadow-black/20 text-center sm:text-left sm:rounded-md sm:w-full' type="text" name="name" id="name" placeholder='Ex.: Julia Machado' defaultValue={ViwerFormData.name}/>
            <label className='text-sm' htmlFor="aboutme">Sobre mim</label> 
            <textarea className='w-full min-h-[200px] resize-none p-1 s320:p-4 border-[1px] border-black/20 rounded-md shadow-md shadow-black/20 sm:rounded-md' name="aboutme" id="aboutme" cols={30} rows={5} maxLength={450}  placeholder='Descrição sobre o candidato...' defaultValue={ViwerFormData.aboutme}></textarea>
            <label className='text-sm'>Contato</label>
            <div className='w-full border-[1px] border-label-secondary/20 p-2 rounded-md'>
                <div className='w-full grid grid-flow-col grid-rows-4 gap-3'>
                    <i className="fa-brands fa-linkedin-in"></i> 
                    <i className="fa-regular fa-envelope"></i>
                    <i className="fa-solid fa-address-book"></i>
                    <i className="fa fa-github-alt" aria-hidden="true"></i>
                    <input className='w-full border border-black/20 px-3' name='linkedin' type='text' placeholder='Linkedin' defaultValue={ViwerFormData.contact.linkedin}/>
                    <input className='w-full border border-black/20 px-3' name='email' type='email' placeholder='Email' defaultValue={ViwerFormData.contact.email} />
                    <input className='w-full border border-black/20 px-3' name='phone' type='tel' placeholder='Número de telefone' defaultValue={ViwerFormData.contact.phone}/>
                    <input className='w-full border border-black/20 px-3' name='github' type='text' placeholder='Github' defaultValue={ViwerFormData.contact.github}/>
                </div>
            </div>
            <div className='gap-3 w-full border-[1px] border-label-secondary/20 p-2 rounded-md font-Roboto'>
                <div className='w-full grid grid-flow-row grid-cols-1 gap-3'>
                    <div className='grid grid-flow-row grid-cols-2'>
                        <label className='text-sm'>Habilidade</label> 
                        <label className='text-sm'>Nível</label>
                    </div>
                    {EditionSkillsEl}
                    <div className='grid grid-flow-row grid-cols-2 gap-3'>
                        <button name='edition' disabled={EditionSkillsEl.length<=1?true:false} className={EditionSkillsEl.length<=1?'bg-alert/50':'bg-alert' + ' p-1 text-sm rounded-sm text-white'} onClick={deleteSkillField}>- Remover</button>
                        <button name='edition' disabled={EditionSkillsEl.length>=10?true:false} className={EditionSkillsEl.length>=10?'bg-app-base-primary/30':'bg-app-base-primary' + ' p-1 text-sm rounded-sm text-white'} onClick={createSkillField}>+ Adicionar</button>
                    </div>
                </div>
            </div>
            <label className='text-sm' htmlFor="portfolio">Portfólio/Trabalhos</label> 
            <div className='w-full border-[1px] border-label-secondary/20 p-2 rounded-md font-Roboto text-start'>
                <i className="fa-solid fa-globe"></i> 
                <input name='portfolio' id='portfolio' className='ml-2 w-5/6 border border-black/20 px-3' type='text' placeholder='https://meuportfolio.com' defaultValue={ViwerFormData.portfolio} />
            </div>
            <input type='hidden' name='formtype' value={'edition'} />
            <input type='hidden' name='applicant' value={ViwerFormData._id} />
            {textResponse && <span className={'fadein w-full p-2 text-white text-sm '+(actionReturn=='200'?'bg-green-400':'bg-alert/70')} >{actionReturn==='200'?textResponse:'⚠️ ' + textResponse}</span>}
            <button className="my-3 w-44 mt-5 self-center font-Roboto font-medium text-sm shadow-lg shadow-black/30 text-white p-3 rounded-full bg-gradient-to-r from-active-primary to-blue-gradient-value uppercase duration-300 hover:hue-rotate-[45deg]">Salvar edição</button> 
        </Form>
        </>



    function buildApplicantsElements(applicants: any){
        setApplicantsEl(applicants.map((applicant: any, index:any)=>{
           return (
                <button key={index} onClick={(event)=>toggleViwerForm(event, applicant.applicant)} >
                <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block hover:bg-active-primary/10">
                    <img src={API_SERVER+`/uploads/${applicant.applicant_pic}`} alt="" className="w-16 sm:float-left rounded-full" />
                    <div className="flex flex-row  w-full sm:w-auto">
                        <div className="w-full flex flex-col ml-3 font-Roboto text-left">
                            <h3 className="font-medium">{applicant.applicant_name}</h3>
                           <div className='flex flex-wrap gap-1 px-2 font-Roboto font-medium text-[10px] text-label-primary'>
                                <span className='py-1 px-2 rounded-full bg-gray-400'># {applicant.step}ª Etapa</span>
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
           ) 
        }))
    } 

    const content = 
    <>
    <FormContentPage toggleForm={()=>toggleEditionForm()} formContent={formEditionContent} isFormVisible={isFormEditionVisible}/>
    <FormContentPage toggleForm={toggleAdditionForm} formContent={formAdditionContent} isFormVisible={isFormAdditionVisible}/>
    <FormContentPage toggleForm={()=>toggleViwerForm(null)} formProfileImage={ViwerFormData.picture} formContent={formViwerContent} isFormVisible={isFormViwerVisible} isViwerForm={true}/>

    <ul className="flex flex-col flex-nowrap :w-full ">
        {ApplicantsEl[0]?ApplicantsEl:
            <div className='p-14 flex flex-col flex-center w-full text-center font-Roboto'>
                <h1 className='font-medium'>Nenhum candidato registrado ou presente nessa etapa</h1>
                <h3 className='text-sm text-label-secondary'>(Se não registrado, você pode adicionar manualmente ou gerar um link para que os candidatos façam isso sozinhos. Eles aparecerão na # Etapa 1)</h3>
                <img className='w-56 self-center' src={ImageWaitingApplicants} alt='Companies waiting content img'/>
            </div>
        }
    </ul>
    </>
    return (
        <ContentPage title={'Todos os candidatos'} content={content} addAction={()=> toggleAdditionForm()} isFormVisible={isFormAdditionVisible}/>
    )
}
