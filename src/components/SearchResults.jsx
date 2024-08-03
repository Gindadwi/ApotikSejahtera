import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';

const SearchResults = () => {
    const location = useLocation(); // Hook untuk mengakses objek lokasi saat ini
    const query = new URLSearchParams(location.search).get('query'); // Mengambil parameter 'query' dari URL
    const [results, setResults] = useState([]); // State untuk menyimpan hasil pencarian
    const [loading, setLoading] = useState(true); // State untuk menangani status pemuatan

    useEffect(() => {
        const fetchResults = () => {
            const db = getDatabase(); // Mendapatkan referensi ke Firebase Realtime Database
            const drugsRef = ref(db, 'harganormal'); // Referensi ke path 'harganormal' di database
            const discountDrugsRef = ref(db, 'diskonobat'); // Referensi ke path 'diskonobat' di database

            let fetchedResults = []; // Array untuk menyimpan hasil yang diambil

            // Fungsi untuk mengambil data dari referensi tertentu
            const fetchData = (reference) => {
                return new Promise((resolve) => {
                    onValue(reference, (snapshot) => {
                        const data = snapshot.val(); // Mengambil snapshot data dari referensi
                        resolve(data ? Object.values(data) : []); // Resolusi dengan array data atau kosong jika tidak ada data
                    });
                });
            };

            // Mengambil data dari kedua referensi (obat normal dan diskon)
            Promise.all([fetchData(drugsRef), fetchData(discountDrugsRef)]).then((values) => {
                const [drugsData, discountDrugsData] = values; // Memisahkan hasil dari kedua referensi

                // Memfilter data jika ada query, jika tidak tampilkan semua data
                if (query && query.trim() !== "") {
                    const filteredDrugs = drugsData.filter((drug) =>
                        drug.name.toLowerCase().includes(query.toLowerCase())
                    );
                    const filteredDiscountDrugs = discountDrugsData.filter((drug) =>
                        drug.name.toLowerCase().includes(query.toLowerCase())
                    );

                    fetchedResults = [...filteredDrugs, ...filteredDiscountDrugs]; // Gabungkan hasil filter
                } else {
                    fetchedResults = [...drugsData, ...discountDrugsData]; // Gabungkan semua data jika tidak ada query
                }

                setResults(fetchedResults); // Set hasil pencarian ke state
                setLoading(false); // Set status pemuatan ke false
            });
        };

        fetchResults(); // Memanggil fungsi untuk mengambil hasil pencarian
    }, [query]); // useEffect akan dipanggil ulang jika query berubah

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Search Results</h2>
            {loading ? ( // Menampilkan teks 'Loading...' jika data masih dimuat
                <p>Loading...</p>
            ) : results.length > 0 ? ( // Menampilkan hasil pencarian jika ada hasil
                <ul>
                    {results.map((result, index) => (
                        <li key={index} className="mb-4">
                            <div className="border p-4 rounded">
                                <img src={result.image} alt={result.name} className="w-16 h-16" /> {/* Menampilkan gambar produk */}
                                <h3 className="text-xl font-semibold">{result.name}</h3> {/* Menampilkan nama produk */}
                                <p>{result.dosage}</p> {/* Menampilkan dosis produk */}
                                <p>Price: {result.price}</p> {/* Menampilkan harga produk */}
                                {result.discount && ( // Menampilkan harga diskon jika ada
                                    <p>Discounted Price: {result.discounted_price}</p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : ( // Menampilkan pesan 'No results found.' jika tidak ada hasil pencarian
                <p>No results found.</p>
            )}
        </div>
    );
};

export default SearchResults;
