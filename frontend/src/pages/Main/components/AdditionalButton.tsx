import { NavLink } from 'react-router-dom';

import colors from "../../../utils/colors"

type AdditionalButtonProps = { img: string, text: string }

export default function AdditionalButton({ img, text }: AdditionalButtonProps) {
    return (
        <NavLink to={`/${text.toLowerCase()}`} className="w-1/2 h-fit rounded-4xl p-3" style={{ background: colors.cardGray }}>
            <div className="flex flex-col items-center">
                <img src={img} alt="img" className="w-1/6"/>
                <span className="text-xs font-jakarta font-medium m-1" style={{ color: "#e1dff2" }}>{text}</span>
            </div>
        </NavLink>
    )
}