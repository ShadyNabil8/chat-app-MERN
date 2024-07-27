import { React, useEffect, useState } from 'react'
import debounce from 'lodash.debounce';
import api from '../../api/api.jsx'
import ExploredUser from '../../components/ExploredUser/ExploredUser'
import { useAuth } from '../../context/authContext';

import './Explore.css'

const Explore = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResult, setSearchResult] = useState([])

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
                <input type='text' placeholder='Search for friends' onChange={(e) => setSearchQuery(e.target.value)}></input>
            </div>
            <div className="explore-elements-container">
                {
                    searchResult.map((res, index) => {
                        return <ExploredUser key={index} data={res}></ExploredUser>
                    })
                }
                {
                    searchResult.map((res, index) => {
                        return <ExploredUser key={index} data={res}></ExploredUser>
                    })
                }
                {
                    searchResult.map((res, index) => {
                        return <ExploredUser key={index} data={res}></ExploredUser>
                    })
                }
                {
                    searchResult.map((res, index) => {
                        return <ExploredUser key={index} data={res}></ExploredUser>
                    })
                }
                {
                    searchResult.map((res, index) => {
                        return <ExploredUser key={index} data={res}></ExploredUser>
                    })
                }
            </div>
        </div>
    )
}

export default Explore
