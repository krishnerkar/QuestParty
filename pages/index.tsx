import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import RewardsComponent from '../components/RewardsComponent';
import ShareButton from '../components/ShareButton';
import TargetComponent from '../components/TargetComponent';
import TaskComponent from '../components/TaskComponent';
import TweetButton from '../components/TweetButton';
import VerificationComponent from '../components/VerificationComponent';
import abi from '../abi.json'
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Script from 'next/script'
import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import Claimed from '../components/Claimed';
import PartiersComponent from '../components/PartiersComponent';
import { SpinnerCircularFixed } from 'spinners-react';

export default function Home() {

  const questID = 3
  const contractAddress = "0xe76Bf7822cC9086835E4cB51E4b515df61679a06";
  // const contractAddress = "0x8697895198D68Da999D3DE4EBe0919Fd4e7f28dA";

  const contractABI = abi

  const [maxClaimerNumber, setMaxClaimerNumber] = useState(0);
  const [totalClaimersNumber, setTotalClaimersNumber] = useState(0);
  const [claimerNumberState, setClaimerNumberState] = useState(0);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);
  const [notfy, setNotfy] = useState();
  const [tweetTextState, setTweetTextState] = useState("");
  const [loading, setLoading] = useState(false);
  const [userAccount, setUserAccount] = useState(null);
  const [winners, setWinners] = useState([]);
  const [, updateState] = useState();

  //@ts-ignore
  const forceUpdate = useCallback(() => updateState({}), []);

  let correctNetwork = "0x89"
  // let correctNetwork = "0x13881"

  async function resetState() {
    setMaxClaimerNumber(0);
    setTotalClaimersNumber(0);
    setClaimerNumberState(0);
    
  }

  async function validateChain() {
    console.log("validateChain called")
    //@ts-ignore
    console.log(window.ethereum)
    //@ts-ignore
    console.log(window.ethereum.chainId)
    //@ts-ignore
    if(window.ethereum.chainId == correctNetwork){
      setIsCorrectNetwork(true)
      console.log("correct network")
    }
    //@ts-ignore
    else if(window.ethereum.chainId == null){
      setIsCorrectNetwork(false)
      //@ts-ignore
    }
    //@ts-ignore
    else if(window.ethereum.chainId !== correctNetwork){
      setIsCorrectNetwork(false)
      console.log("wrong network")

      try{
        //@ts-ignore
        notfy.error("Please click on the switch network button at the top")
      }
      catch(e)
      {
        console.log(e)
      }

    }
  }

  function handleNetworkSwitch() {
    validateChain()
  }

  useEffect(() => {

    //@ts-ignore
    setNotfy(new Notyf({
      duration: 5000,
    }));

    //@ts-ignore
    if(!window.ethereum) {
      alert("Please install MetaMask")
      return
    }

    validateChain();

    if(isCorrectNetwork)
      callContract()

  }, [isCorrectNetwork])

  function setAccount(account) {
    console.log("account set")
    console.log(account)
    setUserAccount(account)
  }


  let maxClaimers //max number of claimers of the quest
  let totalClaimers //total number of claimers of the quest till now
  let claimerNumberInitial //the claimer number of the current user (0 if not claimed)


  async function updateClaimerNumber(claimerNumber, totalClaimers){
    setClaimerNumberState(claimerNumber)
    console.log("updating claimer number")
    setTotalClaimersNumber(totalClaimersNumber + 1)
  }

  function handleOnNewClaimerEvent(by, newClaimer, twitterID, claimerNumber, batchQuestID){
    console.log("new claimer added")

    if(batchQuestID == questID){
        setTotalClaimersNumber(parseInt(claimerNumber))
    }
  }

  function reload_state () {
    forceUpdate()

    //@ts-ignore
    if(window.ethereum.chainId == correctNetwork){
      callContract()
      setIsCorrectNetwork(true)
      console.log("correct network")
    }

    //@ts-ignore
    else if(window.ethereum.chainId == null){
      return
    }

    //@ts-ignore
    else if(window.ethereum.chainId !== correctNetwork){
      setIsCorrectNetwork(false)
      console.log("wrong network")
    }
  }

  //function to call the contract and get the data
  const callContract = async () => {

    setLoading(true)
    forceUpdate()


    try{
      //provider to interact with the blockchain
      //@ts-ignore
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      //signer who signed the transaction
      const signer = provider.getSigner();

      //contract object to interact with the methods of the contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      contract.on("NewClaimerAdded", handleOnNewClaimerEvent)

      //value of the max claimers of the quest
      const maxClaimersResult = await contract.getMaxClaimers(questID);
      console.log(maxClaimersResult)
      setIsCorrectNetwork(true)

      //value of the total claimers of the quest till now
      const totalClaimersResult = await contract.getTotalClaimers(questID);

      //value of the claimer number of the current user
      const claimerNumberResult = await contract.getClaimerNumber(questID, signer.getAddress());

      const rewardedClaimers = await contract.getRewardedClaimers(questID);
      setWinners(rewardedClaimers)

      //value of the tweet text to claim the reward
      let tweetTextResult = await contract.getTweetTextURLSafeBase64(questID);
      tweetTextResult = atob(tweetTextResult);
      console.log(tweetTextResult)

      //parsing BigNumbers to integers
      maxClaimers = maxClaimersResult ? parseInt(maxClaimersResult) : 0;
      totalClaimers = totalClaimersResult ? parseInt(totalClaimersResult) : 0;
      claimerNumberInitial = claimerNumberResult ? parseInt(claimerNumberResult) : 0;

      //setting the state variable
      setMaxClaimerNumber(maxClaimers)
      setTotalClaimersNumber(totalClaimers)
      setClaimerNumberState(claimerNumberInitial)
      setTweetTextState(tweetTextResult)

      setLoading(false)


      console.log(winners.length == 0)
      console.log(winners)
    }

    catch(e){
      console.log(e)
      setLoading(false)
    }

    setLoading(false)

  }


  return (
    <>
      <div className = "relative bg-black flex flex-col pb-10 items-center justify-center">
        <Script type="text/javascript" src = "/static/scripts.js"></Script>
        <Head>
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-PWTLVB9GJE"></script>
          <title>QuestParty</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta name="title" content="QuestParty"/>
          <meta name="description" content=" The on-chain flash mob! Join the party and earn rewards, but only after the party is full. 🥳🎉"/>

          <meta property="og:type" content="website"/>
          <meta property="og:url" content="https://www.questparty.xyz/"/>
          <meta property="og:title" content="QuestParty"/>
          <meta property="og:description" content=" The on-chain flash mob! Join the party and earn rewards, but only after the party is full. 🥳🎉"/>
          <meta property="og:image" content="https://batch-quest-v2.vercel.app/QP-OG.jpg"/>

          <meta property="twitter:card" content="summary_large_image"/>
          <meta property="twitter:url" content="https://metatags.io/"/>
          <meta property="twitter:title" content="QuestParty"/>
          <meta property="twitter:description" content=" The on-chain flash mob! Join the party and earn rewards, but only after the party is full. 🥳🎉"/>
          <meta property="twitter:image" content="https://batch-quest-v2.vercel.app/QP-OG.jpg"></meta>
        </Head>

        <div className = "md:hidden font-sans text-yellow text-xl font-bold p-3 text-center flex flex-col justify-center items-center bg-black h-screen w-screen">
          Join the party on desktop!
        </div>

        <div className = "hidden md:block px-5 sm:px-5 md:px-4 lg:px-6 min-h-screen xl:px-16 py-12 max-w-screen-2xl">
          {
            loading || claimerNumberState == NaN || claimerNumberState == undefined  ?

              <div className="flex items-center h-screen absolute top-0 justify-center">
                  <SpinnerCircularFixed color = "#FDFF4A" secondaryColor = "#141414" thickness = {150} size = {100}/>
              </div>
            
            :
            <>
            <Navbar 
              setAccount = {setAccount} 
              isCorrectNetwork = {isCorrectNetwork} 
              handleNetworkSwitch = {handleNetworkSwitch} 
              reload = {reload_state}
            />
            
            <div className = "sm:mt-14 py-10">

              <div className = "">
                <div className = "grid grid-cols-4 gap-4">

                  <TaskComponent text = {tweetTextState} />
                  <TargetComponent id = "large-sizes" number = {totalClaimersNumber} maxNumber = {maxClaimerNumber}/>

                  {
                    claimerNumberState == 0? 
                      <>
                        {
                          winners.length == 0 && totalClaimersNumber !== maxClaimerNumber  && isCorrectNetwork ?

                            <div className = "rounded row-span-2 flex flex-col">

                              <TweetButton text = {tweetTextState} />
                    
                              <h1 className = "font-serif w-full text-center text-3xl text-white">
                                +
                              </h1>

                              <VerificationComponent 
                                tweet = {tweetTextState}
                                totalClaimers = {totalClaimersNumber} 
                                updateClaimerNumber = {updateClaimerNumber}  
                                disabled = {false} 
                                questID = {questID} 
                                reload = {reload_state} 
                                contractAddress = {contractAddress} 
                                userAddress = {userAccount}
                                isCorrectNetwork = {isCorrectNetwork} 
                                handleNetworkSwitch = {handleNetworkSwitch} 
                              />

                            </div>

                          :
                  
                            <div className = "rounded row-span-2 flex flex-col">

                              <VerificationComponent 
                                disabled = {true} 
                                questID = {questID} 
                                reload = {reload_state} 
                                contractAddress = {contractAddress} 
                                userAddress = {userAccount}
                                isCorrectNetwork = {isCorrectNetwork} 
                                handleNetworkSwitch = {handleNetworkSwitch} 
                              />

                            </div> 
                        }            
                      </> 

                    :

                      <div className = "rounded row-span-2 flex flex-col">

                        <Claimed 
                          tweetText = {tweetTextState} 
                          claimerNumber = {claimerNumberState}
                        />

                        <ShareButton 
                          number = {maxClaimerNumber - totalClaimersNumber}
                        />
                    
                      </div>
                  }

                  <RewardsComponent/>

                </div>

                {
                  winners.length == 0 ?
                    null
                  :
                    <PartiersComponent 
                      winners = {winners}
                    />
                }

              </div>
            </div>
            <div className = "fixed bottom-0 p-3 left-0">

          <a href="https://layer3.xyz" target="_blank" rel="noopener noreferrer">
            <svg width="125" height="15" viewBox="0 0 188 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.672 6.976V12H15.072V7.504C15.072 6.832 14.944 6.38933 14.688 6.176C14.432 5.96267 14 5.856 13.392 5.856C12.6987 5.856 12.192 6.01067 11.872 6.32C11.5627 6.62933 11.408 7.14667 11.408 7.872V12H7.808V7.504C7.808 6.832 7.68 6.38933 7.424 6.176C7.168 5.96267 6.736 5.856 6.128 5.856C5.44533 5.856 4.944 6.01067 4.624 6.32C4.304 6.62933 4.144 7.14667 4.144 7.872V12H0.544V3.52H4.144V4.912H4.272C4.76267 3.87733 5.824 3.36 7.456 3.36C8.288 3.36 9.008 3.46133 9.616 3.664C10.256 3.856 10.7253 4.27733 11.024 4.928H11.152C11.7173 3.88267 12.8533 3.36 14.56 3.36C15.232 3.36 15.792 3.408 16.24 3.504C16.6987 3.58933 17.12 3.75467 17.504 4C17.8987 4.24533 18.192 4.61867 18.384 5.12C18.576 5.61067 18.672 6.22933 18.672 6.976ZM31.3159 6.976V12H27.7159V10.496H27.6199C27.1719 11.6053 25.8439 12.16 23.6359 12.16C22.1959 12.16 21.1452 11.936 20.4839 11.488C19.8225 11.0293 19.4919 10.3413 19.4919 9.424V9.296C19.4919 7.792 20.4945 7.008 22.4999 6.944L27.7159 6.768V6.64C27.7159 6.16 27.5665 5.84 27.2679 5.68C26.9799 5.50933 26.4305 5.424 25.6199 5.424C24.9799 5.424 24.5159 5.47733 24.2279 5.584C23.9505 5.69067 23.7425 5.86667 23.6039 6.112H19.8599C20.0732 5.472 20.3665 4.96533 20.7399 4.592C21.1239 4.208 21.7159 3.90933 22.5159 3.696C23.3265 3.472 24.3825 3.36 25.6839 3.36H25.9879C28.0679 3.36 29.4759 3.616 30.2119 4.128C30.9479 4.62933 31.3159 5.57867 31.3159 6.976ZM23.1239 9.296V9.36C23.1239 9.66933 23.2572 9.89333 23.5239 10.032C23.7905 10.16 24.2439 10.224 24.8839 10.224C25.7692 10.224 26.4625 10.08 26.9639 9.792C27.4652 9.49333 27.7159 9.08267 27.7159 8.56V8.448L24.3559 8.56C23.5345 8.57067 23.1239 8.816 23.1239 9.296ZM45.0605 0.799999V12H41.4765V10.592H41.3645C41.1192 11.136 40.6765 11.536 40.0365 11.792C39.4072 12.0373 38.5272 12.16 37.3965 12.16H37.1725C35.5085 12.16 34.2712 11.856 33.4605 11.248C32.6498 10.6293 32.2445 9.56267 32.2445 8.048V7.472C32.2445 5.95733 32.6498 4.896 33.4605 4.288C34.2712 3.66933 35.5085 3.36 37.1725 3.36H37.3965C38.5272 3.36 39.4072 3.488 40.0365 3.744C40.6765 3.98933 41.1192 4.384 41.3645 4.928H41.4765V0.799999H45.0605ZM36.4205 9.328C36.8045 9.552 37.5512 9.664 38.6605 9.664C39.7698 9.664 40.5165 9.552 40.9005 9.328C41.2845 9.104 41.4765 8.63467 41.4765 7.92V7.6C41.4765 6.896 41.2792 6.432 40.8845 6.208C40.5005 5.97333 39.7592 5.856 38.6605 5.856C37.5618 5.856 36.8152 5.97333 36.4205 6.208C36.0365 6.432 35.8445 6.896 35.8445 7.6V7.92C35.8445 8.63467 36.0365 9.104 36.4205 9.328ZM54.377 9.264H57.993C57.7583 10.3413 57.225 11.0933 56.393 11.52C55.5717 11.9467 54.1583 12.16 52.153 12.16H51.865C49.785 12.16 48.297 11.8613 47.401 11.264C46.505 10.6667 46.057 9.59467 46.057 8.048V7.472C46.057 5.92533 46.505 4.85333 47.401 4.256C48.297 3.65867 49.785 3.36 51.865 3.36H52.121C54.2117 3.36 55.721 3.664 56.649 4.272C57.5877 4.86933 58.057 5.936 58.057 7.472V8.336H49.657C49.689 8.99733 49.865 9.424 50.185 9.616C50.5157 9.808 51.1397 9.904 52.057 9.904C52.8357 9.904 53.3743 9.86133 53.673 9.776C53.9717 9.69067 54.2063 9.52 54.377 9.264ZM52.057 5.408C51.2143 5.408 50.617 5.49867 50.265 5.68C49.913 5.85067 49.7157 6.208 49.673 6.752H54.457V6.688C54.457 6.19733 54.2757 5.86133 53.913 5.68C53.5503 5.49867 52.9317 5.408 52.057 5.408ZM66.9096 12H63.3256V0.799999H66.9096V4.928H67.0216C67.4696 3.88267 68.7923 3.36 70.9896 3.36H71.2136C72.8776 3.36 74.115 3.66933 74.9256 4.288C75.7363 4.896 76.1416 5.95733 76.1416 7.472V8.048C76.1416 9.56267 75.7363 10.6293 74.9256 11.248C74.115 11.856 72.8776 12.16 71.2136 12.16H70.9896C68.7923 12.16 67.4696 11.6373 67.0216 10.592H66.9096V12ZM67.4856 9.328C67.8696 9.552 68.6163 9.664 69.7256 9.664C70.835 9.664 71.5816 9.552 71.9656 9.328C72.3496 9.104 72.5416 8.63467 72.5416 7.92V7.6C72.5416 6.896 72.3443 6.432 71.9496 6.208C71.5656 5.97333 70.8243 5.856 69.7256 5.856C68.627 5.856 67.8803 5.97333 67.4856 6.208C67.1016 6.432 66.9096 6.896 66.9096 7.6V7.92C66.9096 8.63467 67.1016 9.104 67.4856 9.328ZM88.1593 3.52L82.3193 14.72H78.5433L80.1273 12.048L75.7912 3.52H79.6633L82.0633 8.56H82.1753L84.4792 3.52H88.1593ZM105.947 9.008V12H93.2428V0.799999H97.2108V9.008H105.947ZM119.033 0.799999L125.577 12H121.049L119.769 9.776H112.057L110.793 12H106.409L112.953 0.799999H119.033ZM115.993 3.168H115.849L113.561 7.136H118.265L115.993 3.168ZM132.543 7.12V12H128.575V7.136L122.127 0.799999H127.023L130.751 4.576H130.879L134.607 0.799999H138.991L132.543 7.12ZM153.526 9.36V12H140.118V0.799999H153.526V3.44H144.086V5.072H153.526V7.712H144.086V9.36H153.526ZM159.43 8.448V12H155.462V0.799999H165.798C167.686 0.799999 169.014 1.01867 169.782 1.456C170.55 1.88267 170.934 2.61333 170.934 3.648V4.208C170.934 5.08267 170.731 5.712 170.326 6.096C169.92 6.46933 169.243 6.69867 168.294 6.784V6.896C168.795 6.96 169.19 7.03467 169.478 7.12C169.766 7.20533 170.027 7.344 170.262 7.536C170.507 7.71733 170.678 7.97333 170.774 8.304C170.88 8.624 170.934 9.04 170.934 9.552V12H166.966V9.776C166.966 9.24267 166.811 8.89067 166.502 8.72C166.203 8.53867 165.51 8.448 164.422 8.448H159.43ZM164.422 3.44H159.43V5.808H165.222C165.872 5.808 166.326 5.73333 166.582 5.584C166.838 5.424 166.966 5.136 166.966 4.72V4.624C166.966 4.15467 166.8 3.84 166.47 3.68C166.139 3.52 165.456 3.44 164.422 3.44ZM180.87 12.16H179.078C178.267 12.16 177.558 12.1333 176.95 12.08C176.342 12.0267 175.75 11.9253 175.174 11.776C174.609 11.616 174.134 11.408 173.75 11.152C173.366 10.8853 173.041 10.5387 172.774 10.112C172.507 9.68533 172.331 9.184 172.246 8.608H176.118C176.257 8.98133 176.577 9.22667 177.078 9.344C177.59 9.46133 178.502 9.52 179.814 9.52C180.849 9.52 181.622 9.488 182.134 9.424C182.657 9.36 183.014 9.25867 183.206 9.12C183.409 8.98133 183.51 8.77333 183.51 8.496V8.432C183.51 8.13333 183.387 7.92 183.142 7.792C182.907 7.664 182.507 7.6 181.942 7.6H176.95V5.088H181.83C182.321 5.088 182.667 5.02933 182.87 4.912C183.083 4.79467 183.19 4.59733 183.19 4.32V4.24C183.19 3.89867 182.966 3.65333 182.518 3.504C182.081 3.35467 181.249 3.28 180.022 3.28C178.859 3.28 178.049 3.33333 177.59 3.44C177.142 3.54667 176.843 3.744 176.694 4.032H172.742C173.041 2.848 173.665 1.98933 174.614 1.456C175.563 0.911999 177.046 0.639999 179.062 0.639999H180.598C182.881 0.639999 184.539 0.869333 185.574 1.328C186.609 1.78667 187.126 2.49067 187.126 3.44V3.552C187.126 4.23467 186.945 4.75733 186.582 5.12C186.219 5.472 185.611 5.69067 184.758 5.776V5.92C185.771 5.984 186.47 6.22933 186.854 6.656C187.249 7.08267 187.446 7.74933 187.446 8.656V8.768C187.446 9.984 186.961 10.8533 185.99 11.376C185.019 11.8987 183.313 12.16 180.87 12.16Z" fill="#FFFF0D"/>
            </svg>
          </a>

        </div>
            </>
            
          }

        </div>

        

      </div>
    </>
  )
}
