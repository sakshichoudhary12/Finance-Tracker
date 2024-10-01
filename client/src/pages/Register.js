import React, { useState, useEffect } from "react";
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from '../components/Spinner';
import "../styles/register.css";

const Register = () => {
const navigate = useNavigate();
const [loading, setLoading] = useState(false);

  //form submit
const submitHandler = async (values) => {
    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/v1/users/register", values);
      message.success("Registration Successfull");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      message.error("something went wrong");
    }
};

  // prevent for login user
  useEffect(() => {
    if(localStorage.getItem("user")){
      navigate("/")
    }
  },[navigate]);
  return (
    <>
      <div className="register-page">
        {loading && <Spinner />}
          <Form layout="vertical" onFinish={submitHandler}>
            <h1>Register Form</h1>
             <Form.Item 
                 label="Name" 
                 name="name"
                 rules={[{ required: true, message: 'Please enter your name' }]}

             >
              <Input />
             </Form.Item>
             <Form.Item 
                 label="Email" 
                 name="email"
                 rules={[
                  { required: true, message: "Please enter your email" },
                  { type: 'email', message: "Please enter a valid email" },
                ]}
             >
              <Input type="email" />
             </Form.Item>
             <Form.Item 
                 label="Password" 
                 name="password"
                 rules={[{ required: true, message: "Please enter your password" }]}
             >
              <Input type="password" />
             </Form.Item>
             <div className="d-flex justify-content-between">
              <Link to="/login">Already Register ? Click Here to login</Link>
              <button className="btn btn-primary" type="submit">Register</button>
             </div>
          </Form>
      </div>

    </>
  )
}

export default Register;
