import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ContentPage from '../components/ContentPage'
import FormContentPage from '../components/FormContentPage'
import {useEffect, useRef, useState} from 'react'
import { Link, Form, redirect, useLocation, useActionData, useNavigation } from 'react-router-dom'
import { faBriefcase, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { API_SERVER, isRecruiterAuthenticated } from '../utils/utils'
import parseHTML from 'html-react-parser'

import ImageWaitingJobs from '../assets/images/jobs/jobs_idle.svg'

export async function action({request}:{request:Request}){
    const formData = Object.fromEntries(await request.formData())
    const name = formData.name as string
    const description = formData.description as string
    const jobId = formData.jobsid as string
    const companyId = formData.company as string

    if(!name || !description){
        return 'Preecha todos os campos'
    }

    if(name.length > 42){
        return 'O nome da vaga deve ter no máximo 42 caracteres'
    }

    if(description.length > 250){
        return 'A descrição deve ter no máximo 250 caracteres'
    }

    let res:any
    if(!jobId){
        res = await fetch(API_SERVER+'/api/recruiter/jobs/new',{
            credentials: 'include',
            method: 'post',
            headers: {
                    'Content-Type':'application/json'
            },
            body: JSON.stringify({
                name: name,
                description: description,
                company: companyId
            })
        })  
    }else{
        res = await fetch(API_SERVER+'/api/recruiter/jobs/edit',{
            credentials: 'include',
            method: 'post',
            headers: {
                    'Content-Type':'application/json'
            },
            body: JSON.stringify({
                name: name,
                description: description,
                company: companyId,
                job: jobId
            })
        })  

    }

    if(res.status === 400){
        return 'Existe um problema com os dados que você preencheu, que tal mudar um pouco?'
    }

    if(res.status === 409){
        return 'Já existe uma vaga de trabalho com mesmo nome e descrição'
    }

    if(res.status === 200){
        return '200'
    }

    return 'Houve um erro ao processar sua requisição, espere um pouco e tente novamente'
}

export async function loader({request}:{request:Request}){
    if(!await isRecruiterAuthenticated()){
        return redirect('/login')
    }

    const params = new URL(request.url).searchParams
    const company_id = params.get('company')

    const res = await fetch(API_SERVER+`/api/recruiter/companies/company?id=${company_id}`, {credentials: 'include'})
    if(!res.ok){
        return redirect('/')
    }

    return null
}

export default function JobsPage(){
    const [isFormVisible, setIsFormVisible] = useState(false)
    const [FormStatus, setFormStatus] = useState('idle')
    const [FormJobId, setFormJobId] = useState('')
    const [JobsEl, setJobsEl] = useState([] as JSX.Element[])
    const location = useLocation()
 
    const [actionReturn, setActionReturn] = useState('')
    const actreturn = useActionData() as string
    
    const navigationStatus = useNavigation()
    const navState = navigationStatus.state

    const companyId = new URLSearchParams(location.search).get('company') as string
    
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [jobToDeletion, setCompanyToDeletion] = useState('')

    const refInputName = useRef<any>(null)
    const refTextboxDescription = useRef<any>(null)

    async function getJobs(){
        const res = await fetch(API_SERVER+`/api/recruiter/jobs?company=${companyId}&job=${FormJobId}`, {credentials: 'include'})
        if(!res.ok){
            console.log('Falha ao obter trabalhos')
            return
        }

        buildJobsElements(await res.json())
    }
    
    async function getJob(jobId: string){
        const res = await fetch(API_SERVER+`/api/recruiter/jobs/job?company=${companyId}&job=${jobId}`, {credentials: 'include'})
        if(!res.ok){
            setActionReturn('Não foi possível obter os dados do trabalho')
            return
        }

        const resData = await res.json()
        fillEditForm(resData)

    }
    
    async function fillEditForm(job:any){
        if(refInputName.current != null && refTextboxDescription.current != null){
            refInputName.current.value = job.name
            refTextboxDescription.current.value = job.description
            setFormJobId(job._id)
        }    
    }
    
    function toggleDeleteConfirmationForm(){
        setShowDeleteConfirmation(prevValue=>!prevValue)
    }

    function deleteConfirmation(event:any, company_id: string){
        event.preventDefault()
        setCompanyToDeletion(company_id)
        toggleDeleteConfirmationForm()
    }

    function editJob(event:any, company_id: string){
        event.preventDefault()
        toggleForm(company_id)
    }

    async function deleteJob(){
        const res = await fetch(API_SERVER+`/api/recruiter/jobs/delete?job=${jobToDeletion}&company=${companyId}`, {credentials: 'include'})
        if(!res.ok){
            console.log("Falha ao deletar trabalho")
            return
        }
        
        getJobs()

        toggleDeleteConfirmationForm()
        setCompanyToDeletion('')
    }

    async function toggleForm(jobId: string = ''){
        if(typeof(jobId) == 'string' && jobId!=''){
            await getJob(jobId)
        }else{
            if(refInputName.current != null && refTextboxDescription.current != null){
                refInputName.current.value = ''
                refTextboxDescription.current.value = ''
            }
    
            setActionReturn('')
            setFormJobId('')
        }

        setIsFormVisible((prevIsFormVisible)=> !prevIsFormVisible)
    }

    useEffect(()=>{
       getJobs() 
    },[])

    useEffect(()=>{
        if(FormStatus === 'submitting'){
            if(actreturn === '200'){
                getJobs()
                setTimeout(()=>{setActionReturn('')},2000)
            }
        }
        setFormStatus(navigationStatus?.state)
        setActionReturn(actreturn)
    }, [navState])
    
    const deleteConfirmationForm =
        <div className="fadein fixed w-screen h-screen bg-black/70 top-0 left-0 right-0 bottom-0 m-auto z-30">
            <div className="absolute w-[50%] max-h-[400px] max-w-[200px] overflow-y-auto h-fit rounded-md p-4 text-center top-0 left-0 right-0 bottom-0 m-auto bg-white shadow-md shadow-black/30 font-Roboto">
                <h1 className='font-medium'>Deseja realmente deletar essa vaga de trabalho?</h1>
                <p className='text-sm'>(Essa ação irá deletar todas as etapas e candidatos vinculados a essa vaga)</p>
                <div className='flex flex-row justify-between p-5'>
                    <button className='' onClick={deleteJob}>Sim</button>
                    <button className='text-alert' onClick={toggleDeleteConfirmationForm}>Não</button>
                </div>
            </div>
        </div>

    type JobsType = {
        _id: string,
        name: string,
        description: string 
    }

    function buildJobsElements(jobs:Array<JobsType>){
        setJobsEl(jobs.map(job => {
            return(
                <Link to={`/steps?company=${companyId}&job=${job._id}`} key={job._id}>
                    <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block hover:bg-active-primary/10">
                        <FontAwesomeIcon className='float-left text-2xl bg-gray-200 p-4 rounded-full' icon={faBriefcase} />
                        <div className="flex flex-row w-full sm:w-auto">
                            <div className="w-full flex flex-col ml-3 font-Roboto">
                                <h3 className="font-medium">{parseHTML(job.name)}</h3>
                                <p className="text-xs text-label-secondary">{parseHTML(job.description)}</p>
                            </div>
                            <div className="flex flex-col justify-between">
                                <button onClick={(event:any)=>editJob(event, job._id)}>
                                     <FontAwesomeIcon className='text-label-secondary' icon={faEdit} />
                                </button>
                                <button onClick={(event:any)=>deleteConfirmation(event, job._id)}>
                                    <FontAwesomeIcon className='text-alert' icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    </li>
                </Link>
                    
            )
        }))
    }

    let textBtnAdd: string = ''
    if(FormStatus === 'idle'){
        if(FormJobId=='')
            textBtnAdd = 'Adicionar'
        else
            textBtnAdd = 'Salvar edição'
    }
    if(FormStatus === 'submitting')
        textBtnAdd = 'Enviando'

    let textResponse: string = ''
    if(actionReturn == '200' && FormJobId == '')
        textResponse = '✔️ Nova vaga cadastrada'
    else if (actionReturn == '200' && FormJobId != '')
        textResponse = '✔️ Edição realizada'
    
    const formContent = 
        <>        
                <Form className='w-11/12 flex flex-col gap-3 items-center sm:items-start m-5 font-Roboto text-label-primary' method='post'>
                    <label className='text-sm' htmlFor="job_name">Nome</label>
                    <input ref={refInputName} className='w-full p-2 rounded-full border-[1px] shadow-md shadow-black/20 text-center sm:text-left sm:rounded-md sm:w-full' type="text" name="name" id="job_name" placeholder='Nome da vaga...'/>
                    <label className='text-sm' htmlFor="decription">Descrição</label>
                    <textarea ref={refTextboxDescription} className='w-full resize-none p-1 s320:p-4 border-[1px] border-black/20 rounded-md shadow-md shadow-black/20 sm:rounded-md' name="description" id="description" cols={30} rows={5} maxLength={100} placeholder='...'></textarea>
                    <span className="text-[10px] self-center">Max: 250 caracteres</span>
                    <input type='hidden' name='jobsid' value={FormJobId} />
                    <input type='hidden' name='company' value={companyId} />
                    {actionReturn && <span className={'fadein w-full p-2 text-white text-sm '+(actionReturn=='200'?'bg-green-400':'bg-alert/70')} >{actionReturn==='200'?textResponse:'⚠️ ' + actionReturn}</span>}
                    <button disabled={FormStatus==='idle'?false:true} className="w-44 mt-5 self-center font-Roboto font-medium text-sm shadow-lg shadow-black/30 text-white p-3 rounded-full bg-gradient-to-r from-active-primary to-blue-gradient-value uppercase duration-300 hover:hue-rotate-[45deg]">
                        {textBtnAdd}
                    </button>
                </Form>
        </>

    const content =
    <>
    { showDeleteConfirmation && 
        deleteConfirmationForm
    }
            <FormContentPage isFormVisible={isFormVisible} title={FormJobId?'Editar vaga':'Cadastrar nova vaga'} toggleForm={toggleForm} formContent={formContent}/>
    <ul className="flex flex-col sm:w-full sm:block">
        {JobsEl[0]!=null?
                    JobsEl:
                    <div className='p-14 gap-2 flex flex-col flex-center w-full text-center font-Roboto'>
                        <h1 className='font-medium'>Nenhuma vaga adicionada</h1>
                        <h3 className='text-sm text-label-secondary'>(Talvez seja a hora de oferecer uma ótima oportunidade para uma pessoa super talentosa)</h3>
                        <img className='w-56 self-center' src={ImageWaitingJobs} alt='Jobs waiting content img'/>
                    </div>
        }
    </ul>
    </>

    return(
        <ContentPage title={'Todos os trabalhos'} content={content} addAction={toggleForm} isFormVisible={isFormVisible}/>
    )
}
