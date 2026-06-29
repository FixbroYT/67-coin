import CoinsDisplay from '../components/main/CoinsDisplay'
import MainButton from '../components/main/MainButton'
import OverNavbar from '../components/main/OverNavbar'


export default function Main() {
    return (
        <div className="flex flex-col overflow-hidden w-full h-full">
            <CoinsDisplay />

            <div className='flex-1 flex items-center justify-center overflow-y-visible flex-col '>
            <MainButton />
            </div>

            <OverNavbar />
        </div>
    )
}