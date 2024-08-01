module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        Button1: '#065804',
        Button2: '#0CBE09',
        diskon: '#0CBE09',
        rekomendasi: '#055C03'
      },
      fontFamily: {
        baloo: ['Baloo', 'sans-serif'],
        poppins: ['Poppins'],
      },
    },
    
  },
  plugins: [
    require('flowbite/plugin')
  ],

}
