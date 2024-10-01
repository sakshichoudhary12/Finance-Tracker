import React , { useState, useEffect } from 'react';
import { Form, Input, message, Modal, Select, Table, DatePicker } from "antd";
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import Spinner from "./../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";
import "../styles/homepage.css";
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransection, setAllTransection] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);

  
  //table data
  const columns = [
    {
      title: "Date",
      dataIndex:"date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>
    },
    {
      title: "Amount",
      dataIndex:"amount"
    },
    {
      title: "Type",
      dataIndex:"type"
    },
    {
      title: "Category",
      dataIndex:"category"
    },
    {
      title: "Reference",
      dataIndex:"reference"
    },
    {
      title: "Actions",
      render: (text, record) => {
        return (
          <div>
           <EditOutlined onClick={() => {
             setEditable(record);
             setShowModal(true);
           }}/>
           <DeleteOutlined className="mx-2" onClick={() => {
              handleDelete(record);
           }}/>
        </div>
        );
      }
    },
  ];

  //getall transections


  //useEffect Hook
  useEffect(() => {
    const getAllTransection = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        const res = await axios.post("http://localhost:8080/api/v1/transections/get-transection", {
          userid: user._id,
          frequency,
          selectedDate,
          type,
        });
        setLoading(false);
        setAllTransection(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
        message.error("Fetch Issue With Transection");
      }
    };
    getAllTransection();
  },[frequency, selectedDate, type , setAllTransection]);

  //delete handler
  const handleDelete = async (record) => {
    try {
      setLoading(true)
      await axios.post("/api/v1/transections/delete-transection", {
        transactionId: record._id
      });
      setLoading(false);
      message.success("Transaction Deleted!");
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Unable to delete")
      
    }
  }

  //form handling
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (editable) {
        await axios.post("/api/v1/transections/edit-transection", {
          payload : {
            ...values,
            userId: user._id,
          },
          transactionId: editable._id
        });
        setLoading(false)
        message.success("Transection Updated Successfully");
      } else {
        await axios.post("/api/v1/transections/add-transection", {
          ...values, 
          userid: user._id,
        });
        setLoading(false)
        message.success("Transection Added Successfully");
      }
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      message.error("Failed to add transection");
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}
        <div className="filters">
           <div>
             <h6>Select Frequency</h6>
             <Select value={frequency} onChange={(values) => setFrequency(values)}>
                <Select.Option value="7">Last 1 Week</Select.Option>
                <Select.Option value="30">Last 1 Month</Select.Option>
                <Select.Option value="365">Last 1 Year</Select.Option>
                <Select.Option value="custom">Custom</Select.Option>
             </Select>
             {frequency === "custom" && (
               <RangePicker 
                  value={selectedDate} 
                  onChange={(values) => setSelectedDate(values)} 
               />
              )}
           </div>
           <div className="filter-tab">
             <h6>Select Type</h6>
             <Select value={type} onChange={(values) => setType(values)}>
                <Select.Option value="all">ALL</Select.Option>
                <Select.Option value="income">INCOME</Select.Option>
                <Select.Option value="expense">EXPENSE</Select.Option>
             </Select>
           </div>
            <div className="switch-icons">
                <UnorderedListOutlined 
                    className={`mx-2 ${
                      viewData === "table" ? "active-icon" : "inactive-icon"
                    }`}
                    onClick={() => setViewData("table")}
                />
                <AreaChartOutlined  
                    className={`mx-2 ${
                      viewData === "analytics" ? "active-icon" : "inactive-icon"
                    }`}
                    onClick={() => setViewData("analytics")}
                />
            </div>
            <div>
             <button 
                  className="btn btn-primary" 
                  onClick={() => setShowModal(true)}
             >
              Add New
             </button>
           </div>
        </div>
        <div className="content">
          {viewData === "table" ? (
            <Table columns={columns} dataSource={allTransection}/>
           ) : ( 
              <Analytics allTransection={allTransection} />
             )}
          
        </div>
        <Modal 
           title={editable ? "Edit Transaction" : "Add Transaction"}
           open={showModal} 
           onCancel={() => setShowModal(false)}
           footer={false}
        >
        <Form 
           layout="vertical" 
           onFinish={handleSubmit} 
           initialValues={editable}
        >
          <Form.Item label="Amount" name="amount">
            <Input type='text' required/>
          </Form.Item>
          <Form.Item label="type" name="type">
             <Select>
             <Select.Option value="income">Income</Select.Option>
             <Select.Option value="expense">Expense</Select.Option>
             </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
             <Select>
             <Select.Option value="salary">Salary</Select.Option>
             <Select.Option value="bonus">Bonus</Select.Option>
             <Select.Option value="project">Project</Select.Option>
             <Select.Option value="food">Food</Select.Option>
             <Select.Option value="movie">Movie</Select.Option>
             <Select.Option value="shopping">Shopping</Select.Option>
             <Select.Option value="bills">Bills</Select.Option>
             <Select.Option value="medical">Medical</Select.Option>
             <Select.Option value="fees">Fees</Select.Option>
             <Select.Option value="tax">Tax</Select.Option>
             <Select.Option value="house rent">House Rent</Select.Option>
             </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" required/>
          </Form.Item>
          <div className="d-flex justify-content-end">
             <button type="submit" className="btn btn-primary">
              {" "}
              SAVE
              </button>
          </div>
        </Form>
        </Modal>
    </Layout>
  );
};

export default HomePage;
