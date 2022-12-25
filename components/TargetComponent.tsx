import { useEffect } from "react";

export default function TargetComponent(props) {

    //calculate percentage of users who have completed the task
    function calculatePercentage(){
        const percentage = (props.number/props.maxNumber) * 100;
        return percentage;
    }

    //function to animate the progress bar
    function animateProgressBar(){
        let progress = 0;
        let invervalSpeed = 10;
        let incrementSpeed = 0.5;
        let bar = document.getElementById(props.id);
        
        let progressInterval = setInterval(function(){
          progress += incrementSpeed;
          bar.style.width = progress + "%";


          if(props.maxNumber === 0){
              clearInterval(progressInterval);
          }
    
          if(progress >= calculatePercentage()){
              clearInterval(progressInterval);
          }
    
        }, invervalSpeed);
    }

    useEffect(() => {
        animateProgressBar();
    }, [animateProgressBar])
     

    return(
        <div className = "flex flex-col justify-center hover:border-white transform duration-300 hover:scale-105 bg-gray-8 border-4 border-gray-border px-10 py-6 rounded font-bold text-7xl text-blue-1 titan-text rounded sm:col-span-2 sm:row-span-2">

            <img src="/party.svg" className = 'w-48' alt="" />
            
            <p className = "text-white font-mono font-bold font-medium text-3xl mt-14">
                {props.maxNumber}  people need to participate to complete the quest!
            </p>

            <div className = "flex justify-between items-end width-full text-white font-serif font-bold font-medium text-2xl mt-16">
                <p>
                    {props.number}
                </p>

                <p className = "text-yellow text-white font-serif font-bold font-medium text-4xl">
                    {props.maxNumber} 
                 </p>

            </div>

            <div className="progress w-full rounded mt-5 border-4 border-gray-border">
                <span className="progress-bar" id = {props.id}></span>
            </div>
        </div>
    )
}