import {useEffect, useState} from 'react'
import { Form, Link, redirect, useActionData } from 'react-router-dom'
import ContentPage from '../components/ContentPage'
import ImageUber from '../assets/images/companies/Uber.png'
import FormContentPage from '../components/FormContentPage'
import ImageFormPlaceHolder from '../assets/images/companies/form-placeholder.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { isRecruiterAuthenticated } from '../utils/utils'
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

    if(!name || !description || !image.name){
        return 'Preencha todos os capos (não esqueça de selecionar uma imagem também)'
    }

    if(name.length > 42){
        return 'O nome da empresa deve ter no máximo 42 caracteres'
    }

    if(description.length > 250){
        return 'A descrição deve ter no máximo 250 caracteres'
    }

    const maxImgSize = 1024*1000
    if(image.size > maxImgSize){
        return 'A imagem deve ter no máximo 1mb'
    }

    let bodyData = new FormData()
    bodyData.append('name', name)
    bodyData.append('description', description)
    bodyData.append('image',image)

    const res = await fetch('http://localhost:3500/api/recruiter/companies/new',{
        method: 'post',
        body: bodyData, 
        credentials: 'include'
    })
    
    if(res.status === 400){
        //const err = await res.text()
        return 'Existe um problema com o seu formulário, que tal mudar ele um pouco?'
    }

    if(res.status === 200){
        return 'Nova empresa registrada'
    }

    return 'Houve um erro ao processar sua requisição, espere um pouco e tente novamente'
}


export default function CompaniesPage(){

    const [isFormVisible, setIsFormVisible] = useState(false)
    const [CompaniesEl, setCompaniesEl] = useState([] as JSX.Element[])
    const [FormImgSrc, setFormImgSrc] = useState(ImageFormPlaceHolder)
    const actionReturn: string = useActionData() as string 

    useEffect(()=>{
        const getCompanies = async ()=>{
            const res = await fetch('http://localhost:3500/api/recruiter/companies',{credentials: 'include'})
            const resData = await res.json()

            buildCompaniesElements(resData)
            
        }

        getCompanies()
    },[])

    type CompaniesType = {
        _id: string;
        name: string;
        description: string;
        picture: string;
    }
    
    function buildCompaniesElements(companies:Array<CompaniesType>){
        setCompaniesEl(()=>companies.map(company=>{
            return (<Link key={company._id} to='#'>
                    <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block">
                    <img src={`http://localhost:3500/uploads/${company.picture}`} alt="" className="w-16 h-16 rounded-full sm:float-left" />
                        <div className="flex flex-row justify-between w-full sm:w-auto">
                            <div className="w-full flex flex-col ml-3 font-Roboto">
                                <h3 className="font-medium">{parseHTML(company.name)}</h3>
                                <p className="text-xs text-label-secondary">{parseHTML(company.description)}</p>
                            </div>
                            <div className="flex flex-col justify-between">
                                <button>
                                    <FontAwesomeIcon className='text-label-secondary' icon={faEdit} />
                                </button>
                                <button>
                                    <FontAwesomeIcon className='text-alert' icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    </li>
                </Link>
            )
        }))
    }

    function toggleForm(){
        setIsFormVisible((prevIsFormVisible)=> !prevIsFormVisible)
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

    const formContent = 
                <Form className='w-11/12 flex flex-col gap-3 items-center sm:items-start m-5 font-Roboto text-label-primary' method='post' encType="multipart/form-data">
                    <label htmlFor='image'><img className='sm:hidden w-20 h-20 border-[1px] border-active-primary/30 shadow-md shadow-black/20 rounded-full' src={FormImgSrc} alt="" placeholder=''/></label>
                    <input className='hidden' onChange={handleFormImgChange} id={'image'} type="file" accept=".jpg, .png, .jpeg" name={'image'} />
                    <span className='sm:hidden text-[10px] text-label-primary/60' >Clique para adicionar/trocar imagem</span>
                    <label className='text-sm' htmlFor="company_name">Nome</label>
                    <input className='w-full p-2 rounded-full border-[1px] shadow-md shadow-black/20 text-center sm:text-left sm:rounded-md sm:w-full' type="text" name="name" id="company_name" placeholder='Nome da empresa...'/>
                    <label className='text-sm' htmlFor="decription">Descrição</label>
            <textarea className='w-full resize-none p-1 s320:p-4 border-[1px] border-black/20 rounded-md shadow-md shadow-black/20 sm:rounded-md' name="description" id="decription" cols={30} rows={5} maxLength={250} placeholder='...'></textarea>
                    <span className="text-[10px] self-center">Max: 250 caracteres</span>
                    {actionReturn}
                    <button className="w-44 mt-5 self-center font-Roboto font-medium text-sm shadow-lg shadow-black/30 text-white p-3 rounded-full bg-gradient-to-r from-active-primary to-blue-gradient-value uppercase duration-300 hover:hue-rotate-[45deg]">Adicionar</button>
                </Form>

    const content =
                <>
                { isFormVisible &&
                <FormContentPage title={'Cadastrar nova empresa'} toggleForm={toggleForm} formProfileImage={FormImgSrc} formContent={formContent}/>
                }
                <ul className="flex flex-col sm:w-full sm:block overflow-auto max-h-[650px]">
                    {CompaniesEl}
                </ul>
                </>

    return(
        <ContentPage title={'Todas as empresas'} content={content} addAction={toggleForm} isFormVisible={isFormVisible}/>
    )
}


                /* <Link to='#'>
                    <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block">
                        <img src={ImageUber} alt="" className="w-16 h-16 sm:float-left" />
                        <div className="flex flex-row">
                            <div className="w-full flex flex-col ml-3 font-Roboto">
                                <h3 className="font-medium">UBER</h3>
                                <p className="text-xs text-label-secondary">Multinacional americana, prestadora de serviços eletrônicos na área do transporte privado urbano</p>
                            </div>
                            <div className="flex flex-col justify-between">
                                <Link to='/1'>
                                    <FontAwesomeIcon className='text-label-secondary' icon={faEdit} />
                                </Link>
                                <Link to='/2'>
                                    <FontAwesomeIcon className='text-alert' icon={faTrash} />
                                </Link>
                            </div>
                        </div>
                    </li>
                </Link> */

