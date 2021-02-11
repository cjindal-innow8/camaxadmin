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
import {getAllPostByEmployer,deleteEmployerPost,updateStatusOfEmployerPost} from "../../firebase/firebasedb";


function JobByEmployer(props) {
  const [employerPost, setEmployerPost] = useState([])

  useEffect(() => {
    getEmployerPost()
  }, [])

  const getEmployerPost = async () => {
    const result = await getAllPostByEmployer()
    console.log("resultresultresult=",result)
    setEmployerPost(result)
  }

  const  deletePost = (index)=>{
    const newArray = employerPost.slice()
    let employee = newArray.splice(index,1)
    const id = employee[0].id
    setEmployerPost(newArray)
     deleteEmployerPost(id, (res)=>{
      if(res){
        Alert(200, "Post delete Successfully !!")
      }
    })
   }

  const changeStatus = (index,status) => {
    const newArray = employerPost.slice()
    let employee = newArray[index]
    const id = employee.id
    newArray[index] = {
      ...employee,
      status : status
    }
    setEmployerPost(newArray)
    updateStatus(id,status.toLowerCase())
  }

  const updateStatus = (id,status)=>{
    updateStatusOfEmployerPost(id,status,(res)=>{
      if(res){
       Alert(200, status)
      }
    })
   }

  return (
    <div>
     <table className="table table-striped table-hover">
        <tr>
          <td> Company Name </td>
          <td> Email </td>
          <td> Phone </td>
          <td> JobTitle </td>
          <td> CTC </td>
          <td> Experience </td>
          <td> Description </td>
          <td> Status </td>
        </tr>
        {
          employerPost && employerPost.map((employer, index) => {
            const { description, ctc, email, experience, jobTitle, companyName, phone, status } = employer
            return (<tr key = {index}>
              <td> {companyName} </td>
              <td> {email} </td>
              <td> {phone} </td>
              <td> {jobTitle} </td>
              <td> {ctc} </td>
              <td> {experience} </td>
              <td> {description} </td>
              <td> {
                (status === "pending") ? <>
                  <lebel onClick={() => { changeStatus(index,'Accepted') }}> Accept</lebel>
                  <lebel> /</lebel>
                  <lebel onClick={() => { changeStatus(index,"Rejected") }}> Reject</lebel>
                </> : <lebel> {status}</lebel>}
              </td>
              <td> <CButton color = "danger" onClick = {()=>{deletePost(index)}}> Delete</CButton> </td>
              
            </tr>)
          })
        }

      </table>
    </div>
  );
}

export default JobByEmployer;