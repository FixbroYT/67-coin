import { icons } from "lucide-react"

interface DynamicIconProps {
    name: string
    color?: string
    size?: number
}

export default function DynamicIcon({ name, color, size }: DynamicIconProps) {
    if (name in icons) {
        const IconComponent = icons[name as keyof typeof icons]
        return <IconComponent color={color} size={size}/>
    }
    
    return <icons.Loader color={color} size={size} />
}