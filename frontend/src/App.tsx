import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { useEffect, useRef } from 'react';
import { useGame } from './context/GameContext';
import { useEnergyRecovery } from './hooks/useEnergyRecovery';
import { usePassiveIncome } from './hooks/usePassiveIncome';
import { usePIDialog } from './hooks/usePIDialog';

import { fetchToState } from './api/dataFetcher';
import { gameApi } from './api/endpoints';
import { WSManager } from './api/websocket';

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
import LoadingScreen from './components/LoadingScreen';
import PIDialogContent from './components/PIDialogContent';

import { Toaster } from 'react-hot-toast';


function App() {
  const { setUser, user } = useGame()
  const { dialogRef, passiveIncomeData } = usePIDialog()

  useEffect(() => {
    fetchToState(gameApi.getUser, setUser)
  }, [])

  useEffect(() => {
    WSManager.connect()

    return WSManager.disconnect
  }, [])


  useEnergyRecovery(setUser, user)
  usePassiveIncome(setUser)

  return (
    <Router>
      {user ? (
        <div className="app-container h-screen">
          <div className="content h-full min-h-screen pb-[11vh]">
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

    <dialog ref={dialogRef} className="m-auto backdrop:bg-black/50 rounded-2xl outline-0 w-[40vh] p-6 bg-[#14181e] shadow-2xl">
      <PIDialogContent dialogRef={dialogRef} passiveIncomeData={passiveIncomeData} />
    </dialog>

    <Toaster position="top-center" reverseOrder={false} />
    </Router>
  )
}

export default App