import React from 'react';
import {
  CBadge,
  CCard,
  CCardBody,
  CButton,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CInput
} from '@coreui/react'
import moment from 'moment'
function UserLicences(props) {
  const { handleClick, licences ,handleEdit,handleDelete,} = props
  console.log("licenceslicenceslicences", licences)
  return (
    <CRow>
      <CCol lg={8}>
        <CCard>
          <CCardHeader className="border-0 pb-0">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0">User Licences </h2>
              <div className="text-right">
                <CButton
                  color="primary"
                  onClick={handleClick}
                >Add Licence</CButton>
              </div>
            </div>


          </CCardHeader>
          <CCardBody>

            {licences ? <table className="table table-striped table-hover">
              <tr >
                <th> Licence Key </th>
                <th> Product </th>
                <th> Expiry </th>
              </tr >
              {
                licences && licences.map((el,index)=> {
                  const expiryDate = el.expiryDate && moment(el.expiryDate).format('DD-MMM-YYYY')
                  return (
                    <tr >
                      <td> {el.id} </td>
                      <td> {el.productName} </td>
                      <td> {expiryDate} </td>
                      <td> <CButton color = "primary" onClick = {()=>{handleEdit(index)}}> Edit </CButton></td>
                      <td> <CButton color = "danger" onClick = {()=>{handleDelete(index)}}> Delete </CButton></td>
                    </tr >
                  )
                })
              }

            </table>
              :
              <div>
                No Data Available
            </div >
            }
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}

export default UserLicences;