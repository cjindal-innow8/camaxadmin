import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSelect,
} from '@coreui/react'
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddLicenceModal(props) {
  const { handleChange, availableProduct, isOpen, values,toggleModal, OnAdd, changeDate, isEdit} = props
  const [products, setProducts] = useState([])
  useEffect(() => {
    if (props.availableProduct) {
      console.log("useEffectuseEffectuseEffect=", availableProduct)
      const data = availableProduct.map(el => {
        return el.productName
      })
      setProducts(data)
    }
  }, [props])

  console.log("valuesvaluesvalues=", values)
  return (
    <div>
      <CModal
        show={isOpen}
        onClose={toggleModal}
        centered
      >
        <CModalHeader closeButton>
          <CModalTitle>Add licence</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p> Licence Key <CInput value={values.licenceKey} readOnly = {true}/> </p>
          <p> Products  <CSelect custom name="product" id="productName" value = {values.productName} onChange={handleChange} disabled = {isEdit}>
          <option value={""}>- Select Product-</option>
            {
              products && products.map(el => {
                
                return <option value={el}>{el}</option>
              })
            }

          </CSelect> 
          
          <p> ExpiryDate   : </p><DatePicker className="form-control" selected={values.expiryDate} onChange={changeDate} />
          </p>

          {/* <Calendar
            onChange={changeDate}
            id="expiryDate"
            value={values.expiryDate}
          /> */}



        </CModalBody>
        <CModalFooter>
          <CButton color="primary" type="number"
            onClick={OnAdd}
          >
            Save
                </CButton>{' '}
          {/* <CButton 
                  color="secondary" 
                  onClick={toggleModal}
                >Cancel</CButton> */}
        </CModalFooter>
      </CModal>
    </div>
  );
}

export default AddLicenceModal;

