import React, { useEffect, useState } from 'react';
import { licenceDetail } from '../../firebase/firebasedb'
import {CRow, CCol, CButton } from '@coreui/react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import Loader from '../../utilities/loader/index.js'

let InitialData
function Licences(props) {
  const [detail, setDetails] = useState()
  const [toDate, setToDate] = useState(new Date())
  const [fromDate, setFromDate] = useState(new Date())
  const [isLoading, setLoading] =useState(false)
  
  useEffect(() => {
    getLicenceDetail()
  }, [])
  const getLicenceDetail = async () => {
    setLoading(true)
    const result = await licenceDetail()
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
    </div>
  );
}

export default Licences;