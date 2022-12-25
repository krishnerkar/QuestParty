import type { NextApiRequest, NextApiResponse } from "next";
import Twitter from "twitter-lite";
import { ethers, Contract, Wallet, BigNumber } from "ethers";
import abi from '../../abi.json'

type Data = {
    txHash: string;
    claimerNumber: number;
    totalClaimerNumber : number;
};

type Error = {
    error: string;
};

const contractABI = abi

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | Error>
) {
    const body = req.body;
    if (!body.twitterUsername) {
        return res
            .status(500)
            .json({ error: "Twitter username was not found" });
    }
    if (!body.contractAddress) {
        return res
            .status(500)
            .json({ error: "Contract address was not found" });
    }
    if (!body.userAddress) {
        return res.status(500).json({ error: "User address was not found" });
    }
    if (!body.questID) {
        return res.status(500).json({ error: "Quest ID was not found" });
    }

    // @ts-ignore
    const client = new Twitter({
        version: "2",
        extension: false,
        bearer_token: process.env.TWITTER_BEARER_TOKEN,
    });

    let twitterUsername = body.twitterUsername;
    if (twitterUsername[0] == "@") {
        twitterUsername = twitterUsername.slice(1, twitterUsername.length);
    }
    let twitterUserDatas
    let userData
    try{
        twitterUserDatas = await client.get("users/by", {
            usernames: [twitterUsername],
            "user.fields": ["public_metrics"],
        });
        userData = twitterUserDatas.data[0];
    }
    catch(e){
        console.log(e)
        return res
            .status(500)
            .json({ error: "Twitter username was not found" });
    }
    const twitterID = userData.id;
    const followersCount = userData.public_metrics.followers_count;
    if (followersCount < 2) {
        return res
            .status(500)
            .json({ error: "Twitter account should have 25 followers" });
    }

    const twitterUserTweetDatas = await client.get(
        `users/${twitterID}/tweets`,
        {}
    );
    
    const tweets = twitterUserTweetDatas.data;


    let questID = body.questID;

    const provider = new ethers.providers.JsonRpcProvider(
        process.env.ALCHEMY_URL
    );
    const privateKey = process.env.KEEPER_PRIVATE_KEY
        ? process.env.KEEPER_PRIVATE_KEY
        : "";
    

    let tweetTextChain = body.tweet
    console.log("verify: tweetTextChain", tweetTextChain);
    let totalClaimers = body.totalClaimers;

    // Verify the tweet
    let isMatch = false;
    let latestTweet

    
    try{
        latestTweet = tweets[0];
    }
    catch(e){
        console.log(e)
        return res
            .status(500)
            .json({ error: "Twitter account is private or has no tweets" });
    }

    console.log("latestTweet", latestTweet);

    if ((latestTweet.text).includes(tweetTextChain)) {
        console.log("SUCCESSFULLY MATCHED")
        isMatch = true;
    }

    if (!isMatch) {
        return res
            .status(500)
            .json({ error: "We couldn't find your tweet. Try posting again and if you already have posted try verifying a couple times :)" });
    }

    const wallet = new ethers.Wallet(privateKey, provider);
    const contractAddress = body.contractAddress;
    const questContract = new Contract(contractAddress, contractABI, wallet);
    // const newtotalClaimers = await questContract.getTotalClaimers(questID);
    let newtotalClaimers = body.totalClaimers;
    
    console.log("newtotalClaimers", newtotalClaimers);
    console.log(typeof newtotalClaimers);

    // If valid then add user address to the claimers
    try {

        const addClaimerTx = await questContract.addClaimer(
            questID,
            body.userAddress,
            twitterID,
            {
                gasLimit: 600000,
                gasPrice: 100000000000,
            }
        );

        await addClaimerTx.wait();
        console.log(addClaimerTx)

        return res
            .status(200)
            .json({ txHash: addClaimerTx.hash, claimerNumber: parseInt(newtotalClaimers) + 1, totalClaimerNumber: parseInt(newtotalClaimers)});
    
        } catch (e) {
        console.error(e);


    
            return res
            .status(500)
            .json({ error: "Twitter account already claimed" });
        
    }
}