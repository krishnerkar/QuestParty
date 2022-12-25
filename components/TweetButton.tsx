export default function TweetButton(props){

    //function to share the tweet with the task
    function handleClick(){
        
        const url = "https://twitter.com/intent/tweet?url=https%3A%2F%2Fquestparty.xyz&text=tweeting%20gm%20wagmi%20for"
        // const url = "https://twitter.com/intent/tweet?text=gm%20wagmi"

        window.open(url, '_blank').focus();
    }

    return(
        <button onClick = {handleClick} className = "flex justify-center items-center text-border-blue font-serif hover:bg-blue-tweetDark text-white font-bold rounded p-1 py-4 w-full bg-blue-tweet">
            <img src="/Tweet it.png" className = "w-40" />
        </button>
    )
}