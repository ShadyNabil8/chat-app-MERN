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
    const { authState, clearUserData } = useAuth();
    const userData = authState.userData;

    const debouncedSearch = debounce(async (query) => {
        const url = '/user/search';
        try {
            if (searchQuery) {
                setIsLoading(true);
                const response = await api.get(url, { params: { query, userId: userData.userId } })

                if (response.data) {
                    setSearchResult(response.data)
                }
            }
            else {
                setSearchResult([])
            }

        } catch (error) {
            if (error.response.data.error.cause === 'authorization') {
                clearUserData();
            }
        }
        finally {
            setIsLoading(false);
        }
    }, 300);

    useEffect(() => {
        debouncedSearch(searchQuery);

        return () => {
            debouncedSearch.cancel();
        };
    }, [searchQuery])

    return (
        <div className="explore-container">
            <div className="search-bar">
                <input type='text' placeholder='Search for new friends' onChange={(e) => setSearchQuery(e.target.value)}></input>
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
