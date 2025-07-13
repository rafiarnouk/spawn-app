import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Admin from './pages/Admin.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import ActivityInvite from './pages/ActivityInvite.jsx'
import ProfileInvite from './pages/ProfileInvite.jsx'
import GuestSignIn from './pages/GuestSignIn.jsx'
import Login from './pages/Login.jsx'
import Onboarding from './pages/Onboarding.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Analytics/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          } 
        />
        {/* Legacy UUID-based routes */}
        <Route path="/activity/:activityId" element={<ActivityInvite />} />
        <Route path="/activity/:activityId/sign-in" element={<GuestSignIn />} />
        <Route path="/profile/:profileId" element={<ProfileInvite />} />
        
        {/* New share code routes */}
        <Route path="/a/:shareCode" element={<ActivityInvite />} />
        <Route path="/a/:shareCode/sign-in" element={<GuestSignIn />} />
        <Route path="/p/:shareCode" element={<ProfileInvite />} />
        
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/activity/:activityId/onboarding" element={<Onboarding />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
