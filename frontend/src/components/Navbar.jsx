import { NavLink } from 'react-router-dom';

import home from '../assets/home.svg'
import friends from '../assets/friends.svg'
import earn from '../assets/earn.svg'
import play from '../assets/play.svg'
import profile from '../assets/profile.svg'
import active_earn from '../assets/active_earn.svg'
import active_friends from '../assets/active_friends.svg'
import active_home from '../assets/active_home.svg'
import active_play from '../assets/active_play.svg'
import active_profile from '../assets/active_profile.svg'

import colors from "../utility/colors.js"

const images = {
    "Home": home,
    "Play": play,
    "Friends": friends,
    "Earn": earn,
    "Profile": profile,
    "active_Earn": active_earn,
    "active_Friends": active_friends,
    "active_Home": active_home,
    "active_Play": active_play,
    "active_Profile": active_profile
}

function NavbarButton({ text }) {
    return (
        <NavLink 
        to={`/${text === "Home" ? "" : text.toLowerCase()}`} 
        className={({ isActive }) => `flex flex-col w-17 h-17 justify-center items-center rounded-full duration-150 ease-in-out active:scale-95 transition-transform ${isActive ? 'bg-gradient-purple drop-shadow-[0_0_10px_rgba(126,81,255,0.4)]' : ''}`}>
            {({ isActive }) => (
                <>
                    <img className='h-8 w-8' src={images[isActive ? "active_" + text : text]} alt={text} />
                    <span className='font-bold' style={{ color: isActive ? "#ffffff" : colors.textGray, fontSize: 'clamp(0.8rem, 1.8vw, 0.8rem)' }}>{text}</span>
                </>
            )}
        </NavLink>
    )
}

export default function Navbar() {
    return (
        <nav className='fixed bottom-0 left-0 w-full p-3 z-50'>
            <div className="flex justify-evenly items-center p-1 rounded-2xl shadow-2xl font-jakarta drop-shadow-[0_0_55px_rgba(126,81,255,0.1)]" style={{ height: "10vh", background: colors.navbar }}>
                <NavbarButton text="Home" />
                <NavbarButton text="Play" />
                <NavbarButton text="Friends" />
                <NavbarButton text="Earn" />
                <NavbarButton text="Profile" />
            </div>
        </nav>
    )
}