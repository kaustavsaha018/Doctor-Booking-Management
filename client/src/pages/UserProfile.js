import { Avatar, Card } from "antd";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";

function Profile() {
  const { user } = useSelector((state) => state.user);

  useEffect(() => {}, []);
  console.log(user);
  const { Meta } = Card;
  return (
    <Layout>
      <h1>User's profile</h1>
      <hr />
      <Card>
        <Meta
          avatar={
            <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
          }
          title={user.isDoctor ? `Dr.${user.name}` : user.name}
          description={user.email}
          style={{ fontSize: "large" }}
        />
        <hr />
        <p>User Id: {user._id}</p>
        <p>Account Created on : {user.createdAt}</p>
      </Card>
    </Layout>
  );
}

export default Profile;
