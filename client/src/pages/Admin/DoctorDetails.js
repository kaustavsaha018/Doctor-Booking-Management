import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom'
import Layout from "../../components/Layout";
import { Descriptions } from "antd";

function DoctorsList() {

    const location = useLocation();
    console.log(location);
    useEffect(() => {
    
    }, []);

    return (
        <Layout>
        <h1 className="page-header">Doctor Details</h1>
        <hr />
        <Descriptions title="Detailed Info">
        <Descriptions.Item label="Firstname">{location.state.record.firstName}</Descriptions.Item>
        <Descriptions.Item label="Lastname">{location.state.record.lastName}</Descriptions.Item>
        <Descriptions.Item label="Experience">{location.state.record.experience} years</Descriptions.Item>
        <Descriptions.Item label="Timing From">{location.state.record.timings[0]}</Descriptions.Item>
        <Descriptions.Item label="Timing Till">{location.state.record.timings[1]}</Descriptions.Item>
        <Descriptions.Item label="Consulting Fee">₹{location.state.record.feePerCunsultation}</Descriptions.Item>
        <Descriptions.Item label="Phone Number">{location.state.record.phoneNumber}</Descriptions.Item>
        <Descriptions.Item label="Specialization">{location.state.record.specialization}</Descriptions.Item>
        <Descriptions.Item label="Address">{location.state.record.address}</Descriptions.Item>
        <Descriptions.Item label="Portfolio">{location.state.record.website}</Descriptions.Item>
        </Descriptions>
        </Layout>
    );
}

export default DoctorsList;
