import {useEffect, useRef, useState} from 'react'
import { Form, Link, redirect, useActionData, useNavigation } from 'react-router-dom'

import ContentPage from '../components/ContentPage'
import FormContentPage from '../components/FormContentPage'

import ImageWaitingCompanies from '../assets/images/companies/companies_idle.svg'
import ImageFormPlaceHolder from '../assets/images/companies/form-placeholder.png'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

import { API_SERVER, isRecruiterAuthenticated } from '../utils/utils'
import parseHTML from 'html-react-parser'

export async function loader(){
    if(! await isRecruiterAuthenticated()){
        return redirect('/login')
    }

    return null
}

export async function action({request}:{request:Request}){
    const dataForm = Object.fromEntries(await request.formData())
    const name: string = dataForm.name as string
    const description: string = dataForm.description as string
    const image: File = dataForm.image as File
    const company_id: string = dataForm.company_id as string

    if(!name || !description || !image.name){
        return 'Preencha todos os capos (não esqueça de selecionar uma imagem também)'
    }

    if(name.length > 42){
        return 'O nome da empresa deve ter no máximo 42 caracteres'
    }

    if(description.length > 250){
        return 'A descrição deve ter no máximo 250 caracteres'
    }

    if(image.type!='image/png' && image.type!='image/jpg' && image.type!='image/jpeg'){
        return 'Somente .png, jpg, jpeg 🤭'
    }

    const maxImgSize = 1024*1000
    if(image.size > maxImgSize){
        return 'A imagem deve ter no máximo 1mb'
    }

    let bodyData = new FormData()
    bodyData.append('name', name)
    bodyData.append('description', description)
    bodyData.append('image',image)

    let res: any
    if(!company_id){
        res = await fetch(API_SERVER+'/api/recruiter/companies/new',{
            method: 'post',
            body: bodyData, 
            credentials: 'include'
        })
    }else{
        bodyData.append('id', company_id)
        res = await fetch(API_SERVER+'/api/recruiter/companies/edit',{
            method: 'post',
            body: bodyData,
            credentials: 'include'
        })

    }
    
    if(res.status === 400){
        return 'Existe um problema com os dados que você preencheu, que tal mudar um pouco?'
    }

    if(res.status === 409){
        return 'Já existe uma empresa com mesmo nome e descrição'
    }

    if(res.status === 200){
        return '200'
    }

    return 'Houve um erro ao processar sua requisição, espere um pouco e tente novamente'
}


