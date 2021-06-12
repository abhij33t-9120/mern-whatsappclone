import { Avatar, IconButton } from '@material-ui/core'
import { AttachFile, InsertEmoticon, Mic, MoreVert, SearchOutlined } from '@material-ui/icons'
import React, { useState } from 'react'
import './Chat.css'
import axios from './axios'

function Chat({messages}) {
const [input,setInput]=useState("")
const sendMessage =async (e) =>{
    e.preventDefault()
    await axios.post('/messages/new',{
        message:input,
        name: "Abhijeet",
        timestamp:"Not Implemented",
        received:false,
    })
    setInput("")
}


    return (
        <div className="chat">
            <div className="chat_header">
                <Avatar/>
                <div className="chat_headerInfo">
                    <h3>Room name</h3>
                    <p>Last seen at...</p>
                </div>

                 <div className="chat_headerRight">
                <IconButton><SearchOutlined /></IconButton>
                    <IconButton><AttachFile/></IconButton>
                    <IconButton><MoreVert /></IconButton>
                </div> 
                </div>
                <div className="chat_body">
                    {messages.map((message) => {
                        return(
                        <p className={`chat_message ${message.received && 'chat_receiver'}`}>
                        <span className='chat_name'>{message.name}</span>
                        {message.message}
                        <span className='chat_timestamp'>{message.timestamp}</span>
                        </p>)
                    })}
                </div>
                <div className="chat_footer">
                <IconButton><InsertEmoticon/></IconButton>
                    <form>
                        <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder='Type a message'/>
                        <button onClick={sendMessage} type="submit">Send a message</button>
                    </form>
                    <IconButton><Mic/></IconButton>
                </div>
        </div>
    )
}

export default Chat
