import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

interface Props{
    toggleForm: ()=>void;
    formProfileImage?: string;
    title?: string;
    formContent: any;
}

export default function FormContentPage(props:Props){
    return (
        <>
            <div className="fadein fixed w-screen h-screen bg-black/70 top-0 left-0 right-0 bottom-0 m-auto z-30">
                <div className="absolute w-[95%] max-h-[700px] max-w-3xl overflow-y-auto h-fit rounded-md p-4 text-center top-0 left-0 right-0 bottom-0 m-auto bg-white shadow-md shadow-black/30 font-Kanit text-app-base-primary">
                    <h1 className='font-bold text-2xl'>HERO HR</h1>
                    <FontAwesomeIcon onClick={props.toggleForm} className='cursor-pointer material-symbols-outlined absolute right-0 top-0 p-2 m-2 text-white bg-black/20 rounded-full' icon={faClose} />
                    <hr />
                    <h3 className='uppcase font-normal uppercase'>{props.title}</h3>
                    <div className={props.formProfileImage?'sm:flex sm:flex-row justify-around':'sm:flex justify-center'}>
                        <div className="flex flex-col gap-3 items-center sm:mt-[10%]">
                        {props.formProfileImage &&
                        <>
                                    <label htmlFor='image' ><img className='hidden sm:mt-[10%] sm:block w-24 h-24 border-[2px] border-active-primary/30 shadow-md shadow-black/20 cursor-pointer' src={props.formProfileImage} alt="" placeholder=''/></label>
                            <span className='hidden sm:block text-[10px] text-label-primary/60' >Clique para adicionar/trocar imagem</span>
                        </>
                        }
                        </div>
                        {props.formContent}
                    </div>
                </div>
            </div>
        </>
    )
}
