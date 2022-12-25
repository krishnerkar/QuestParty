import '../styles/globals.css'

import type { AppProps } from "next/app";
import { DAppProvider } from "@usedapp/core";

function BatchBountyApp({ Component, pageProps }: AppProps) {
    const config = {
        supportedChains: [80001, 137], // Polygon testnet and mainnet
        readOnlyChainId: 80001,
        readOnlyUrls: {
            [80001]:
                "https://polygon-mumbai.g.alchemy.com/v2/HjCarcMhMP8qhLRJ4taP-GJav_fQTKaH",
            [137]: "https://polygon-rpc.com",
        },
    };

    // Simulate inside app page
    return (
        <DAppProvider config={config}>
            <Component {...pageProps} />
        </DAppProvider>
    );
}
export default BatchBountyApp;
