interface StakeButtonProps {
    onClick: () => void
    label: string
}

export default function StakeButton({ onClick, label }: StakeButtonProps) {
    return (
        <button className="bg-[#1c2028] w-23 h-10 rounded-3xl m-2 text-white tracking-wider font-medium active:scale-95 duration-150" onClick={onClick}>
            {label}
        </button>
    )
}