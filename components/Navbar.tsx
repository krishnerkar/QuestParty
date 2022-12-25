import WalletButton from "./WalletButton";

export default function Navbar (props) {

    return(
        <div className = "w-full min-w-full sm:flex justify-between">
          <img src="/nav-logo.png" width = "250" alt="" />


          <div className = "mt-10 sm:mt-0 flex justify-between items-center">
            
            <WalletButton setAccount = {props.setAccount} isCorrectNetwork = {props.isCorrectNetwork} handleNetworkSwitch = {props.handleNetworkSwitch} reload = {props.reload}/>
            
          </div>
        </div>
    )
}