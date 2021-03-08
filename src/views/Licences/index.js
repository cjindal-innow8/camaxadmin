import React, { useEffect, useState } from 'react';
import { licenceDetail,getTotalLicences } from '../../firebase/firebasedb'
import {CRow, CCol, CButton } from '@coreui/react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import Loader from '../../utilities/loader/index.js'
import Pagination from "react-js-pagination";

let limit = 2;
let InitialData
function Licences(props) {
  const [detail, setDetails] = useState()
  const [toDate, setToDate] = useState(new Date())
  const [fromDate, setFromDate] = useState(new Date())
  const [isLoading, setLoading] =useState(false)
  const [page, setPage] = useState(1)
  const [totaldata, setTotalData] = useState()

  useEffect(() => {
    getLicenceDetail(page)
    getLicenceCount()
  }, [])

  const getLicenceDetail = async (pageNumber) => {
    setLoading(true)
    const offset = (pageNumber - 1) *  limit 
    let lastPage = page
    const result = await licenceDetail({offset,limit,lastPage,newPage:pageNumber})
    setDetails(result)
    InitialData = result
    setLoading(false)
  }

  const setFrom = (date) => {
    const currentDate = new Date()
    if (moment(toDate) < moment(date)) {
      setFromDate(currentDate)
      filterData(currentDate, toDate)
    } else {
      setFromDate(date)
      filterData(date, toDate)

    }
  }

  const getLicenceCount = async ()=>{
    setLoading(true)
    const result = await getTotalLicences()
    setTotalData(result.totalData)
    setLoading(false)
  }

 const pageChange = (pagenumber)=>{
    setPage(pagenumber)
    getLicenceDetail(pagenumber)
  }

  const setTo = (date) => {
    setDetails(InitialData);
    const currentDate = new Date()
    if (moment(fromDate) > moment(date)) {
      setToDate(currentDate)
      filterData(fromDate, currentDate)

    } else {
      setToDate(date)
      filterData(fromDate, date)
    }
  }

  const filterData = (from, to) => {
    const fromDate = moment(from);
    const fromDateFormat = fromDate.format("YYYY-MM-DD");
    const toDate = moment(to);
    const toDateFormat = toDate.format("YYYY-MM-DD");
    const data = InitialData.filter(el => {
      const expiryDate = moment(el.expiryDate);
      const expiryDateFormat = expiryDate.format("YYYY-MM-DD");
      if ((expiryDateFormat === fromDate || expiryDateFormat === toDateFormat) || (expiryDate.isBetween(fromDate, toDate))) {
        return true;
      }
    })
    setDetails(data);
  }


  return (
    <div>
      { isLoading && 
       <Loader/>
      }
      {/* <div style = {{"display": "flex"}}> */}
      <CRow>
        <CCol>
        From : <DatePicker selected={fromDate} onChange={setFrom} />

        To : <DatePicker selected={toDate} onChange={setTo} />
        </CCol>
        <CCol>
          <CButton color = "primary" onClick = {()=>{setDetails(InitialData)}}> Clear </CButton>
          </CCol>

      </CRow>
      {/* </div> */}
      <table className="table table-striped table-hover">
        <th> User Name </th>
        <th> Email </th>
        <th> CompanyName </th>
        <th> Licence keys</th>
        <th> Product  </th>
        <th> Expiry Date</th>
        {
          detail && detail.map(data => {
            return (<tr>
              <td> {data.username}</td>
              <td> {data.email}</td>
              <td> {data.companyName}</td>
              <td> {data.id}</td>
              <td> {data.productName}</td>
              <td> {moment(data.expiryDate).format('DD-MM-YYYY')}</td>
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
     pageRangeDisplayed={5}
     onChange={pageChange}/>

    </div>
  );
}

export default Licences;