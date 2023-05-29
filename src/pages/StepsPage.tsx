import ContentPage from '../components/ContentPage'
import {Link} from 'react-router-dom'
import ImageUber from '../assets/images/companies/Uber.png'
import ImageProfile1 from '../assets/images/steps/profile (1).png'
import ImageProfile2 from '../assets/images/steps/profile (2).png'
import ImageProfile3 from '../assets/images/steps/profile (3).png'


export default function StepsPage(){
    const content =  
    <ul className="flex flex-col sm:w-full sm:block">
    <Link to='#'>
        <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block">
            <div className="relative w-full h-44 bg-[#D9D9D9] rounded-lg border-[1px] border-label-primary/10 duration-200 hover:border-active-primary">
                <h1 className="absolute left-0 font-Righteous text-white/40 text-center text-9xl">1ª <span className='text-6xl'>Etapa</span></h1>
                <div className="absolute left-0 top-0 w-full h-full p-2">
                    <p className="absolute right-4 font-Roboto font-light">Aqui ficam todos os candidatos.</p>
                    <div className="absolute flex flex-row bottom-3 w-full p-2 mb-5 items-center">
                            <span className='font-Roboto font-medium text-label-primary'>+37</span>
                            <img className='w-10  z-[0] absolute left-[45px]' src={ImageUber} alt="" />
                            <img className='w-10  z-[2] absolute left-[65px]' src={ImageProfile1} alt="" />
                            <img className='w-10  z-[3] absolute left-[85px]' src={ImageProfile2} alt="" />
                            <img className='w-10  z-[4] absolute left-[105px]' src={ImageProfile3} alt="" />
                    </div>
                </div>
            </div>
        </li>
        <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block">
            <div className="relative w-full h-44 bg-[#00B4DC] rounded-lg border-[1px] border-label-primary/10 duration-200 hover:border-active-primary">
                <h1 className="absolute left-0 font-Righteous text-white/40 text-center text-9xl">2ª <span className='text-6xl'>Etapa</span></h1>
                <div className="absolute left-0 top-0 w-full h-full p-2">
                    <p className="absolute right-4 font-Roboto font-light">Entrevista via vídeo chamada.</p>
                    <div className="absolute flex flex-row bottom-3 w-full p-2 mb-5 items-center">
                            <span className='font-Roboto font-medium text-label-primary'>+37</span>
                            <img className='w-10  z-[0] absolute left-[45px]' src={ImageUber} alt="" />
                            <img className='w-10  z-[2] absolute left-[65px]' src={ImageProfile1} alt="" />
                            <img className='w-10  z-[3] absolute left-[85px]' src={ImageProfile2} alt="" />
                            <img className='w-10  z-[4] absolute left-[105px]' src={ImageProfile3} alt="" />
                    </div>
                </div>
            </div>
        </li>
        <li className="flex flex-row items-center border-b-2 py-5 self-center w-full sm:block">
            <div className="relative w-full h-44 bg-[#02CFC3] rounded-lg border-[1px] border-label-primary/10 duration-200 hover:border-active-primary">
                <h1 className="absolute left-0 font-Righteous text-white/40 text-center text-9xl">3ª <span className='text-6xl'>Etapa</span></h1>
                <div className="absolute left-0 top-0 w-full h-full p-2">
                    <p className="absolute right-4 font-Roboto font-light">Entrevista técnica.</p>
                    <div className="absolute flex flex-row bottom-3 w-full p-2 mb-5 items-center">
                            <span className='font-Roboto font-medium text-label-primary'>+37</span>
                            <img className='w-10  z-[0] absolute left-[45px]' src={ImageUber} alt="" />
                            <img className='w-10  z-[2] absolute left-[65px]' src={ImageProfile1} alt="" />
                            <img className='w-10  z-[3] absolute left-[85px]' src={ImageProfile2} alt="" />
                            <img className='w-10  z-[4] absolute left-[105px]' src={ImageProfile3} alt="" />
                    </div>
                </div>
            </div>
        </li>
    </Link>
</ul>

    return(<ContentPage content={content} />)
}