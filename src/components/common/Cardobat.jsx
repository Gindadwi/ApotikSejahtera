import search from '../../assets/search.png'

const Cardobat = ({ image, diskon, title, hargaasli, hargadiskon, cardClass, kegunaan, onClick, disabled }) => {
    return (
        <div onClick={!disabled ? onClick : undefined} className={`bg-slate-300 rounded-lg w-[160px] h-[220px] lg:max-w-[720px] border border-gray-400 ${cardClass} flex flex-col justify-between`}>

            {/* <div className='bg-diskon m-3 w-[60px] text-center rounded-xl absolute mt-1 ml-1'>
                <h2 className='text-[12px] p-0 text-center text-white font-poppins'> {diskon}%</h2>
            </div> */}
            <div className='w-full items-center justify-center flex'>
                <div className="w-full h-[75px] justify-center rounded-lg m-[5px] mt-1 flex items-center bg-white ">
                    <img src={image} alt=""
                        className='items-center justify-center flex w-full h-full rounded-lg ' />
                </div>
            </div>

            <div className='mx-3 mb-auto'>
                <h1 className='font-poppins font-semibold text-[12px]'>{title}</h1>
                <p className='text-[12px] text-left text-black'>{kegunaan}</p>
            </div>

            <div className='mx-3 mb-3'>
                <h3 className='font-semibold font-poppins text-[14px] text-right text-red-700 shadow-sm'>Rp {hargadiskon}</h3>
            </div>

        </div>
    );
}

export default Cardobat;
