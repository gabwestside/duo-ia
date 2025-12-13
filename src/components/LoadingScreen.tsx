import DevlingoChar from '@/assets/images/devlingo-loader.png'

interface LoadingScreenProps {
    isFadingOut?: boolean
}

const LoadingScreen = ({isFadingOut}: LoadingScreenProps) => {
    return (
        <div className={`fixed inset-0 bg-[#7a0dbf] flex flex-col items-center justify-center ${isFadingOut ? 'animate-fadeOut' : ''}`}>
            <div>
                <img src={DevlingoChar} alt="Devlingo loader" 
                className='w-36 h-36 object-contain animate-float'/>
            </div>

            <h1 className='text-white text-5xl font-bold mt-12 tracking-wider'>Devlingo</h1>
        </div>
    )
}

export default LoadingScreen