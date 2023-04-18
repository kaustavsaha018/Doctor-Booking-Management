import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Col, Row } from "antd";
import Doctor from "../components/Doctor";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
function Home() {
  const [doctors, setDoctors] = useState([]);
  const [searchDoctors, setSearchDoctors] = useState([]);
  const [filterVal, setFilterVal] = useState('');
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/user/get-all-approved-doctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
        setSearchDoctors(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleFilter = (e) =>{
      if(e.target.value === ''){
        setDoctors(searchDoctors);
      }
      else{
        const filterResult = searchDoctors.filter(item => item.specialization.toLowerCase().includes(e.target.value.toLowerCase()))
        setDoctors(filterResult);
        // console.log(searchDoctors);
      }
      setFilterVal(e.target.value);
  }

  return (
    <Layout>
      <div className="input-group mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Search Doctor by Specialization"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          value={filterVal}
          onInput={(e)=>handleFilter(e)}
        />
        <div className="input-group-append">
          <button className="btn btn-primary mx-3 px-3" type="button">
            Search
          </button>
        </div>
      </div>

      <Row gutter={20}>
        {doctors.length>0 ? 
        doctors.map((doctor) => (
          <Col span={8} xs={24} sm={24} lg={8}>
            <Doctor doctor={doctor} />
          </Col>
        )) : <>
              <h3>No Doctors Found</h3>
            </>
        }
      </Row>
    </Layout>
  );
}

export default Home;
