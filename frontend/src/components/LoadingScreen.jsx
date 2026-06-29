import { LoaderCircle } from 'lucide-react';

export default function LoadingScreen() {
    return (
        <div className='flex justify-center items-center flex-col' style={{ height: "100vh" }}>
            <LoaderCircle color='#fff' className='animate-rotate drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' style={{ width: "40vw", height: "40vw" }}/>
            <span className='text-2xl text-white font-semibold font-jakarta mt-3'>Loading...</span>
        </div>
    )
}