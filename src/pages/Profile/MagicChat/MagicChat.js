import React from 'react'
import SidebarCom from '../../../components/Sidebar/Sidebar'
import ChatWindow from '../../../components/ChatWindow/ChatWindow'
import './magicChat.css'

const MagicChat = () => {
  return (
    <div className='magic-chat-container
    '><SidebarCom />
    <div className='content'>
    <ChatWindow />
    </div></div>
  )
}

export default MagicChat