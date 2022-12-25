import { useEffect, useState } from "react";
import ProfileComponent from "./ProfileComponent";

export default function WalletButton (props){

    //state variables
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    let isCorrectNetwork = props.isCorrectNetwork

    let correctNetwork = "0x89"
    // let correctNetwork = "0x13881"

    useEffect(() => {

      //if a wallet is not installed
      //@ts-ignore
      if(!window.ethereum) {
        return
      }
      
      console.log("useeffect called")

      //check if the user is on the correct network
      validateChain()
      props.setAccount(null)

      setAccount(null)
      
      //check if the user's wallet is connected
      isWalletConnected()

      //handle the event when the user switches their account
      //@ts-ignore
      window.ethereum.on('accountsChanged', (accounts) => {
        props.setAccount(accounts[0])
        setAccount(accounts[0])
        props.reload()
      });

      //handle the event when the user changes their network
      //@ts-ignore
      window.ethereum.on('chainChanged', (chainId) => {
        validateChain()
      });

    }, [])

    //check if the user is on the correct network
    async function validateChain() {
      
        console.log("validating chain")
        props.handleNetworkSwitch()

    }

    //check if the user's wallet is connected
    async function isWalletConnected(){

      //gets the ethereum object injected by the wallet
      //@ts-ignore
      const {ethereum} = window;

      //request the user's accounts
      const accounts = await ethereum.request({method: 'eth_accounts'});

      /* 
        if the user has the wallet connected an array of accounts is returned 
        out of which we select the first one and if its not connected, we 
        receive an empty array
      */
      try{
        const account = accounts[0];
        if(account){
        props.setAccount(account)
          setAccount(account)
          setIsConnected(true)
        }else{
        props.setAccount(null)
          setAccount(null)
          setIsConnected(false)
        }
      }
      catch(err){
        const account = null;
        setIsConnected(false);
      }

      return account;
    }

    async function connectWallet() {

      //prompts to switch the network if on the wrong network
      switchNetwork()

      //prompts the user to connect their wallet
      try{
        //@ts-ignore
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts" 
        });

        //set the account to the first account in the array
        props.setAccount(accounts[0])

        setAccount(accounts[0]);
        setIsConnected(true);
        props.reload()
      }
      catch(err){
          console.log(err)
      }
    }

    //function to prompt the user to switch the network
    async function switchNetwork(){
      try{
        //@ts-ignore
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: correctNetwork }], 
        });

        await props.reload()
      }
      catch(err){
        console.log(err)
        if (err.code === 4902) {
          addNetwork()
        }
      }
    }
    
    //prompts user to add the network to their wallet if they havent added it yet 
    // async function addNetwork() {
    //   try{
    //     //@ts-ignore
    //     await window.ethereum.request({
    //       method: 'wallet_addEthereumChain',
    //       params: [
    //         {
    //           nativeCurrency: {
    //             name: 'Matic',
    //             symbol: 'MATIC', 
    //             decimals: 18,
    //           },
    //           chainName: 'Mumbai Testnet',
    //           chainId: correctNetwork,
    //           rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    //           blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com/'],
    //         },
    //       ],
    //     });
    //   }
    //   catch(err){
    //     console.log(err)
    //   }
    // }

    //prompts user to add the network to their wallet if they havent added it yet 
    async function addNetwork() {
      try{
        //@ts-ignore
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              nativeCurrency: {
                name: 'Matic',
                symbol: 'MATIC', 
                decimals: 18,
              },
              chainName: 'Polygon Mainnet (Matic)',
              chainId: correctNetwork,
              rpcUrls: ['https://polygon-rpc.com'],
              blockExplorerUrls: ['https://polygonscan.com'],
            },
          ],
        });
      }
      catch(err){
        console.log(err)
      }
    }

    return (
      <>
      <div className = "lg:flex">
        {
          !isConnected ?
            <button onClick = {connectWallet} className = "hover:scale-110 transform duration-300 ml-8 bg-gradient-to-r from-gradient-lightblue via-gradient-darkblue via-gradient-purple to-gradient-red text-xl text-white p-3 rounded-sm font-sans font-bold">
                Connect Wallet
            </button>
          : <ProfileComponent address = {account}/>
        }

        {
          !isCorrectNetwork ?
            <button onClick = {switchNetwork} className = "animated-border mt-3 hover:scale-110 transform duration-300 sm:ml-8 bg-yellow text-xl py-2 px-5 rounded-lg font-sans font-bold">
                Switch Network
            </button>
          : null
        }
        </div>
      </>
    )
}






