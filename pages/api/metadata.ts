// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Attribute = {
    trait_type: string;
    value: string;
}

type Data = {
    description: string;
    external_url: string;
    image: string;
    name: string;
    attributes: Array<Attribute>;
};

type Error = {
    error: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | Error>
) {
    // Get params
    const {questID, tweet, claimerNumber} = req.query ;

    // Create traits
    const attributes = [
        {trait_type: "Quest ID", value: `${questID}`},
        {trait_type: "Claimer Number", value: `${claimerNumber}`}
    ]

    // Decode the tweet text
    // @ts-ignore
    const text = Buffer.from(tweet, 'base64').toString("utf-8");

    // Pad the claimer number
    const number = String(claimerNumber).padStart(3, '0');

    // Generate the image url
    const imageUrl = `https://nft-image-generator-api.vercel.app/${encodeURIComponent(text)}-${number}.png`;
    // const imageUrl = "https://batch-quest-v2.vercel.app/placeholder.jpg";

    return res.status(200).json({
        description: "Layer3 Quest",
        external_url: "http://layer3.xyz/",
        image: imageUrl,
        name: `${text} #${number}`,
        attributes: attributes
    })
}
