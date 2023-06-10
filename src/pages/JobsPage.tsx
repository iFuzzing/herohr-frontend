import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ContentPage from '../components/ContentPage'
import FormContentPage from '../components/FormContentPage'
import {useState} from 'react'
import { Link, Form, redirect } from 'react-router-dom'
import { faBriefcase, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { isRecruiterAuthenticated } from '../utils/utils'

export async function loader(){
    if(!await isRecruiterAuthenticated()){
        return redirect('/login')
    }

    return null
}

export default function JobsPage(){
    const [isFormVisible, setIsFormVisible] = useState(false)

    function toggleForm(){
        setIsFormVisible((prevIsFormVisible)=> !prevIsFormVisible)
    }

    const formContent = 
        <>        
                <Form className='w-11/12 flex flex-col gap-3 items-center sm:items-start m-5 font-Roboto text-label-primary' method='post'>
                    <label className='text-sm' htmlFor="job_name">Nome</label>
                    <input className='w-full p-2 rounded-full border-[1px] shadow-md shadow-black/20 text-center sm:text-left sm:rounded-md sm:w-full' type="text" name="job_name" id="job_name" placeholder='Nome da vaga...'/>
                    <label className='text-sm' htmlFor="decription">Descrição</label>
                    <textarea className='w-full resize-none p-1 s320:p-4 border-[1px] border-black/20 rounded-md shadow-md shadow-black/20 sm:rounded-md' name="decription" id="decription" cols={30} rows={5} maxLength={100} placeholder='...'></textarea>
                    <span className="text-[10px] self-center">Max: 100 caracteres</span>
                    <button className="w-44 mt-5 self-center font-Roboto font-medium text-sm shadow-lg shadow-black/30 text-white p-3 rounded-full bg-gradient-to-r from-active-primary to-blue-gradient-value uppercase duration-300 hover:hue-rotate-[45deg]">Adicionar</button>
                </Form>
        </>

    const content =
    <>
    { isFormVisible &&
    <FormContentPage title={'Cadastrar nova vaga'} toggleForm={toggleForm} formContent={formContent}/>
    }
    <ul className="flex flex-col sm:w-full sm:block">
        <Link to='#'>
            <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block">
                <FontAwesomeIcon className='float-left text-2xl bg-gray-200 p-4 rounded-full' icon={faBriefcase} />
                <div className="flex flex-row">
                    <div className="w-full flex flex-col ml-3 font-Roboto">
                        <h3 className="font-medium">Desenvolvedor(a) Front-end (React) Pleno</h3>
                        <p className="text-xs text-label-secondary">Projetar soluções práticas para resolver problemas.
    Participar de revisões de código e testes.
    Fornecer a tecnologia para uma plataforma que facilite as solicitações mensais.</p>
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
        </Link>
    </ul>
    </>

    return(
        <ContentPage title={'Todos os trabalhos'} content={content} addAction={toggleForm} isFormVisible={isFormVisible}/>
    )
}
