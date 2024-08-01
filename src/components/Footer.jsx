import React from 'react'
import SosialMedia from './common/SosialMedia'

const Footer = () => {
    return (
        <div className='bg-gradient-to-r from-Button1  to-Button2 py-3 mt-16'>
            <div className='mt-5 container mx-auto w-[300px] lg:max-w-[1080px] lg:w-full lg:grid lg:grid-cols-2'>
                <div className='text-white font-poppins text-center'>
                    <h1 className='font-baloo text-[20px] lg:text-left lg:text-[28px]'>Apotek Sejahtera</h1>
                    <p className='text-[14px] lg:text-left lg:text-[18px]'>
                        memudahkan  Anda mendapatkan obat dan layanan kesehatan kapan saja dan di mana saja.
                    </p>
                </div>

                <div className='my-3 lg:my-0 lg:justify-end'>
                    <div className='justify-center items-center flex lg:justify-end'>
                        <button className='text-white text-15 bg-transparent border border-white py-2 my-3 w-[230px] 
                        lg:w-[320px] lg:py-4 rounded-lg hover:bg-white hover:text-green-950 transition transform ease-in-out duration-200'>
                            Hubungi Kami
                        </button>
                    </div>
                    <div className='justify-center items-center flex lg:items-end lg:justify-end'>
                        <SosialMedia />
                    </div>
                </div>
            </div>
                <hr  className='mt-5'/>
            <div className='text-center mt-5 container mx-auto w-[300px] lg:max-w-[1080px] lg:w-full'>
                <p className='w-[300px] lg:w-[1080px] text-center text-white font-poppins'>
                    Copy Right © 2024 Apotek Sejahtera. All rights reserved.
                </p>
            </div>

        </div>
    )
}

export default Footer
