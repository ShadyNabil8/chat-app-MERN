import { useEffect } from "react";
import { useSocket } from '../context/SocketContext';

const useSocketEvent = (event, handler) => {
    const { socket } = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on(event, handler);
        }
        return () => {
            if (socket) {
                socket.off(event, handler)
            }
        };
    }, [socket, event, handler])

}

export default useSocketEvent;