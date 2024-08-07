import { React, useEffect, useState } from 'react'
import Chat from '../Chat/Chat'
import { useAuth } from '../../context/authContext';
import Friend from '../Friend/Friend'
import api from '../../api/api.jsx'
import { useGlobalState } from '../../context/GlobalStateContext.jsx'
import LoadingDots from '../../components/LoadingDots/LoadingDots'
import { BiAddToQueue } from "react-icons/bi";
import { IoMdArrowBack } from "react-icons/io";
import { chatRoute } from '../../routes/routes.js'
import { friendsRoute } from '../../routes/routes.js'
import moment from 'moment';

import './Chats.css'
const Chats = () => {
    // console.log("------------> Chats");
    const { chats, setChats } = useGlobalState();
    const [isLoading, setIsLoading] = useState(true)
    const [dataDiaplayed, setDataDisplayed] = useState('chats')
    const [friends, setFriends] = useState([]);
    const { clearUserData } = useAuth();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await api.get(chatRoute.list);

                const chatsRecord = response.data.data;

                const existedChats = chatsRecord.map((chat) => {

                    const dateFormat = (moment(chat.lastMessage.sentAt).isAfter(moment().subtract(1, 'days'))) ? 'LT' : 'L'
                    return {
                        chatId: chat._id,
                        receiverId: chat.participants[0]._id,
                        displayedName: chat.participants[0].displayedName,
                        profilePicture: chat.participants[0].profilePicture,
                        lastMessage: chat.lastMessage.body,
                        lastMessageDate: moment(chat.lastMessage.sentAt).format(dateFormat)
                    }
                })

                setChats(existedChats);
                setIsLoading(false)

            } catch (error) {
                if ((error.response.data.error) && (error.response.data.error.cause === 'authorization')) {
                    clearUserData();
                }
            }
        }
        fetchChats();
    }, [])

    useEffect(() => {
        if (dataDiaplayed === 'friends') {
            const fetchFriends = async () => {
                try {
                    const response = await api.get(friendsRoute.list);

                    const friendsRecord = response.data.data;

                    const friends = friendsRecord.map((friend) => {
                        return {
                            chatId: friend._id,
                            receiverId: friend._id,
                            displayedName: friend.displayedName,
                            profilePicture: friend.profilePicture,
                        }
                    })

                    setFriends(friends);
                    setIsLoading(false)
                } catch (error) {
                    if ((error.response.data.error) && (error.response.data.error.cause === 'authorization')) {
                        clearUserData();
                    }
                }
            }
            fetchFriends();
        }
    }, [dataDiaplayed])

    return (
        <div className='chats-friends-container'>
            {
                (dataDiaplayed === 'chats') ?
                    <>
                        <div className='chats-header'>
                            <h1 >Chats</h1>
                            <BiAddToQueue className='new-chat-icon icon' onClick={() => { setDataDisplayed('friends'); setIsLoading(true) }} />
                        </div>
                        <div className="search-bar">
                            <input type='text' placeholder='Search for chats' onChange={(e) => setSearchQuery(e.target.value)}></input>
                        </div>
                        <div className="chats container">
                            {
                                (!isLoading) ?
                                    chats.map((chat, index) => <Chat key={index} chat={chat}></Chat>)
                                    : <LoadingDots style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} ></LoadingDots>
                            }
                        </div>
                    </>
                    : <>
                        <div className='friends-header'>
                            <IoMdArrowBack className='new-chat-icon icon' onClick={() => setDataDisplayed('chats')} />
                            <h2 >New chat</h2>
                        </div>
                        <div className="search-bar">
                            <input type='text' placeholder='Search for friends' onChange={(e) => setSearchQuery(e.target.value)}></input>
                        </div>
                        <div className="friends container">
                            {
                                (!isLoading) ?
                                    friends.map((friend, index) => <Friend key={index} friend={friend}></Friend>)
                                    : <LoadingDots style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></LoadingDots>
                            }
                        </div>
                    </>
            }
        </div>
    )
}

export default Chats
