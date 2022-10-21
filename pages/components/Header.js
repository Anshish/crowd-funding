import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { useRouter } from "next/router";
import "semantic-ui-css/semantic.min.css";

function Header() {
  const router = useRouter();
  return (
    <Menu style={{ marginTop: "1em" }}>
      <Menu.Item color="black" onClick={() => router.push("/")}>KickStarter</Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item onClick={() => router.push("/")}>Campaigns</Menu.Item>
        <Menu.Item onClick={() => router.push("/campaigns/new")}>
          <Icon name="add circle" />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}

export default Header;
