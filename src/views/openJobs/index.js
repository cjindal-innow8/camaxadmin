// import React,{useState} from 'react';
// // import JobByEmployer from './jobByEmployer/jobByEmployer.js'
// // import JobByEmployee from './jobByEmployee/jobByEmployee.js'
// // import AddJob from './addJob/index'
// // import Alert from "../../../../shared/utils/alert";
// // import JobByCAMAX from './jobByCAMAX'
// // import Applicants from './Applicants'
// // import { withFirebase } from '../../../../firebase'
// // import { compose } from "redux";
// const formDetail = {
//   jobTitle : '',
//   experience : '',
// }
// // addCAMAXPost
// function OpenJobs(props) {
//   const [tab, setTab] = useState('employer')
//   const [isOpen, setIsOpen] = useState(false)
//   const [fields, setFields] = useState(formDetail);
// //  const {firebase,title} = props
//   const handleChange = (event) => {
//     const key = event.target.id;
//     const value = event.target.value;
//     setFields((prevState) => ({
//       ...prevState,
//       [key]: value,
//     }));
//   };
// // const handleAdd = ()=>{
// //   const {jobTitle, experience} = fields;
// //   if (!jobTitle || !experience 
// //   ) {
// //     Alert(400, "All fields are required !!");
// //     return;
// //   }
// //  const data = fields
// //   firebase.addCAMAXPost(data,(res)=>{
// //     if(res){
// //     Alert(200, "Job Added Successfully!!");
// //     }
// //   })
// //   setFields(formDetail)
// // }
//   const renderComponent = ()=>{
//       //  switch(tab){
//       //    case "employee":
//       //    return <JobByEmployee/>
//       //    case "employer":
//       //    return <JobByEmployer/>
//       //    case "camax":
//       //    return <JobByCAMAX/>
//       //    case "applicants":
//       //    return <Applicants/>
         
//       //  }
//   }
//   const onToggle = ()=>{
//     setIsOpen(!isOpen)
//   }
//   return (
//     <div>
//       <h1>jsjfhdisufg </h1>
//       <button onClick = {()=>{setIsOpen(true)}}> Add Job </button>
//       {/* <AddJob value = {fields} isOpen = {isOpen} onToggle = {onToggle} onChange = {handleChange}
//       onAdd = {handleAdd}
//       values = {fields}/> */}
//       <button onClick = {()=>{
//         setTab("employer")
//         }}> jobByEmployer </button>
//       <button onClick ={()=>{
//         setTab("employee")
//         }} > jobByEmployee </button>
//         <button onClick ={()=>{
//         setTab("camax")
//         }} > JobByCAMAX </button>
//          <button onClick ={()=>{
//         setTab("applicants")
//         }} > Applicants </button>
//      {
//       //  renderComponent()
//      }
//     </div>
//   );
// }
// // export default compose(withFirebase)(OpenJobs);

// export default OpenJobs;

import Alert from '../../utilities/Alerts'
import JobsByEmployee from './jobsByEmployee'
import JobByEmployer from './jobByEmployer'
import JobByCAMAX from './jobByCAMAX/index'
import Applicants from './applicants/index'
import Jobdetail from './jobdetail'
import React, { useState } from 'react'
import {
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
  CCard,
  CCardBody,
  CTabs,
  CCardHeader,
  CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import AddJob from './jobByCAMAX/addJob'
import {addCAMAXPost} from '../../firebase/firebasedb'

const formDetail = {
  jobTitle : '',
  experience : '',
}


const Tabs = () => {
  const [active, setActive] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [fields, setFields] = useState(formDetail);
  const [isShowJobs, setShowJobs] = useState(false);
  const [job, setJob] = useState([])
  const onToggle = ()=>{
    setIsOpen(!isOpen)
  }
  const toggleJob = ()=>{
    setShowJobs(!isShowJobs)
  }
  const getJob = (data)=>{
    console.log("getJobgetJob=",data)
    setJob(data)
  }
  const handleAdd = ()=>{
    const {jobTitle, experience} = fields;
    if (!jobTitle || !experience 
    ) {
      Alert(400, "All fields are required !!");
      return;
    }
    const data = fields
     addCAMAXPost(data,(res)=>{
      if(res){
      Alert(200, "Job Added Successfully!!");

      }
    })
    setFields(formDetail)

  }
  const handleChange = (event) => {
    const key = event.target.id;
    const value = event.target.value;
    setFields((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  return (
    <CRow>
      <CCol xs="12" md="12" className="mb-4">

        {/* <CCard>
          <CCardHeader> */}
            Open Jobs
            {/* <DocsLink name="CTabs"/> */}
          {/* </CCardHeader> */}
          {/* <CCardBody> */}
          {/* <CButton color = "primary" onClick = {()=>{setIsOpen(true)}}> Add Job </CButton> */}
      {/* <AddJob value = {fields} isOpen = {isOpen} onToggle = {onToggle} onChange = {handleChange}
      onAdd = {handleAdd}
      values = {fields}/> */}
            <CTabs>
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink>
                  Job Seeker Profile
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink>
                  Posts From Recruiters
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink>
                  Jobs At CAMAX
                  </CNavLink> 
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane>
                       <JobsByEmployee />
                </CTabPane>
                <CTabPane>
                        <JobByEmployer/>
                </CTabPane>
                <CTabPane>
                      { !isShowJobs ?  <JobByCAMAX toggleJob={toggleJob} getJob={getJob}/> : <Jobdetail toggleJob={toggleJob} job= {job}/>}
                </CTabPane>
                <CTabPane>
                         {/* <Applicants/> */}
                </CTabPane>
              </CTabContent>
            </CTabs>
          {/* </CCardBody> */}
        {/* </CCard> */}
      </CCol>
      
    </CRow>
  )
}

export default Tabs
