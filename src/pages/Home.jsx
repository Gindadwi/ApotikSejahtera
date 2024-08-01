import React from 'react';
import Carosel from '../components/common/Carosel'; // Pastikan path ini sesuai dengan struktur project Anda
import CardSlider from '../components/common/CardSlider'; // Pastikan path ini sesuai dengan struktur project Anda
import Rekomendasi from '../components/Rekomendasi';
import Untukkamu from '../components/Untukkamu';

const Home = () => {
  return (
    <main className='mx-auto w-full min-w-[360px] max-w-[1080px] px-5 py-1 lg:mx-auto lg:px-0'>
      <div>
        <Carosel />
      </div>

      <div className='mb-10'>
        <h1 className='text-center font-baloo text-[18px] lg:text-[24px]' >Product Promotion</h1>
        <CardSlider />
      </div>
      
      <div className=''>
        <Rekomendasi/>
      </div>

      <div>
        <Untukkamu />
      </div>
    </main>
  );
};

export default Home;
