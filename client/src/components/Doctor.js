import React from "react";
import { useNavigate } from "react-router-dom";

function Doctor({ doctor }) {
  const navigate = useNavigate();
  return (
    <div
      className="card p-2 cursor-pointer"
      onClick={() => navigate(`/book-appointment/${doctor._id}`)}
    >
      <h1 className="card-title">
        Dr. {doctor.firstName} {doctor.lastName}
      </h1>
      <span>
        Specialized in {doctor.specialization}
      </span>
      <hr />
      <p>
        <b>Phone Number : </b>
        {doctor.phoneNumber}
      </p>
      <p>
        <b>Address : </b>
        {doctor.address}
      </p>
      <p>
        <b>Fee per Visit : </b>
        ₹{doctor.feePerCunsultation}/-
      </p>
      <p>
        <b>Timings : </b>
        {doctor.timings[0]} - {doctor.timings[1]}
      </p>
    </div>
  );
}

export default Doctor;
