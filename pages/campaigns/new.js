import React, { useState, useEffect } from "react";
import { Button, Form, Input, Message, Icon } from "semantic-ui-react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import "semantic-ui-css/semantic.min.css";

const INITIAL_TRANSACTION_STATE = {
  loading: "",
  error: "",
  success: "",
};

const CampaignNew = (props) => {
  const router = useRouter();
  const [minimumContribution, setMinimumContribution] = useState("");
  const [transactionState, setTransactionState] = useState(
    INITIAL_TRANSACTION_STATE
  );

  const { loading, error, success } = transactionState;

  const onSubmit = async (event) => {
    event.preventDefault();

    // set to loading
    setTransactionState({
      ...INITIAL_TRANSACTION_STATE,
      loading: "Transaction is processing. Please wait for few seconds...",
    });

    const accounts = await web3.eth.getAccounts(); // get all acounts
    await factory.methods
      .createCampaign(minimumContribution) // create new campaign
      .send({ from: accounts[0] })
      .then((res) => {
        // res will contain confirmation from etherscan
        console.log(res);
        const etherscanLink = `https://rinkeby.etherscan.io/tx/${res.transactionHash}`;
        setTransactionState({
          ...INITIAL_TRANSACTION_STATE,
          success: <a href={etherscanLink}>See transaction on EtherScan</a>,
        });
        //check here
        router.push("/");
      })
      .catch((err) => {
        // error handling
        console.log(err);
        setTransactionState({
          ...INITIAL_TRANSACTION_STATE,
          error: err.message,
        });
      });
    setMinimumContribution(""); // reverse state back to default
  };

  const renderMessage = () => {
    return (
      <Message icon negative={Boolean(error)} success={Boolean(success)}>
        <Icon
          name={
            loading ? "circle notched" : error ? "times circle" : "check circle"
          }
        />
        loading={Boolean(loading)};
        <Message.Content>
          {Boolean(success) && (
            <Message.Header>Transaction Success!</Message.Header>
          )}
          {loading ? loading : error ? error : success}
        </Message.Content>
      </Message>
    );
  };

  return (
    <Layout>
      <h1>Create new Campaign</h1>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            focus
            type="number"
            min="0"
            disabled={Boolean(loading)} // disable if loading
            value={minimumContribution}
            onChange={(e) => setMinimumContribution(e.target.value)}
          />
        </Form.Field>
        <Button color="black" disabled={Boolean(loading)}>
          Create
        </Button>
      </Form>
      {Boolean(loading || error || success) && renderMessage()}
    </Layout>
  );
};

export default CampaignNew;
