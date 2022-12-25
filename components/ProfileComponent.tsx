import makeBlockie from 'ethereum-blockies-base64';
import { useState } from 'react';

export default function ProfileComponent(address) {
    
    //make a custom avatar based on the wallet address
    const [src, setSrc] = useState(makeBlockie(address.toString()));

    //method to shorten the address to 0x0b1c...50dc
    function shortenAddress(address) {
        address = address.address.toString();
        return address.substring(0, 6) + "..." + address.substring(address.length - 4);
    }
    
    return(
        <div className = "bg-darkbg py-2 px-5 rounded-sm flex justify-between items-center">
            <img src = {src} width = "30" height = "30" className = "rounded-full"/>
            <h2 className = "ml-3 font-sans font-bold text-xl text-white">
                {shortenAddress(address)}
            </h2>
            
        </div>
    )
}