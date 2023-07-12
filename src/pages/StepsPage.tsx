import ContentPage from '../components/ContentPage'
import FormContentPage from '../components/FormContentPage'
import {Link, Form, redirect, useLocation, useActionData, useNavigation} from 'react-router-dom'
import {useEffect, useState, useRef} from 'react'
import ImageUber from '../assets/images/companies/Uber.png'
import ImageProfile1 from '../assets/images/steps/profile (1).png'
import ImageProfile2 from '../assets/images/steps/profile (2).png'
import ImageProfile3 from '../assets/images/steps/profile (3).png'
import ImageWaitingSteps from '../assets/images/steps/steps_idle.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faFlag, faTrash } from '@fortawesome/free-solid-svg-icons'
import { API_SERVER, isRecruiterAuthenticated } from '../utils/utils'

export async function action({request}:{request: Request}){
    const formData = Object.fromEntries(await request.formData())
    const description = formData.description as string
    const job = formData.jobid as string
    const company = formData.companyid as string
    const step = formData.step as string

    console.log(JSON.stringify({
            company: company,
            job: job,
            description: description
            })
)

    if(!description || description.length > 150){
        return 'A descrição deve ter de 1 a 150 caracteres'
    }

    if(!job || !company){
        return 'Trabalho e empresa inválido'
    }

    let res
    if(!step){
        res = await fetch(API_SERVER+`/api/recruiter/steps/new`,
            {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
                },
            body: JSON.stringify({
                company: company,
                job: job,
                description: description
                })
            })
    }else{
        res = await fetch(API_SERVER+`/api/recruiter/steps/edit`,
            {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
                },
            body: JSON.stringify({
                step: step,
                company: company,
                job: job,
                description: description
                })
            })

    }
    if(!res.ok){
        console.log(await res.json())
        return "Houve um problema ao enviar o formulário" 
    }


    return '200'
}

