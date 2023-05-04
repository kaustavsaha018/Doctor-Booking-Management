import { Button, Col, DatePicker, Form, Input, Row, TimePicker, Space, Radio } from "antd";

import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import DoctorForm from "../components/DoctorForm";
import moment from "moment";

function BookAppointment() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [appointmentMode, setAppointmentMode] = useState("online");
  const navigate = useNavigate();
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [payBtnText, setPayBtnText] = useState("Pay Now");
  const [payBtn, setPayBtn] = useState(false);
  const [bookBtn, setBookBtn] = useState(true);
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        {
          doctorId: params.doctorId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };
  const checkAvailability = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/check-booking-avilability",
        {
          doctorId: params.doctorId,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };
  const bookNow = async () => {
    setIsAvailable(false);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
          appointmentType: appointmentMode
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        
        toast.success(response.data.message);
        navigate('/appointments')
      }
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  
  const [radioVal, setRadioVal] = useState(1);
  const onRadioChange = (e) => {
    setRadioVal(e.target.value);
    if(radioVal===1){
            setAppointmentMode("offline")
            setPayBtn(true);
            setPayBtnText("Pay Cash to Doctor")
            setBookBtn(false);
    }
    else{
            setAppointmentMode("online")
            setPayBtn(false);
            setPayBtnText("Pay Now")
            setBookBtn(true);
    }
  };

  const handleOpenRazorpay = (data)=>{
    const options = {
      key: 'rzp_test_aETqDyWsFWDmE9',
      amount: Number(data.amount),
      currency: data.currency,
      name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      description: 'Payment for Appointment Booking',
      image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/ef/KIIT_logo.svg/300px-KIIT_logo.svg.png",
      order_id: data.id,
      handler: function(response){
          console.log(response, 34);
          axios.post("/api/payment/verify", {response})
          .then(res=>{
            console.log(res, 37);
            setPayBtn(true);
            setPayBtnText("Paid")
            setBookBtn(false);
          })
          .catch(err=>{
            console.log(err);
          })
      }
    }
    const rzp = new window.Razorpay(options);
    rzp.open();
  }
  
  const handlePayment = async (amount)=>{
    console.log(amount);
    const _data = {amount: amount}
    await axios.post("/api/payment/orders", _data)
    .then(res=>{
      console.log(res.data, 29);
      handleOpenRazorpay(res.data.data);
    })
    .catch(err=>{
        console.log(err);
    })
  }

  return (
    <Layout>
      {doctor && (
        <div>
          <h1 className="page-title">
            Dr. {doctor.firstName} {doctor.lastName}
          </h1>
          <span>
            Specialized in {doctor.specialization}
          </span>
          <hr />
          <Row gutter={20} className="mt-5" align="middle">

            <Col span={8} sm={24} xs={24} lg={8}>
              <img
                src="https://thumbs.dreamstime.com/b/finger-press-book-now-button-booking-reservation-icon-online-149789867.jpg"
                alt=""
                width="100%"
                height='400'
              />
            </Col>
            <Col span={8} sm={24} xs={24} lg={8}>
              <h1 className="normal-text">
                <b>Timings :</b> {doctor.timings[0]} - {doctor.timings[1]}
              </h1>
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
                {doctor.feePerCunsultation}
              </p>
              <p>
                <b>Website : </b>
                {doctor.website}
              </p>
              <div className="d-flex flex-column pt-2 mt-2">
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setDate(moment(value).format("DD-MM-YYYY"));
                    setIsAvailable(false);
                  }}
                />
                <TimePicker
                  format="HH:mm"
                  className="mt-3"
                  onChange={(value) => {
                    setIsAvailable(false);
                    if(moment(value).format("HH:mm")<doctor.timings[0] || moment(value).format("HH:mm")>doctor.timings[1]){
                      setTime(null);
                      toast.error("Select withing time range");
                    } 
                    else setTime(moment(value).format("HH:mm"));
                  }}
                />
              {!isAvailable &&   <Button
                  className="primary-button mt-3 full-width-button"
                  onClick={checkAvailability}
                >
                  Check Availability
                </Button>}

                {isAvailable && (
                  <>

                  <Radio.Group onChange={onRadioChange} value={radioVal} className="mt-3">
                    <Space direction="vertical">
                      <Radio value={1}>ONLINE CHECKUP</Radio>
                      <Radio value={2}>OFFLINE VISIT</Radio>
                    </Space>
                  </Radio.Group>
                  <Button
                    disabled={bookBtn}
                    className="primary-button mt-3 full-width-button"
                    onClick={bookNow}
                  >
                    Book Now
                  </Button>

                  <Button
                  disabled={payBtn}
                    className="primary-button mt-3 full-width-button"
                    onClick={()=> handlePayment(doctor.feePerCunsultation)}
                  >{payBtnText}</Button>

                  </>
                )}
              </div>
            </Col>
           
          </Row>
        </div>
      )}
      <div style={{margin:"auto", width:"50%", padding:"2%"}}>
      <h4>📍Locate the Doctor's Clinic</h4>
      <iframe style={{border:"0", margin:"0"}} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.750360875547!2d85.8111764148428!3d20.351929086368852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19092289cbfcef%3A0x26d133989a910e1a!2sKalinga%20Institute%20of%20Medical%20Sciences!5e0!3m2!1sen!2sin!4v1678820990875!5m2!1sen!2sin" width="100%" height="400px" allowfullscreen="" loading="lazy" title="doctor_location" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </Layout>
  );
}

export default BookAppointment;
