import React from 'react'
import ContentPage from '../components/ContentPage'
import {Link} from 'react-router-dom'
import ImageUber from '../assets/images/companies/Uber.png'
import ImageApplicant1 from '../assets/images/applicants/applicant (1).png'
import ImageApplicant2 from '../assets/images/applicants/applicant (2).png'
import ImageApplicant3 from '../assets/images/applicants/applicant (3).png'
import ImageApplicant4 from '../assets/images/applicants/applicant (4).png'

export default function ApplicantsPage(){
    
    const content = 
    <ul className="flex flex-col sm:w-full sm:block">
    <Link to='#'>
        <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block  hover:bg-active-primary/10">
            <img src={ImageApplicant1} alt="" className="w-16 sm:float-left" />
            <div className="flex flex-row">
                <div className="w-full flex flex-col ml-3 font-Roboto">
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
    </Link>

    <Link to='#'>
        <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block hover:bg-active-primary/10">
            <img src={ImageApplicant2} alt="" className="w-16 sm:float-left" />
            <div className="flex flex-row">
                <div className="w-full flex flex-col ml-3 font-Roboto">
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
    </Link>

    <Link to='#'>
        <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block hover:bg-active-primary/10">
            <img src={ImageApplicant3} alt="" className="w-16 sm:float-left" />
            <div className="flex flex-row">
                <div className="w-full flex flex-col ml-3 font-Roboto">
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
    </Link>

    <Link to='#'>
        <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block hover:bg-active-primary/10">
            <img src={ImageApplicant4} alt="" className="w-16 sm:float-left" />
            <div className="flex flex-row">
                <div className="w-full flex flex-col ml-3 font-Roboto">
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
    </Link>
    </ul>
    return (
        <ContentPage title={'Todos os candidatos'} content={content} />
    )
}