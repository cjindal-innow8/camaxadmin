import React , { useEffect, useState } from 'react';
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,CButton
} from '@coreui/react'
import Alert from "../../utilities/Alerts"
import {getAllPostByEmployee,deleteEmployeePost,updateStatusOfEmployeePost} from "../../firebase/firebasedb"
function JobsByEmployee(props) {
  const [employeePost, setEmployeePost] = useState([])

  useEffect(() => {
    getEmployeePost()
  }, [])
  const getEmployeePost = async () => {
    const result = await getAllPostByEmployee()
    setEmployeePost(result)
  }

  const  deletePost = (index)=>{
    const newArray = employeePost.slice()
    let employee = newArray.splice(index,1)
    const id = employee[0].id
    setEmployeePost(newArray)
    deleteEmployeePost(id, (res)=>{
      if(res){
        Alert(200, "Post delete Successfully !!")
      }
    })
   }
  const changeStatus = (index,status) => {
    const newArray = employeePost.slice()
    let employee = newArray[index]
    const id = employee.id
    newArray[index] = {
      ...employee,
      status : status
    }
    setEmployeePost(newArray)
    updateStatus(id,status.toLowerCase())
  }

  const updateStatus = (id,status)=>{
    updateStatusOfEmployeePost(id,status,(res)=>{
      if(res){
       Alert(200, status)
      }
    })
   }

  return (
    <div>
            <table className="table table-striped table-hover">
            <tr>
          <td> Name </td>
          <td> Email </td>
          <td> Phone </td>
          <td> JobTitle </td>
          <td> CTC </td>
          <td> Experience </td>
          <td> About </td>
          <td> Status </td>
        </tr>
        {
          employeePost && employeePost.map((employee, index) => {
            const { about, ctc, email, experience, jobTitle, name, phone, status } = employee
            return (<tr key = {index}>
              <td> {name} </td>
              <td> {email} </td>
              <td> {phone} </td>
              <td> {jobTitle} </td>
              <td> {ctc} </td>
              <td> {experience} </td>
              <td> {about} </td>
              <td> {
                (status === "pending") ? <>
                  <lebel onClick={() => { changeStatus(index,'Accepted') }}> Accept</lebel>
                  <lebel> /</lebel>
                  <lebel onClick={() => { changeStatus(index,"Rejected") }}> Reject</lebel>
                </> : <lebel> {status}</lebel>}
              </td>
              <td> <CButton color = "danger"onClick = {()=>{deletePost(index)}}> Delete</CButton> </td>
            </tr>)
          })
        }
              </table>
    </div>
  );
}

export default JobsByEmployee;