export async function loader({request}:{request:Request}){
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


export default function StepsPage(){
    
    const [isFormVisible, setIsFormVisible] = useState(false)
    const [StepsEl, setStepsEl] = useState([] as JSX.Element[])
    const [FormStatus, setFormStatus] = useState('idle')
    const [FormStepId, setFormStepId] = useState('')
    const [StepToDeletion, setCompanyToDeletion] = useState('') 
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

    const location = useLocation()
    const companyId = new URLSearchParams(location.search).get('company') as string
    const jobId = new URLSearchParams(location.search).get('job') as string
   
    const refStepLabel = useRef<any>(null)
    const refTextboxDescription = useRef<any>(null)  

    const [actionReturn, setActionReturn] = useState('')
    const actreturn = useActionData() as string
    const navigationStatus = useNavigation()

    const navState = navigationStatus.state

    useEffect(()=>{
        getStepsAndUpdate()
    },[])

    useEffect(()=>{
        if(FormStatus === 'submitting'){
            if(actreturn === '200'){
                getStepsAndUpdate()
                setTimeout(()=>{setActionReturn('')},2000)
            }
        }
        setFormStatus(navigationStatus?.state)
        setActionReturn(actreturn)
    }, [navState])

    async function getStepsAndUpdate(){
        const getSteps = async ()=>{
            const res = await fetch(API_SERVER+`/api/recruiter/steps?company=${companyId}&job=${jobId}`, {credentials: 'include'})
            if(!res.ok){
                console.log(res.text)
                return
            }

            buildStepsElements(await res.json())
        }

        getSteps()

    }

    function editStep(event:any, stepid: string){
        event.preventDefault()
        toggleForm(stepid)
    }
    
    async function toggleForm(stepid: string = ''){
        if(typeof(stepid) == 'string' && stepid!=''){
            await getStep(stepid)
        }else{
            if(refTextboxDescription.current != null){
                refTextboxDescription.current.value = ''
                refStepLabel.current.innerText = `# Etapa ${StepsEl.length + 1}`
            }

            setActionReturn('')
            setFormStepId('')
        }

        setIsFormVisible((prevIsFormVisible)=> !prevIsFormVisible)
    }

    async function getStep(stepId: string){
        const res = await fetch(API_SERVER+`/api/recruiter/steps/step?step=${stepId}&company=${companyId}&job=${jobId}`,{credentials: 'include'})
        if(!res.ok){
            console.log("Erro ao obter etapa")
            return
        }

        const resData = await res.json() 
        fillEditForm(resData)
    }

    async function fillEditForm(step: any){
        if(refStepLabel.current!=null && refTextboxDescription.current != null){
            refStepLabel.current.innerText = `# Etapa ${step.position}`
            refTextboxDescription.current.value = step.description
            setFormStepId(step._id)
        }    
    }

    function toggleDeleteConfirmationForm(){
        setShowDeleteConfirmation(prevValue=>!prevValue)
    }

    function deleteConfirmation(event:any, stepid: string){
        event.preventDefault()
        setCompanyToDeletion(stepid)
        toggleDeleteConfirmationForm()
    }

    async function deleteStep(event:any, stepId:string){
        event.preventDefault()
        console.log('Deleting step: ',stepId)

        const res = await fetch(API_SERVER+`/api/recruiter/steps/delete?step=${stepId}&company=${companyId}&job=${jobId}`, {credentials: 'include'})
        if(!res.ok){
            console.log("Falha ao deletar etapa")
            return
        }

        console.log('Etapada deletada!')
        getStepsAndUpdate()
        toggleDeleteConfirmationForm()
    }

    const deleteConfirmationForm =
        <div className="fadein fixed w-screen h-screen bg-black/70 top-0 left-0 right-0 bottom-0 m-auto z-30">
            <div className="absolute w-[50%] max-h-[400px] max-w-[200px] overflow-y-auto h-fit rounded-md p-4 text-center top-0 left-0 right-0 bottom-0 m-auto bg-white shadow-md shadow-black/30 font-Roboto">
                <h1 className='font-medium'>Deseja realmente deletar essa etapa?</h1>
                <p className='text-sm'>(Essa ação irá {StepsEl.length==1?'deletar/desvincular todos os candidatos desse trabalho':'mover os candidatos para a # Etapa 1'})</p>
                <div className='flex flex-row justify-between p-5'>
                    <button className='' onClick={(event)=>{deleteStep(event, StepToDeletion)}}>Sim</button>
                    <button className='text-alert' onClick={toggleDeleteConfirmationForm}>Não</button>
                </div>
            </div>
        </div>

    function buildStepsElements(steps:any){
        setStepsEl(steps.map((step:any)=>{
            return (
                <Link key={step._id} className='relative my-3 sm:max-w-[250px] sm:mx-3 hover:scale-105 transition delay-100' to={`/applicants?company=${companyId}&job=${jobId}&step=${step._id}`}>
                    <div className='w-full sm:w-60 bg-gradient-to-r from-indigo-500 to-purple-500 h-48 bg-gray-700 font-Roboto text-white text-center rounded-md p-3'>
                        <h1 className='uppercase font-bold text-6xl sm:text-4xl  '># Etapa {step.position}</h1>
                        <p className='font-light m-8'>{step.description}</p>
                    </div>
                    <div className="w-full px-5 absolute bottom-1 flex flex-row justify-between">
                        <button onClick={(event)=>{editStep(event, step._id)}}>
                             <FontAwesomeIcon className='text-white' icon={faEdit} />
                        </button>
                        <button  onClick={(event:any)=>deleteConfirmation(event, step._id)}>
                            <FontAwesomeIcon className='text-alert' icon={faTrash} />
                        </button>
                    </div>
                </Link>
            )
        }))
    }


    let textBtnAdd: string = ''
    if(FormStatus === 'idle'){
        if(FormStepId){
            textBtnAdd = 'Editar'
        }else{
            textBtnAdd = 'Adicionar'
        }
    }
    if(FormStatus === 'submitting')
        textBtnAdd = 'Enviando'
  
    let textResponse: string = ''
    if(actionReturn == '200'){
        if(FormStepId){
            textResponse = '✔️ Etapa editada'
        }else{
            textResponse = '✔️ Nova etapa cadastrada'
        }
    }
    const formContent = 
                <Form className='w-11/12 flex flex-col gap-3 items-center sm:items-start m-5 font-Roboto text-label-primary' method='post'>
                <div className='flex flex-col text-center w-full font-Roboto font-semibold text-title-primary'>
                    <FontAwesomeIcon className='' icon={faFlag} />
                    <h1 ref={refStepLabel} className='uppercase text-6xl'># Etapa {StepsEl.length+1} </h1>
                </div>
                <label className='text-sm' htmlFor="description">Descrição</label>
                <textarea ref={refTextboxDescription} className='w-full resize-none p-1 s320:p-4 border-[1px] border-black/20 rounded-md shadow-md shadow-black/20 sm:rounded-md' name="description" id="description" cols={30} rows={5} maxLength={150} placeholder='...'></textarea>
                    <input type='hidden' name='companyid' value={companyId} />
                    <input type='hidden' name='jobid' value={jobId} />
                    <input type='hidden' name='step' value={FormStepId} />
                    <span className="text-[10px] self-center">Max: 150 caracteres</span>
            {actionReturn && <span className={'fadein w-full p-2 text-white text-sm '+(actionReturn=='200'?'bg-green-400':'bg-alert/70')} >{actionReturn==='200'?textResponse:'⚠️ ' + actionReturn}</span>}
                    <button className="w-44 mt-5 self-center font-Roboto font-medium text-sm shadow-lg shadow-black/30 text-white p-3 rounded-full bg-gradient-to-r from-active-primary to-blue-gradient-value uppercase duration-300 hover:hue-rotate-[45deg]">{textBtnAdd}</button>
                </Form>

    const content =
    <>
     
    { showDeleteConfirmation && 
        deleteConfirmationForm
    }
            <FormContentPage title={FormStepId?'Editar etapa':'Cadastrar nova etapa'} toggleForm={toggleForm} isFormVisible={isFormVisible} formContent={formContent}/>
            <ul className="flex flex-col sm:mt-10 sm:flex-row sm:flex-wrap lg:flex-row lg:flex-wrap sm:justify-center">
                {StepsEl[0]?StepsEl:
                    <div className='p-14 flex flex-col flex-center w-full text-center font-Roboto'>
                        <h1 className='font-medium'>Etapas ainda não definidas</h1>
                        <h3 className='text-sm text-label-secondary'>(Adicione as etapas do processo de seleção)</h3>
                        <img className='w-56 self-center' src={ImageWaitingSteps} alt='Companies waiting content img'/>
                    </div>
                } 
            </ul>
</>

    return(<ContentPage content={content} addAction={toggleForm} isFormVisible={isFormVisible} />)
}
