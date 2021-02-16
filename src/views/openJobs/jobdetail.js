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
    console.log("job.jobIdjob.jobIdjob.jobId=", job.id)
    const result = await getApplicantsForJob(job.id)
    setData(result)
  }

  return (
    <div>
      <CButton onClick={toggleJob} > Back </CButton>
      <table className="table table-striped table-hover">
        <tr >
          <td> Name </td>
          <td> Email </td>
          <td> Position </td>
          <td> Phone </td>
          <td> About </td>
          <td> Resume </td>
        </tr>
        {
          data && data.map((employee, index) => {
            const { about, email, position, firstName, file, lasttName, phone, } = employee
            console.log("file filefile=", file)
            return (<tr key={index}>
              <td> {firstName} </td>
              <td> {email} </td>
              <td> {position} </td>
              <td> {phone} </td>
              <td> {about} </td>
              <td> <a href={'https://firebasestorage.googleapis.com/v0/b/camax-81a85.appspot.com/o/CV%2FtestImg.png?alt=media&token=395b3843-3b02-4325-93d4-c1d7b7f55c4c'} download={"logo.png"} onLoad={(res) => {
                console.log('load res : ', res)
              }}> download Resume </a> </td>
              {/* <td> <button onClick={() => {
                // This can be downloaded directly:
                const link = document.createElement('a');



                // fetch(file).then(res => res.json()).then(res => {
                //   link.href = res.blob();
                //   link.download = "test.pdf";
                //   link.click();
                // }).catch((err) => {
                //   console.log(err)
                // })



                // var xhr = new XMLHttpRequest();
                // xhr.responseType = 'blob';
                // xhr.onload = (event) => {
                //   var blob = xhr.response;
                // };
                // xhr.open('GET', file);
                // xhr.send();
              }}>download Resume </button>  </td> */}
            </tr>)
          })
        }
      </table>
    </div>
  );
}

export default Jobdetail;