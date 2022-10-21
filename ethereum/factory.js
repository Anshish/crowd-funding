// this file will help to get access to already deployed verison of factory

import web3 from "./web3"; // this will retrieve local instance of web3
import campaignFactory from "./build/CampaignFactory.json"; // this will retrieve abi of our contract


const address = process.env.DEPLOYED_CONTRACT_ADDRESS;
// both abi and address and abi are used to refer our original contract
const instance = new web3.eth.Contract(
  campaignFactory.abi,address

);

export default instance;
