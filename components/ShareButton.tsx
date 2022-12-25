export default function ShareButton(props){

    //opens the link to share on twitter
    function handleClick(){
        const url = "https://twitter.com/intent/tweet?text=Join%20the%20QuestParty%2C%20we%20need%20" + (props.number).toString() + "%20more%20gm%20wagmi%E2%80%99s%20%F0%9F%8E%89%F0%9F%91%87&url=https%3A%2F%2Fquestparty.xyz"
        window.open(url, '_blank').focus();
    }

    return(
        <button onClick = {handleClick} className = "text-2xl sm:h-24 transform duration-300 hover:scale-105 w-full h-full mt-4 rounded-md bg-white text-black font-bold font-sans">
            SHARE
        </button>
    )
}