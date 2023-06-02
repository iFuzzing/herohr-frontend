import {useState} from 'react'
import { Form, Link } from 'react-router-dom'
import ContentPage from '../components/ContentPage'
import ImageUber from '../assets/images/companies/Uber.png'
import FormContentPage from '../components/FormContentPage'
import ImageFormPlaceHolder from '../assets/images/companies/form-placeholder.png'

export default function CompaniesPage(){

    const [isFormVisible, setIsFormVisible] = useState(false)

    function toggleForm(){
        setIsFormVisible((prevIsFormVisible)=> !prevIsFormVisible)
    }

    const formContent = 
                <Form className='w-11/12 flex flex-col gap-3 items-center sm:items-start m-5 font-Roboto text-label-primary' method='post'>
                    <img className='sm:hidden w-20 h-20 border-[1px] border-active-primary/30 shadow-md shadow-black/20 p-7 rounded-full' src={ImageFormPlaceHolder} alt="" placeholder=''/>
                    <span className='sm:hidden text-[10px] text-label-primary/60' >Clique para adicionar/trocar imagem</span>
                    <label className='text-sm' htmlFor="company_name">Nome</label>
                    <input className='w-full p-2 rounded-full border-[1px] shadow-md shadow-black/20 text-center sm:text-left sm:rounded-md sm:w-full' type="text" name="company_name" id="company_name" placeholder='Nome da empresa...'/>
                    <label className='text-sm' htmlFor="decription">Descrição</label>
            <textarea className='w-full resize-none p-1 s320:p-4 border-[1px] border-black/20 rounded-md shadow-md shadow-black/20 sm:rounded-md' name="decription" id="decription" cols={30} rows={5} maxLength={100} placeholder='...'></textarea>
                    <span className="text-[10px] self-center">Max: 100 caracteres</span>
                    <button className="w-44 mt-5 self-center font-Roboto font-medium text-sm shadow-lg shadow-black/30 text-white p-3 rounded-full bg-gradient-to-r from-active-primary to-blue-gradient-value uppercase duration-300 hover:hue-rotate-[45deg]">Adicionar</button>
                </Form>

    const content =
                <>
                { isFormVisible &&
                <FormContentPage title={'Cadastrar nova empresa'} toggleForm={toggleForm} hasImgOnForm={true} formContent={formContent}/>
                }
                <ul className="flex flex-col sm:w-full sm:block">
                <Link to='#'>
                    <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block">
                        <img src={ImageUber} alt="" className="w-16 h-16 sm:float-left" />
                        <div className="flex flex-row">
                            <div className="w-full flex flex-col ml-3 font-Roboto">
                                <h3 className="font-medium">UBER</h3>
                                <p className="text-xs text-label-secondary">Multinacional americana, prestadora de serviços eletrônicos na área do transporte privado urbano</p>
                            </div>
                            <div className="flex flex-col justify-between">
                                <Link to='/1'><span className="material-symbols-outlined text-label-secondary">edit</span></Link>
                                <Link to='/2'><span className="material-symbols-outlined text-alert">delete_forever</span></Link>
                            </div>
                        </div>
                    </li>
                </Link>
                </ul>
                </>

    return(
        <ContentPage title={'Todas as empresas'} content={content} addAction={toggleForm} isFormVisible={isFormVisible}/>
    )
}
