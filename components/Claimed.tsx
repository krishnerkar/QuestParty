
export default function Claimed(props){

    return(
        <div className = "h-full mb-4 p-1 rounded bg-gradient-to-r from-gradient-lightblue via-gradient-darkblue via-gradient-purple to-gradient-red transform duration-300 hover:scale-105">

        <div className = "absoulute sm:h-full h-72 flex flex-col justify-center p-2 sm:text-2xl md:text-6xl flex flex-col justify-center bg-gray-8 py-6 rounded">
            
            <span className = "text-blue-tweet text-center font-serif text-3xl">
                YOU ARE
            </span>
            <span className = "text-white text-center font-serif mt-2 text-4xl">
                {props.tweetText}
            </span>
            <span className = " text-center font-serif mt-2 text-7xl text-transparent bg-clip-text bg-gradient-to-r from-gradient-lightblue via-gradient-darkblue via-gradient-purple to-gradient-red">
                {props.claimerNumber}
            </span>

        </div>
        </div>

    )
}