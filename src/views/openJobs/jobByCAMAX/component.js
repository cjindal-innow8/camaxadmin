import React from 'react';
import {
 CButton
} from '@coreui/react'
import AddJob from './addJob'
function JobContainer(props) {
  const {jobs,deleteJob, toggleJob,isOpen,editJob,handleChange,values,toggle,isUpdate,updateJob, getJob} = props 
  return (
    <div>
     
        <table className="table table-striped table-hover">
        <tr>
          <td> Job Title </td>
          <td> Experience </td>
        </tr>
        {
          jobs && jobs.map((job, index)=>{
            const { experience, jobTitle } = job
            return (
              <tr key = {index} onClick = {()=>{
                getJob(job)
                toggleJob();
                }}>
              <td> {jobTitle} </td>
              <td> {experience} </td>
              <td> <CButton color = "primary" onClick = {()=>{editJob(index)}}> Edit</CButton> </td>
              <td> <CButton color = "danger" onClick = {()=>{deleteJob(index)}}> Delete</CButton> </td>
            </tr>
            )
          })
        }
      </table>
      <AddJob  isOpen ={isOpen} onChange = {handleChange}  values = {values} onToggle = {toggle} isUpdate= {isUpdate} updateJob={updateJob}/>
    </div>
  );
}

export default JobContainer;