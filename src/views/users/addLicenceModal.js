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
} from '@coreui/react'
import React from 'react';

function AddLicenceModal({handleChange,isOpen, values,toggleModal,OnAdd}) {
  return (
    <div>
      <CModal 
              show={isOpen} 
              onClose={toggleModal}
            >
              <CModalHeader closeButton>
                <CModalTitle>Add licence</CModalTitle>
              </CModalHeader>
              <CModalBody>
               <CInput id = "productName" placeholder = "Product Name" onChange = {handleChange} value = {values.productName}/>
               {/* <CInput placeholder = "Product Id"/> */}
               <CInput id = "amount" placeholder = "Product Amount" onChange = {handleChange} value = {values.amount}/>
              </CModalBody>
              <CModalFooter>
                <CButton color="primary" type = "number" onClick = {OnAdd} >Add</CButton>{' '}
                <CButton 
                  color="secondary" 
                  onClick={toggleModal}
                >Cancel</CButton>
              </CModalFooter>
            </CModal>
    </div>
  );
}

export default AddLicenceModal;

