import React from 'react'
import './profile.css'
// import NavbarComp from '../../components/Navbar/Navbar'
import SidebarCom from '../../components/Sidebar/Sidebar'
const Profile = () => {
  return (
    <div className="profilePage">
        {/* <NavbarComp/> */}
        <SidebarCom />
        <div className='content'>
           Welcome To World of AI
        </div>
    </div>
  )
}

export default Profile