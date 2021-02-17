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
import {acceptJobTemplate} from '../../utilities/emailTemplates/jobRequestAccepted'
import {rejectJobTemplate} from '../../utilities/emailTemplates/jobRequestRejected'
import Alert from "../../utilities/Alerts"
import RejectJobModal from './rejectJobModal'
import AcceptJobModal from './acceptJobModal'
import {sendMail} from '../../utilities/sendEmail'
import {getAllPostByEmployer,deleteEmployerPost,updateStatusOfEmployerPost} from "../../firebase/firebasedb";


function JobByEmployer(props) {
  const [employerPost, setEmployerPost] = useState([])
  const [openAccept , setOpenAccept] = useState(false)
  const [openReject , setOpenReject] = useState(false)
  const [indexToUpdate , setIndexToUpdate] = useState(-1)
  const [statusToUpdate, setStatusToUpdate] = useState('')
  const [rejectionReason, setRejectionReason] = useState()
  useEffect(() => {
    getEmployerPost()
  }, [])

  const getEmployerPost = async () => {
    const result = await getAllPostByEmployer()
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

   const sendMailToEmployer = (email)=>{
    // const content = `<div><p>Name: <b>${name}</b></p><p>Email: <b>${email}</b></p><p>Phone: <b>${phone}</b></p><p>Services: <b>${serviceType}</b></p><p>Message:</p><p>${message}</p></div>`;
    const values = (statusToUpdate ==="Rejected") ? {reason:rejectionReason} : ""
    const template = (statusToUpdate ==="Rejected") ? rejectJobTemplate :acceptJobTemplate
    const content = template(values)
    const data = {
      from :"mmahajaninnow8@gmail.com",
      to: 'mparchainnow8@gmail.com',
      subject: "Inquiry from CaMax",
      content,
    };
    sendMail(data)
    .then(() => {
      Alert(200, "Email sent successfully.");
    })
    .catch(() => {
      Alert(400, "Unable to send email at this time.");
    });
  }

   const changeStatus = () => {
    const newArray = employerPost.slice()
    if(openReject && !rejectionReason){
      Alert(400, "Please enter reason !!")
        return
    }
    if(indexToUpdate !== -1){
      let employer = newArray[indexToUpdate]
      const id = employer.id
      newArray[indexToUpdate] = {
        ...employer,
        status : statusToUpdate
      }
      const email = employer.email
      setEmployerPost(newArray)
      setOpenAccept(false)
      setOpenReject(false)
      setRejectionReason('')
      updateStatus(id,statusToUpdate.toLowerCase())
      sendMailToEmployer(email)
    }
  }
  const toggleAcceptModal = ()=>{
    setOpenAccept(!openAccept)
  }
  const toggleRejectModal = ()=>{
    setOpenReject(!openReject)
  }

  const updateStatus = (id,status)=>{
    updateStatusOfEmployerPost(id,status,(res)=>{
      if(res){
       Alert(200, status)
      }
    })   
   }
   console.log("statusToUpdatestatusToUpdate=",statusToUpdate)
  return (
    <div>
      
     {(employerPost && employerPost.length > 0) ?
     <>
       <table className="table table-striped table-hover">
        <tr>
          <th> Company Name </th>
          <th> Email </th>
          <th> Phone </th>
          <th> JobTitle </th>
          <th> CTC </th>
          <th> Experience </th>
          <th> Description </th>
          <th> Status </th>
        </tr>
        {
          employerPost && employerPost.map((employer, index) => {
            const { description, ctc, email, experience, jobTitle, companyName, phone, status } = employer
            return (
            <tr key = {index}>
              <td> {companyName} </td>
              <td> {email} </td>
              <td> {phone} </td>
              <td> {jobTitle} </td>
              <td> {ctc} </td>
              <td> {experience} </td>
              <td> {description} </td>
              <td> {
                (status === "pending") ? <>
                  <CBadge color = "success" onClick={() => { 
                    setOpenAccept(true)
                    setIndexToUpdate(index)
                    setStatusToUpdate('Accepted')
                    }}> Accept</CBadge>
                  <lebel> / </lebel>
                  <CBadge color = "danger" onClick={() => { 
                    setOpenReject(true)
                    setIndexToUpdate(index)
                    setStatusToUpdate('Rejected')
                    }}> Reject</CBadge>
                </> : <CBadge color = {(status ==="accepted") ? "success":"danger"}> {status.charAt(0).toUpperCase()+status.slice(1)}</CBadge>}
              </td>
              <td> <CButton color = "danger" onClick = {()=>{deletePost(index)}}> Delete</CButton> </td>
              
            </tr>
            )
          })
        }

      </table>
      <AcceptJobModal isOpen = {openAccept} changeStatus = {changeStatus} toggleAcceptModal = {toggleAcceptModal}/>
          <RejectJobModal isOpen = {openReject} rejectionReason = {rejectionReason} setRejectionReason = {setRejectionReason} 
          toggleRejectModal = {toggleRejectModal}
          changeStatus = {changeStatus}/>
      </>
      : <div> 
      No Data
    </div> 
      }
    </div>
  );
}

export default JobByEmployer;