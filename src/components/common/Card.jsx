import search from '../../assets/search.png'


const Card = ({ image, diskon, title, hargaasli, hargadiskon, cardClass, kegunaan, onClick }) => {

        return (
            <div onClick={onClick} className={`bg-slate-300 rounded-lg w-[125px] h-[155px] lg:max-w-[720px] border border-gray-400 ${cardClass}`}>

                <div className='bg-diskon m-3 w-[60px] text-center rounded-xl absolute mt-1 ml-1'>
                    <h2 className='text-[12px] p-0 text-center text-white font-poppins'> {diskon}%</h2>
                </div>
                <div className='w-full items-center justify-center flex'>
                    <div className="w-[100px] h-[50px] justify-center rounded-lg m-[5px] mt-3 flex items-center bg-white ">
                        <img src={image} alt=""
                            className='items-center justify-center flex  ' />
                    </div>
                </div>

                <div className='mx-3' >
                    <h1 className='font-poppins font-semibold text-[12px] h-10'>{title}</h1>
                    <p className='text-[12px] text-right mt-2 line-through text-gray-500'>Rp. {hargaasli}</p>
                    <h3 className='font-semibold font-poppins text-[14px] text-right text-red-700 shadow-sm'>Rp. {hargadiskon}</h3>
                </div>
            </div>
        );


}

export default Card;