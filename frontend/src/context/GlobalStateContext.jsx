import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '../api/api.jsx'
import { chatRoute } from '../routes/routes.js'
import { friendsRoute } from '../routes/routes.js'
import moment from 'moment';

const globalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    const [selectedChatData, setSelectedChatData] = useState({
        chatType: '',
        chatId: '',
        image: '',
        name: '',
        receiverId: ''
    });
    const [selectedNav, setSelectedNav] = useState('explore')
    const [chats, setChats] = useState([]);


    const fetchChats = async () => {
        try {

            const [chatsResponse, friendsResponse] = await Promise.all([
                api.get(chatRoute.list),
                api.get(friendsRoute.list)
            ])
            const friendsRecord = friendsResponse.data.data;
            const chatsRecord = chatsResponse.data.data;
            console.log(chatsRecord);

            const friendsChats = friendsRecord.map((friend) => {
                return {
                    chatType: 'new-chat',
                    chatId: friend._id,
                    receiverId: friend._id,
                    displayedName: friend.displayedName,
                    profilePicture: friend.profilePicture,
                }
            })

            const existedChats = chatsRecord.map((chat) => {
                const dateFormat = (moment(chat.lastMessage.sentAt).isAfter(moment().subtract(1, 'days'))) ? 'LT' : 'L'
                return {
                    chatType: 'existed-chat',
                    chatId: chat._id,
                    receiverId: chat.participants[0]._id,
                    displayedName: chat.participants[0].displayedName,
                    profilePicture: chat.participants[0].profilePicture,
                    lastMessage: chat.lastMessage.body,
                    lastMessageDate: moment(chat.lastMessage.sentAt).format(dateFormat)
                }
            })

            setChats((prev) => {
                return [
                    ...friendsChats,
                    ...existedChats
                ]
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <globalStateContext.Provider value=
            {{
                selectedChatData,
                setSelectedChatData,
                selectedNav,
                setSelectedNav,
                chats,
                setChats,
                fetchChats
            }}>
            {children}
        </globalStateContext.Provider>
    )
}

export const useGlobalState = () => useContext(globalStateContext)



