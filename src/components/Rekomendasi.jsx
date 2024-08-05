import React from 'react'
import susu from '../assets/susu.png'
import Vitamin from '../assets/Vitamin.png'
import Obat from '../assets/Obat.png'
import Diskon from '../assets/Diskon.png'
import { Navigate, useNavigate } from 'react-router-dom'

const Rekomendasi = () => {
    const Navigate = useNavigate();
    return (
        <div className='container mx-auto mt-0 lg:max-w-[720px] lg:w-full'>
            <h1 className='font-baloo text-[18px] mb-3 lg:text-[24px]'>Product Rekomendasi</h1>
            <div className='grid grid-cols-2 gap-2 lg:gap-x-5 '>
                <div className='flex gap-2 rounded-lg  bg-rekomendasi p-2 lg:items-center lg:justify-center lg:gap-x-8 lg:py-4'>
                    <div className='row-span-5'>
                        <h2 className='text-white font-baloo text-[12px] lg:text-[20px] lg:mb-4 '>Susu Anak & Dewasa</h2>
                        <button onClick={() => Navigate('/SusuAD')} className='bg-white rounded-lg p-2 text-[10px] font-poppins lg:px-12 lg:text-[12px] '>Lihat Semua</button>
                    </div>
                    <div className='items-center justify-center flex '>
                        <img src={susu} alt=""
                            className='w-14 lg:w-[80px] right-0 ' />
                    </div>
                </div>
                <div className='flex gap-2 rounded-lg  bg-rekomendasi p-2 lg:items-center lg:justify-center lg:gap-x-8 lg:py-4'>
                    <div className='row-span-5 gap-10'>
                        <h2 className='text-white font-baloo text-[12px] mt-1 lg:text-[20px] lg:mb-2'>Aneka Vitamin</h2>
                        <button className='bg-white rounded-lg p-2 text-[10px] font-poppins mt-2 lg:px-12 lg:text-[12px] '>Lihat Semua</button>
                    </div>
                    <div className='items-center justify-center flex '>
                        <img src={Vitamin} alt=""
                            className='w-12 lg:w-[80px] right-0 ' />
                    </div>
                </div>
                <div className='flex gap-2 rounded-lg  bg-rekomendasi p-2 lg:items-center lg:justify-center lg:gap-x-8 lg:py-4'>
                    <div className='row-span-5'>
                        <h2 className='text-white font-baloo text-[12px] lg:text-[20px] lg:mb-4 '>Discount Product</h2>
                        <button className='bg-white rounded-lg p-2 text-[10px] font-poppins lg:px-12 lg:text-[12px] '>Lihat Semua</button>
                    </div>
                    <div className='items-center justify-center flex '>
                        <img src={Diskon} alt=""
                            className='w-14 lg:w-[80px] right-0 ' />
                    </div>
                </div>
                <div className='flex gap-2 rounded-lg  bg-rekomendasi p-2 lg:items-center lg:justify-center lg:gap-x-8 lg:py-4'>
                    <div className='row-span-5 gap-10'>
                        <h2 className='text-white font-baloo text-[12px] mt-1 lg:text-[20px] lg:mb-2'>Obat-obatan </h2>
                        <button className='bg-white rounded-lg p-2 text-[10px] font-poppins mt-2 lg:px-12 lg:text-[12px] '>Lihat Semua</button>
                    </div>
                    <div className='items-center justify-center flex '>
                        <img src={Obat} alt=""
                            className='w-12 lg:w-[80px] right-0 ' />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Rekomendasi
