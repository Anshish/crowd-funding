const assert = require("assert"); // used to make assertions
const ganache = require("ganache-cli"); // local ethereum test network
const Web3 = require("web3"); // Web3 here is a constructor function
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");
const { isTypedArray } = require("util/types");

let accounts; // list of all accounts on local ganache network
let factory; // deployed instance of factory
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts(); // get list of all accounts
  factory = await new web3.eth.Contract(compiledFactory.abi) // create instance of factory contract
    .deploy({ data: compiledFactory.evm.bytecode.object }) // deploy contract
    .send({ from: accounts[0], gas: "1400000" }); // using account at index 0

  await factory.methods.createCampaign("100").send({
    // use createCampaign function from contract and sen 100 wei as transaction
    from: accounts[0], // from account[0]
    gas: "1000000", // with 1000000 as gas
  });
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); // get list of addresses of all deployed contracts and assign address of first contract to campaignAddress
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress); // this is when contract is already deployed
});

describe("Campaigns", () => {
  it("deploys a factory and campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call;
    assert(isContributor);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "5",
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allows a manager to make payment request", async () => {
    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    const request = await campaign.methods.requests(0).call();
    assert.equal("Buy batteries", request.description);
  });

  it("processes request", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods
      .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    assert(balance > 104);
  });
});
