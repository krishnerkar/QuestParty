export default function RewardsComponent(){
    return(
        <div className = "p-6 flex flex-col justify-center hover:border-white transform duration-300 hover:scale-105 bg-gray-8 border-4 border-gray-border rounded font-bold text-4xl font-serif text-purple">
            REWARDS

            <p className = "text-white font-mono font-bold font-medium text-2xl mt-6">
                Everyone gets
            </p>

           <img src="/nft.svg" className = "w-16 mt-2 h-10" alt="" />

            <p className = "text-white font-mono font-bold font-medium text-2xl mt-4">
                10 people get
            </p>

            <img src="/usdc.png" className = "w-28 mt-3" alt="" />
    
            </div>
    )
}