import CoinsDisplay from './components/CoinsDisplay'
import MainButton from './components/MainButton'
import OverNavbar from './components/OverNavbar'


export default function Main() {
    return (
        <div className="flex flex-col overflow-hidden w-full h-full p-5">
            <CoinsDisplay />

            <div className='flex-1 flex items-center justify-center overflow-y-visible flex-col '>
            <MainButton />
            </div>

            <OverNavbar />
        </div>
    )
}