export default function CompaniesPage(){

    const [formCopanyId, setFormCompanyId] = useState('')
    const [isFormVisible, setIsFormVisible] = useState(false)
    const [FormImgSrc, setFormImgSrc] = useState(ImageFormPlaceHolder)
    const [FormStatus, setFormStatus] = useState('idle')
    const refInputName = useRef<any>(null)
    const refTextboxDescription = useRef<any>(null)
    const refInputImage = useRef<any>(null)

    const [CompaniesEl, setCompaniesEl] = useState([] as JSX.Element[])
    
    const [actionReturn, setActionReturn] = useState('')
    const actreturn = useActionData() as string

    const navigationStatus = useNavigation()
    const navState = navigationStatus.state

    function getCompanies(){
        const getCompanies = async ()=>{
            const res = await fetch(API_SERVER+'/api/recruiter/companies',{credentials: 'include'})
            const resData = await res.json()

            buildCompaniesElements(resData)
            
        }

        getCompanies()

    }
    
    function toggleDeleteConfirmationForm(){
        setShowDeleteConfirmation(prevValue=>!prevValue)
    }

    async function getCompany(company_id: string){
        const res = await fetch(API_SERVER+`/api/recruiter/companies/company?id=${company_id}`, {credentials: 'include'})
        if(!res.ok){
            setActionReturn('Não foi possível obter os dados da empresa')
            return
        }

        const resData = await res.json()
        fillEditForm(resData)

    }

    async function fillEditForm(company:any){
        if(refInputName.current != null && refTextboxDescription.current != null){
            refInputName.current.value = company.name
            refTextboxDescription.current.value = company.description
            setFormImgSrc(API_SERVER+`/uploads/${company.picture}`)
            setFormCompanyId(company._id)

            const imgBlob:any = await getImgURL(API_SERVER+`/uploads/${company.picture}`)
            let fileName = 'dejavu.png'
            let file = new File([imgBlob], fileName, {type:"image/png", lastModified:new Date().getTime()})
            let container = new DataTransfer()
            container.items.add(file)
            if(refInputImage.current != null){
                refInputImage.current.files = container.files
            }
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

    async function toggleForm(company_id: string = ''){
        if(typeof(company_id) == 'string' && company_id!=''){
            await getCompany(company_id)
        }else{
            if(refInputName.current != null && refTextboxDescription.current != null){
                refInputName.current.value = ''
                refTextboxDescription.current.value = ''
            }

            setActionReturn('')
            setFormCompanyId('')
            setFormImgSrc(ImageFormPlaceHolder)
        }

        setIsFormVisible((prevIsFormVisible)=> !prevIsFormVisible)
    }

    function deleteConfirmation(event:any, company_id: string){
        event.preventDefault()
        setCompanyToDeletion(company_id)
        toggleDeleteConfirmationForm()
    }

    async function deleteCompany(){
        const res = await fetch(API_SERVER+`/api/recruiter/companies/delete?id=${companyToDeletion}`, {credentials: 'include'})
        if(!res.ok){
            console.log("Falha ao deletar empresa")
            return
        }
        
        getCompanies()

        toggleDeleteConfirmationForm()
        setCompanyToDeletion('')
    }

    function editCompany(event:any, company_id: string){
        event.preventDefault()
        toggleForm(company_id)
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
        if(FormStatus === 'submitting'){
            if(actreturn === '200'){
                getCompanies()
                setTimeout(()=>{setActionReturn('')},2000)
            }
        }
        setFormStatus(navigationStatus?.state)
        setActionReturn(actreturn)
    }, [navState])

    useEffect(()=>{
        getCompanies()
    },[])


    const deleteConfirmationForm =
        <div className="fadein fixed w-screen h-screen bg-black/70 top-0 left-0 right-0 bottom-0 m-auto z-30">
            <div className="absolute w-[50%] max-h-[400px] max-w-[200px] overflow-y-auto h-fit rounded-md p-4 text-center top-0 left-0 right-0 bottom-0 m-auto bg-white shadow-md shadow-black/30 font-Roboto">
                <h1 className='font-medium'>Deseja realmente deletar essa empresa?</h1>
                <p className='text-sm'>(Essa ação irá deletar todos os trabalhos, etapas, e candidatos vinculados a essa empresa)</p>
                <div className='flex flex-row justify-between p-5'>
                    <button className='' onClick={deleteCompany}>Sim</button>
                    <button className='text-alert' onClick={toggleDeleteConfirmationForm}>Não</button>
                </div>
            </div>
        </div>
    
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [companyToDeletion, setCompanyToDeletion] = useState('')
    

    type CompaniesType = {
        _id: string;
        name: string;
        description: string;
        picture: string;
    }
    
    function buildCompaniesElements(companies:Array<CompaniesType>){
        setCompaniesEl(()=>companies.map(company=>{
            return (<Link key={company._id} to={`/jobs?company=${company._id}`}>
                    <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block hover:bg-active-primary/10">
                    <img src={API_SERVER+`/uploads/${company.picture}`} alt="" className="w-16 h-16 rounded-full sm:float-left" />
                        <div className="flex flex-row justify-between w-full sm:w-auto">
                            <div className="w-full flex flex-col ml-3 font-Roboto">
                                <h3 className="font-medium">{parseHTML(company.name)}</h3>
                                <p className="text-xs text-label-secondary">{parseHTML(company.description)}</p>
                            </div>
                            <div className="flex flex-col justify-between">
                            <button onClick={(event:any)=>editCompany(event, company._id)}>
                                     <FontAwesomeIcon className='text-label-secondary' icon={faEdit} />
                                </button>
                            <button onClick={(event:any)=>deleteConfirmation(event, company._id)}>
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
        if(formCopanyId =='')
            textBtnAdd = 'Adicionar'
        else
            textBtnAdd = 'Salvar edição'
    }
    if(FormStatus === 'submitting')
        textBtnAdd = 'Enviando'
  
    let textResponse: string = ''
    if(actionReturn == '200' && formCopanyId == '')
        textResponse = '✔️ Nova empresa cadastrada'
    else if (actionReturn == '200' && formCopanyId != '')
        textResponse = '✔️ Edição realizada'

    const formContent = 
                <Form className='w-11/12 flex flex-col gap-3 items-center sm:items-start m-5 font-Roboto text-label-primary' method='post' encType="multipart/form-data">
                    <label htmlFor='image'><img className='sm:hidden w-20 h-20 border-[1px] border-active-primary/30 shadow-md shadow-black/20 rounded-full' src={FormImgSrc} alt="" placeholder=''/></label>
                    <input ref={refInputImage} className='hidden' onChange={handleFormImgChange} id={'image'} type="file" accept=".jpg, .png, .jpeg" name={'image'} />
                    <span className='sm:hidden text-[10px] text-label-primary/60' >Clique para adicionar/trocar imagem</span>
                    <label className='text-sm' htmlFor="company_name">Nome</label>
                    <input ref={refInputName} className='w-full p-2 rounded-full border-[1px] shadow-md shadow-black/20 text-center sm:text-left sm:rounded-md sm:w-full' type="text" name="name" id="company_name" placeholder='Nome da empresa...'/>
                    <label className='text-sm' htmlFor="decription">Descrição</label>
                    <textarea ref={refTextboxDescription} className='w-full resize-none p-1 s320:p-4 border-[1px] border-black/20 rounded-md shadow-md shadow-black/20 sm:rounded-md' name="description" id="decription" cols={30} rows={5} maxLength={250} placeholder='...'></textarea>
                    <span className="text-[10px] self-center">Max: 250 caracteres</span>
            {actionReturn && <span className={'fadein w-full p-2 text-white text-sm '+(actionReturn=='200'?'bg-green-400':'bg-alert/70')} >{actionReturn==='200'?textResponse:'⚠️ ' + actionReturn}</span>}
                    <input name='company_id' type='hidden' value={formCopanyId} />
                    <button disabled={FormStatus==='idle'?false:true} className="w-44 mt-5 self-center font-Roboto font-medium text-sm shadow-lg shadow-black/30 text-white p-3 rounded-full bg-gradient-to-r from-active-primary to-blue-gradient-value uppercase duration-300 hover:hue-rotate-[45deg]">
                        {textBtnAdd}
                    </button>
                </Form>

    const content =
                <>
                { showDeleteConfirmation && 
                    deleteConfirmationForm
                }
            <FormContentPage isFormVisible={isFormVisible} title={formCopanyId!=''?'Editar empresa':'Cadastrar nova empresa'} toggleForm={toggleForm} formProfileImage={FormImgSrc} formContent={formContent}/>
                <ul className="flex flex-col sm:w-full sm:block overflow-auto max-h-[650px]">
                {CompaniesEl[0]?CompaniesEl:
                    <div className='p-14 flex flex-col flex-center w-full text-center font-Roboto'>
                        <h1 className='font-medium'>Por enquanto, nada para mostrar</h1>
                        <h3 className='text-sm text-label-secondary'>(Clique em adicionar)</h3>
                        <img className='w-56 self-center' src={ImageWaitingCompanies} alt='Companies waiting content img'/>
                    </div>
                }
                </ul>
                </>

    return(
        <ContentPage title={'Todas as empresas'} content={content} addAction={toggleForm} isFormVisible={isFormVisible}/>
    )
}
