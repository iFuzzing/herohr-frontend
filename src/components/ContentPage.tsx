import { faAdd, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props{
    title?:string;
    content: any;
    isFormVisible?: boolean;
    addAction?: ()=>void;
}

export default function ContentPage(props:Props){
    return(
        <main className="sm:flex sm:flex-col">
            {props?.title &&
            <>
            <div className="p-3 sm:hidden flex flex-row justify-between font-Roboto font-medium text-label-primary">
                <span>{props.title}</span>
            </div>
             
            
            <div className='mt-2 sm:hidden w-full relative flex justify-center items-center'>
                <input className='font-Roboto px-[8%] w-[93%] p-2 rounded-md absolute shadow-md shadow-gray-400/100' type="text" name="searchbar" id="" />
                <FontAwesomeIcon className="absolute left-[5%] text-[#B4B4B4]" icon={faSearch} />
            </div>
            </>
            }
            <section className="p-5 sm:bg-white self-center sm:m-[5%] sm:w-[80%] sm:max-w-[900px sm:border-[1px] sm:border-gray-300 sm:rounded-lg">
                    { !props.isFormVisible &&
                        <button onClick={props.addAction} className="hidden sm:block float-right text-sm bg-app-base-primary rounded-sm text-white font-Roboto font-medium  p-2 max-w-[100px] shadow-md shadow-black/20">Adicionar</button>
                    }

                {props?.title && 
                <>
                <span className='hidden sm:block font-Roboto font-medium text-label-primary'>{props.title}</span>   
                <div className='hidden sm:block relative mb-10'>
                            <input className='font-Roboto hidden p-1 pl-[8%] md:pl-[6%] lg:pl-[4%] sm:block absolute sm:max-w-[200px] md:max-w-[300px] rounded-sm w-full border-[1px] border-black/10' type="text" name="searchbar" id="" placeholder='Nome...' />
                    <FontAwesomeIcon className="absolute left-[1%] text-2xl text-[#B4B4B4] sm:text-base sm:m-2" icon={faSearch} />
                </div>
                </>      
                }

                {props?.content &&
                props.content
                }
            </section>
            { !props.isFormVisible && 
            <button onClick={props.addAction} className='sm:hidden fixed right-5 bottom-5 bg-app-base-primary p-3 text-white rounded-full flex items-center shadow-md shadow-black/50'>
                <FontAwesomeIcon icon={faAdd} />
            </button>
            } 
        <h5 className="font-light text-xs text-gray-400 text-center">Projeto ainda em desenvolvimento</h5>
        </main>
    )
}
