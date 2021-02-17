import React, { useEffect, useState } from 'react';
import {
  CButton
} from '@coreui/react'
import { getApplicantsForJob } from '../../firebase/firebasedb'

function Jobdetail(props) {
  const { toggleJob, job } = props
  const [data, setData] = useState([])
  useEffect(() => {
    console.log("jobjobjobjob=", job)
    if (props.job) {
      getJobById(job)
    }
  }, [props])

  const getJobById = async () => {
    const result = await getApplicantsForJob(job.id)
    setData(result)
  }

  return (
    <div>
      <CButton color = "primary" onClick={toggleJob} > Back </CButton>
      {(data && data.length > 0 ) ? <table className="table table-striped table-hover">
        <tr >
          <th> Name </th>
          <th> Email </th>
          <th> Position </th>
          <th> Phone </th>
          <th> About </th>
          <th> Resume </th>
        </tr>
        {
          data && data.map((employee, index) => {
            const { about, email, position, firstName,file, lastName, phone, } = employee
            console.log("file filefile=", file)
            return (<tr key={index}>
              <td> {firstName} </td>
              <td> {email} </td>
              <td> {position} </td>
              <td> {phone} </td>
              <td> {about} </td>
              {console.log("filefilefilefile mohit",file)}
              <td> <a href={file} target = "blank" download={"logo.png"} onLoad={(res) => {
                console.log('load res : ', res)
              }}> download CV </a> </td>
            </tr>)
          })
        }
      </table>
      : 
      <div> 
      No Data
    </div>
      }
    </div>
  );
}

export default Jobdetail;