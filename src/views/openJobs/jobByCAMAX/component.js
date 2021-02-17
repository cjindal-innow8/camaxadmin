import React from 'react';
import {
 CButton
} from '@coreui/react'
import AddJob from './addJob'
function JobContainer(props) {
  const {jobs,deleteJob, toggleJob,isOpen,editJob,handleChange,values,toggle,isUpdate,updateJob, getJob,onAdd} = props 
  return (
    <div>
       
        {
          (jobs && jobs.length > 0) ?
          <table className="table table-striped table-hover">
        <tr>
          <th> Job Title </th>
          <th> Experience </th>
          <th></th>
          <th></th>
        </tr>
        {
          jobs && jobs.map((job, index)=>{
            const { experience, jobTitle } = job
            return (
              <tr key = {index} >
              <td onClick = {()=>{
                getJob(job)
                toggleJob();
                }}> {jobTitle} </td>
              <td onClick = {()=>{
                getJob(job)
                toggleJob();
                }}> {experience} </td>
              <td> <CButton color = "primary" onClick = {()=>{editJob(index)}}> Edit</CButton> </td>
              <td> <CButton color = "danger" onClick = {()=>{deleteJob(index)}}> Delete</CButton> </td>
            </tr>
            )
          })
        }
      </table>
      : <div> 
      No Data
    </div> 
      }
      <AddJob  isOpen ={isOpen} onChange = {handleChange} onAdd = {onAdd} values = {values} onToggle = {toggle} isUpdate= {isUpdate} updateJob={updateJob}/>
    </div>
  );
}

export default JobContainer;