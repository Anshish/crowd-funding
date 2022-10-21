import React, { Component } from "react";
import factory from "../ethereum/factory";
import "semantic-ui-css/semantic.min.css";
import { Card, Button, Icon } from "semantic-ui-react";
import Layout from "./components/Layout";
import { useRouter } from "next/router";
import Link from "next/link";

function CampaignIndex({ campaigns }) {
  const router = useRouter();
  // take items from array of addresses and render them using card component
  const items = campaigns.map((campaignAddress) => {
    return {
      header: campaignAddress,
      description: (
        <Link href={`/campaigns/${campaignAddress}`}>
          <a>View campaign</a>
        </Link>
      ),
      fluid: true,
    };
  });

  return (
    <Layout>
      <div>
        <h1>Open Campaigns</h1>
        <Button
          floated="right"
          color="black"
          size="large"
          onClick={() => router.push("./campaigns/new")}
          style={{ marginBottom: "20px" }}
        >
          <Icon name="add circle" />
          {"   "}Create New Campaign
        </Button>
        <Card.Group items={items} />
      </div>
    </Layout>
  );
}

//uses server side rendering to call the campaign contracts (so good for slow devices)
CampaignIndex.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { campaigns };
};

export default CampaignIndex;
