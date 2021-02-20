import React, { useEffect, useState } from 'react';
import {
  CButton
} from '@coreui/react'
import Pagination from "react-js-pagination";
import { getApplicantsForJob } from '../../firebase/firebasedb'
import Loader from '../../utilities/loader/index.js'

function Jobdetail(props) {
  const { toggleJob, job } = props
  const [data, setData] = useState([])
  const [isLoading, setLoading ] = useState(false)
  const [page, setPage] = useState(1)
  const [totaldata, setTotalData] = useState()
  let limit = 1
  useEffect(() => {
    if (props.job) {
      getJobById(page)
    }
  }, [props])

  const getJobById = async (pageNumber) => {
    const offset = (pageNumber - 1) *  limit 
    setLoading(true)
    const result = await getApplicantsForJob(job.id,offset,limit)
    setData(result.data)
    setTotalData(result.totalData)
    setLoading(false)

  }
  const pageChange = (pagenumber)=>{
    setPage(pagenumber)
    getJobById(pagenumber)

  }

  return (
    <div>
     { isLoading && <Loader/>}
      <CButton color = "primary" onClick={toggleJob} > Back </CButton>
      {(data && data.length > 0 ) ? 
      <>
      <table className="table table-striped table-hover">
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
      : 
      <div> 
      No Data
    </div>
      }
    </div>
  );
}

export default Jobdetail;