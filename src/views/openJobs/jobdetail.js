import React,{useEffect,useState} from 'react';
import {CButton
} from '@coreui/react'
import {getAllApplicants} from '../../firebase/firebasedb'

function Jobdetail(props) {
const {toggleJob,job} = props
  useEffect (()=>{
    console.log("jobjobjobjob=",job)
    // experience: "2 years"
    // id: "-MSzzfH1CiGO7C0KzKM-"
    // jobTitle: "sdfd"
    // location: "Panchkula, India"
    if(props.job){
      const jobTitle = job.jobTitle
      const experience = job.experience
      
    }

    // const 
  }, [props])

//  useEffect(()=>{

//  })

  return (
    <div>
      <CButton onClick = {toggleJob} > Back </CButton>
      <table className="table table-striped table-hover">
        <tr >
          <td> Name </td>
          <td> Email </td>
          <td> Position </td>
          <td> About </td>
        </tr>
        {/* {
          data && data.map((employee, index) => {
            const { about,email,position, firstName,file,lasttName } = employee
            return (<tr key = {index}>
              <td> {firstName} </td>
              <td> {email} </td>
              <td> {position} </td>
              <td> {about} </td>
            </tr>)
          })
        } */}
        </table>
    </div>
  );
}

export default Jobdetail;