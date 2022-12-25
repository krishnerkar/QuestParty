import { useEffect, useState } from "react";

export default function TaskComponent(props){
    console.log(props);

    const [isProps, setIsProps] = useState(false);

    useEffect(() => {
        if(props.text == "")
            setIsProps(false)
        else
            setIsProps(true)
    } , [props]);

    

    return(
        <>
        {
            isProps ?
            <div className = "p-6 flex flex-col justify-center hover:border-white transform duration-300 hover:scale-105 bg-gray-8 border-4 border-gray-border rounded font-bold text-4xl font-serif text-red">
                QUEST
                
                <p className = "text-white font-mono font-bold font-medium text-2xl mt-6">
                    Tweet "{props.text}"
                </p>

                <h6 className = "flex text-gray-5 text-sm font-light font-sans mt-4">
                    You need atleast 25 followers for the tweet to be counted!
                </h6>
            </div>
            :
            <div className = "p-6 flex flex-col justify-center hover:border-white transform duration-300 hover:scale-105 bg-gray-8 border-4 border-gray-border rounded font-bold text-4xl font-serif text-red">

                QUEST
                
                <p className = "text-white font-mono font-bold font-medium text-5xl mt-6">
                    ????
                </p>

                <h6 className = "flex text-gray-5 text-sm font-light font-sans mt-4">
                Connect your wallet to view the quest
                </h6>
            </div>

        }

        </>
        
    )
}