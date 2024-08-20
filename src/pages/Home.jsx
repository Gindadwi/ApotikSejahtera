import React, { useEffect } from 'react';
import Carosel from '../components/common/Carosel';
import CardSlider from '../components/common/CardSlider';
import Rekomendasi from '../components/Rekomendasi';
import Untukkamu from '../components/Untukkamu';




const Home = () => {

  useEffect(() => {


    // Menambahkan script Tawk.to setelah komponen dirender
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/66b6bbf30cca4f8a7a7416b7/1i4sssclb';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []);

  return (
    <main className='mx-auto w-full min-w-[360px] max-w-[1080px] px-5 py-1 lg:mx-auto lg:px-0'>
      <div>
        <Carosel />
      </div>

      <div className='mb-10'>
        <h1 className='text-center font-baloo text-[18px] lg:text-[24px]' >Product promotion</h1>
        <CardSlider />
      </div>

      <div>
        <Rekomendasi />
      </div>

      <div>
        <Untukkamu />
      </div>
    </main>
  );
};

export default Home;
