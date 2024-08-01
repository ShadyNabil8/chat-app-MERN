import { React, useEffect, useState } from 'react'
import debounce from 'lodash.debounce';
import api from '../../api/api.jsx'
import ExploredUser from '../../components/ExploredUser/ExploredUser'
import { useAuth } from '../../context/authContext';
import LoadingDots from '../../components/LoadingDots/LoadingDots'

import './Explore.css'

const Explore = () => {
    // console.log("------------> Explore");

    const [searchQuery, setSearchQuery] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const { authState } = useAuth();
    const userData = authState.userData;

    const debouncedSearch = debounce(async (query) => {
        if (searchQuery) {
            const url = '/user/search';
            try {
                const response = await api.get(url, { params: { query, userId: userData.userId } })

                if (response.data) {
                    setSearchResult(response.data)
                }

            } catch (error) {

            }
        }
        else {
            setSearchResult([])
        }
        setIsLoading(false);
    }, 300);

    useEffect(() => {

        setIsLoading(true);

        debouncedSearch(searchQuery);

        return () => {
            debouncedSearch.cancel();
        };
    }, [searchQuery])

    return (
        <div className="explore-container">
            <div className="search-bar">
                <input type='text' placeholder='Search for friends' onChange={(e) => setSearchQuery(e.target.value)}></input>
            </div>
            {
                (isLoading) ?
                    <LoadingDots></LoadingDots>
                    :
                    <div className="explore-elements-container">
                        {
                            searchResult.map((res, index) => {
                                return <ExploredUser key={index} data={res}></ExploredUser>
                            })
                        }
                    </div>
            }
        </div>
    )
}

export default Explore
