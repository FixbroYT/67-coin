import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { useGame } from './context/GameContext';
import { useEnergyRecovery } from './hooks/useEnergyRecovery';

import { gameApi } from './api/endpoints';

import Main from './pages/Main/Main';
import Play from './pages/Play/Play';
import Friends from './pages/Friends/Friends';
import Earn from './pages/Earn/Earn';
import Profile from './pages/Profile/Profile';
import Upgrades from './pages/Upgrades/Upgrades';
import Locations from './pages/Locations/Locations';
import Slots from './pages/Slots/Slots';
import CommunityPool from './pages/CommunityPool/CommunityPool';

import Navbar from './components/Navbar'
import { useTelegram } from './hooks/useTelegram';
import LoadingScreen from './components/LoadingScreen';
import { styledToast } from './components/styledToast';


function App() {
  const { setUser, user } = useGame()
  const WebApp = useTelegram()

  useEffect(() => {
    const MAX_RETRIES = 5
    let retryCount = 0
    let timerId: number

    const fetchData = async () => {
      try {
        const response = await gameApi.getUser()
        
        if (!response.success) {
          throw new Error("Error with user data fetch.")
        }
        
        const userData = response.data
        
        setUser({ ...userData, lvl: Math.floor(userData.xp / 1000) })
        
        if (timerId) clearTimeout(timerId)
        return
      
      } catch (error) {
        console.error("Fetch error: ", error)
        
        if (retryCount < MAX_RETRIES) {
          retryCount++
          console.log(`Retry #${retryCount} in 5 seconds...`)
          timerId = setTimeout(fetchData, 5000)
        } else {
          console.error(`Failed to load data after ${MAX_RETRIES} retries.`)
          styledToast("error", "Something went wrong. Please try again later.")
        }
      }
    }

    fetchData()
    
    return () => {
      if (timerId) clearTimeout(timerId)
    }
  }, [WebApp, setUser])

  useEnergyRecovery(setUser, user)

  return (
    <Router>
      {user ? (
        <div className="app-container" style={{ height: '100vh' }}>
          <div className="content h-full min-h-screen pb-20">
            <Routes>
              <Route path="/" element={<Main />} />
              {/* <Route path="/play" element={<Play />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/earn" element={<Earn />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/upgrades" element={<Upgrades />} />
              <Route path="/locations" element={<Locations />} /> 
              <Route path="/slots" element={<Slots />}/>
              <Route path="/community-pool" element={<CommunityPool />}/> */}
            </Routes>
          </div>

          <Navbar />
        </div>
      ) : (
        <LoadingScreen />
      )}
    </Router>
  )
}

export default App
