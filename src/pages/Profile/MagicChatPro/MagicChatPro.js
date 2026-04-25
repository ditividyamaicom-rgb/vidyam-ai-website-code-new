import React from 'react'
import SidebarCom from '../../../components/Sidebar/Sidebar'
import './magicChatPro.css'
import ChatWindow from '../../../components/ChatWindow/ChatWindow'

const MagicChatPro = () => {
  return (
    <div className='magic-chat-pro-container'><SidebarCom />
    <div className='content'>
       <ChatWindow />
    </div></div>
  )
}

export default MagicChatPro