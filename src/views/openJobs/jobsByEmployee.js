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
import Loader from '../../utilities/loader/index.js'
// import ReadMoreReact from '../../utilities/readMore'
// import ReadMoreReact from 'read-more-react'
import ReadMoreAndLess from 'react-read-more-less'

import {acceptJobTemplate} from '../../utilities/emailTemplates/jobRequestAccepted'
import {rejectJobTemplate} from '../../utilities/emailTemplates/jobRequestRejected'
import AcceptJobModal from './acceptJobModal'
import Alert from "../../utilities/Alerts"
import {sendMail} from '../../utilities/sendEmail'
import RejectJobModal from './rejectJobModal'
import Pagination from "react-js-pagination";
import {getAllPostByEmployee,deleteEmployeePost,updateStatusOfEmployeePost,getTotalOfEmployeePost} from "../../firebase/firebasedb"

function JobsByEmployee(props) {
  const [employeePost, setEmployeePost] = useState([])
  const [openAccept , setOpenAccept] = useState(false)
  const [openReject , setOpenReject] = useState(false)
  const [indexToUpdate , setIndexToUpdate] = useState(-1)
  const [statusToUpdate, setStatusToUpdate] = useState('')
  const [rejectionReason, setRejectionReason] = useState()
  const [isLoading, setLoading ] = useState(false)
  const [page, setPage] = useState(1)
  const [totaldata, setTotalData] = useState()
  let limit = 10
  useEffect(() => {
    getEmployeePost(page)
    getEmployeePostCount()
    
  }, [])
  const getEmployeePostCount = async ()=>{
    const result = await getTotalOfEmployeePost()
    setTotalData(result.totalData)
  }
  const getEmployeePost = async (pageNumber) => {
    setLoading(true)
    const offset = (pageNumber - 1) *  limit 
    let lastPage = page
    const result = await getAllPostByEmployee(offset,limit,lastPage,pageNumber)

    setEmployeePost(result)
    setLoading(false)
  }

  const toggleAcceptModal = ()=>{
    setOpenAccept(!openAccept)
  }
  const toggleRejectModal = ()=>{
    setOpenReject(!openReject)
  }

  const  deletePost = (index)=>{
    const newArray = employeePost.slice()
    let employee = newArray.splice(index,1)
    const id = employee[0].id
    setEmployeePost(newArray)
    // setLoading(true)
    deleteEmployeePost(id, (res)=>{
      if(res){
        Alert(200, "Post delete Successfully !!")
      //  setLoading(true)

      }
    })
   }
  const changeStatus = () => {
    const newArray = employeePost.slice()
    if(openReject && !rejectionReason){
      Alert(400, "Please enter reason !!")
        return
    }
    if(indexToUpdate !== -1){
      let employee = newArray[indexToUpdate]
      const id = employee.id
      const email = employee.email
      newArray[indexToUpdate] = {
        ...employee,
        status : statusToUpdate
      }
      setEmployeePost(newArray)
      setOpenAccept(false)
      setOpenReject(false)
      setRejectionReason('')
      updateStatus(id,statusToUpdate.toLowerCase())
      sendMailToEmployee(email)
    }
  }
  const sendMailToEmployee = (email)=>{
    // const content = `<div><p>Name: <b>${name}</b></p><p>Email: <b>${email}</b></p><p>Phone: <b>${phone}</b></p><p>Services: <b>${serviceType}</b></p><p>Message:</p><p>${message}</p></div>`;
    const values = (statusToUpdate ==="Rejected") ? {reason:rejectionReason} : {postType : "application",audience:"recruiters"}
    const template = (statusToUpdate ==="Rejected") ? rejectJobTemplate :acceptJobTemplate
    const content = template(values)
    const data = {
      from :"mmahajaninnow8@gmail.com",
      to: email,
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

  const pageChange = (pagenumber)=>{
    setPage(pagenumber)
    getEmployeePost(pagenumber)

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
      { isLoading && <Loader/>}
      { (employeePost && employeePost.length >  0) ?
      <>
     
          <table className="table table-striped table-hover">
            <tr>
          <th> Name </th>
          <th> Email </th>
          <th> Phone </th>
          <th> JobTitle </th>
          <th> CTC </th>
          <th> Experience </th>
          <th> About </th>
          <th> Status </th>
        </tr>
        {
          employeePost && employeePost.map((employee, index) => {
            const { about, ctc, email, experience, jobTitle, name, phone, status } = employee
            const aboutData = employee.about
            return (<tr key = {index}>
              <td> {name} </td>
              <td> {email} </td>
              <td> {phone} </td>
              <td> {jobTitle} </td>
              <td> {ctc} </td>
              <td> {experience} </td>
             
              <td>   
                <ReadMoreAndLess
                charLimit={10}
                readMoreText="&nbsp; more"
                readLessText="&nbsp; less"
              >
                {aboutData}
              </ReadMoreAndLess> </td>
              {/* <td>  */}
              {/* <td> {aboutData}  </td> */}
              <td> 
                {
                
                (status === "pending") ? <>
                  <CBadge color = "success" onClick={() => { 
                    setOpenAccept(true)
                    setIndexToUpdate(index)
                    setStatusToUpdate('accepted')
                    }}> Accept</CBadge>
                  <lebel> / </lebel>
                  <CBadge color = "danger" onClick={() => { 
                    setOpenReject(true)
                    setIndexToUpdate(index)
                    setStatusToUpdate('rejected')
                    // changeStatus(index,"Rejected")
                   
                    }}> Reject</CBadge>
                </> : <CBadge color = {(status ==="accepted") ? "success":"danger"}> {status.charAt(0).toUpperCase()+status.slice(1)}</CBadge>}
              </td>
              <td> <CButton color = "danger"onClick = {()=>{deletePost(index)}}> Delete</CButton> </td>
            </tr>)
          })
        }
          </table>
          <AcceptJobModal isOpen = {openAccept} changeStatus = {changeStatus} toggleAcceptModal = {toggleAcceptModal}/>
          <RejectJobModal isOpen = {openReject} rejectionReason = {rejectionReason} setRejectionReason = {setRejectionReason} 
          toggleRejectModal = {toggleRejectModal}
          changeStatus = {changeStatus}/>

<Pagination
     className="mt-3 mx-auto w-fit-content"
     itemClass="page-item"
     linkClass="page-link"
     activeClass="active"
     activePage={page}
     itemsCountPerPage={limit}
     totalItemsCount={totaldata}
    //  pageRangeDisplayed={5}
     onChange={pageChange}
   />

          </>
            : <div> 
                No Data
              </div>  
            }
    </div>
  );
}

export default JobsByEmployee;