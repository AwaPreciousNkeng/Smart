import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#f0f4f8', fontFamily:'Inter,sans-serif' }}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main style={{ flex:1, overflowY:'auto', padding:'22px 24px', background:'#f0f4f8' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
