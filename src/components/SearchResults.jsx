import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const SearchResults = ({ searchTerm }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) {
            return;
        }

        const db = getDatabase();
        const harganormalRef = ref(db, 'harganormal');
        const diskonobatRef = ref(db, 'diskonobat');

        const fetchData = () => {
            let harganormalData = [];
            let diskonobatData = [];

            onValue(harganormalRef, (snapshot) => {
                const dataHarganormal = snapshot.val();
                if (dataHarganormal) {
                    harganormalData = Object.values(dataHarganormal);
                    onValue(diskonobatRef, (snapshot) => {
                        const dataDiskonobat = snapshot.val();
                        if (dataDiskonobat) {
                            diskonobatData = Object.values(dataDiskonobat);
                            const combinedData = [...harganormalData, ...diskonobatData];

                            // Filter data based on searchTerm
                            const filteredData = combinedData.filter((item) =>
                                item.name.toLowerCase().includes(searchTerm.toLowerCase())
                            );
                            setSearchResults(filteredData);
                        }
                    });
                }
            });
        };

        fetchData();
    }, [searchTerm, user]);

    return (
        <div>
            {searchResults.length > 0 ? (
                searchResults.map(item => (
                    <div key={item.id}>
                        {item.name}: {item.price}
                    </div>
                ))
            ) : (
                <p>No results found</p>
            )}
        </div>
    );
};

export default SearchResults;
