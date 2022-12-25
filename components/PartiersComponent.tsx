export default function PartiersComponent(props){
    console.log(props.winners)

    return(
        <div>
            <div className = "p-14 mt-14 text-blue-1 font-serif sm:text-2xl md:text-5xl flex flex-col justify-center hover:border-white transform duration-300 hover:scale-105 bg-gray-8 border-4 border-gray-border rounded font-bold text-3xl">
                PARTIERS
                
                <p className = "text-white font-mono font-bold font-medium text-xl mt-6">
                    {
                        props.winners.map((winner, index) => {
                            return(
                            <div key = {winner} className = "flex mt-5">
                                <span className = "text-gray-9">
                                    {index+1}.
                                </span>

                                <span className = "ml-4 text-white">
                                    {winner}
                                </span>
                            </div>
                            )
                        })
                    }
                    
                </p>

            </div>
        </div>
    )
}