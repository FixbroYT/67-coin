import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { useEffect, useState } from 'react'
import { useGame } from './context/GameContext'
import { getData } from './api/requests';
import { usePassiveIncome, useEnergyRecovery } from './hooks/usePassiveIncome';

import Main from './pages/Main';
import Play from './pages/Play';
import Friends from './pages/Friends';
import Earn from './pages/Earn';
import Profile from './pages/Profile';
import Upgrades from './pages/Upgrades';
import Locations from './pages/Locations';
import Slots from './pages/Slots';
import CommunityPool from './pages/CommunityPool';

import Navbar from './components/Navbar'
import { useTelegram } from './hooks/useTelegram';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const { setUser, setUpgrades, setLocations, setQuests, setLeadmagnets, user } = useGame()
  const WebApp = useTelegram()

  useEffect(() => {
    const tgUser = WebApp?.initDataUnsafe?.user
    if (!tgUser) return

    let retryCount = 0
    const MAX_RETRIES = 5
    let timerId = null

    const fetchData = async () => {
      try {
        const [userData, upgrades, locations, quests, leadmagnets] = await Promise.all([
          getData(`users/${tgUser.id}`),
          getData("upgrades/get-all"),
          getData("locations/get-all"),
          getData("quests/get-all"),
          getData("leadmagnets/get-all")
        ]);

        if (userData && upgrades && locations && quests) {
          setUser({ ...userData, tg_id: tgUser.id, lvl: Math.floor(userData.xp / 1000) })
          setUpgrades(upgrades)
          setLocations(locations)
          setQuests(quests)
          setLeadmagnets(leadmagnets)
          
          if (timerId) clearTimeout(timerId)
          return
        }
      } catch (error) {
        console.error("Fetch error: ", error)
        
        if (retryCount < MAX_RETRIES) {
          retryCount++
          console.log(`Retry #${retryCount} in 5 seconds...`)
          timerId = setTimeout(fetchData, 5000)
        } else {
          console.error(`Failed to load data after ${MAX_RETRIES} retries.`)
        }
      }
    }

    fetchData()
    
    return () => {
      if (timerId) clearTimeout(timerId)
    }
  }, [WebApp, setUser, setUpgrades, setLocations, setQuests])



  usePassiveIncome(user?.passive_income, setUser)
  useEnergyRecovery(setUser, user?.max_energy)

  return (
    <Router>
      {user ? (
        <div className="app-container" style={{ height: '100vh' }}>
          <div className="content h-full min-h-screen pb-20">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/play" element={<Play />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/earn" element={<Earn />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/upgrades" element={<Upgrades />} />
              <Route path="/locations" element={<Locations />} /> 
              <Route path="/slots" element={<Slots />}/>
              <Route path="/community-pool" element={<CommunityPool />}/>
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
