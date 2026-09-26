import { NavLink } from "react-router-dom"


interface GameProps {
    img: string
    color: string
    name: string
    desc: string
    secColor: string
    link: string
}


export default function Game({ img, color, name, desc, secColor, link }: GameProps) {
    return (
    <div className={`h-67 w-full p-4 rounded-4xl relative shrink-0 overflow-hidden flex justify-center border`} style={{ borderColor: `${color}26` }}>
        <img 
            src={img} 
            className="absolute inset-0 w-full h-full object-cover object-left rounded-4xl -z-10" 
            alt="Background"
        />
        <div 
            className="w-full h-full backdrop-blur-lg rounded-4xl border p-5 flex flex-col" 
            style={{ 
                background: "rgba(17,30,40, 0.4)",
                borderColor: `${color}26` 
            }}
        >
            <span className="text-4xl text-white font-bold uppercase italic tracking-tight">{name}</span>
            <span className="text-md text-[#95979f] font-medium py-4">{desc}</span>

            <NavLink 
                className="w-full h-12 rounded-full text-lg uppercase tracking-widest font-bold active:scale-95 duration-150 ease-in-out flex justify-center items-center" 
                style={{ 
                    background: color, 
                    color: secColor,
                    boxShadow: `0 4px 20px ${color}66`
                }}
                to={`/${link}`}
            >
                Play now
            </NavLink>
        </div>
    </div>
    )
}

