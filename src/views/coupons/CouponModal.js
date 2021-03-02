import {
  CButton,
  CInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import React from 'react';

function AddCouponModal({handleChange,isOpen, values,toggleModal,OnAdd,isEdit}) {
  return (
    <div>
      <CModal 
              show={isOpen} 
              onClose={toggleModal}
            >
              <CModalHeader closeButton>
                <CModalTitle>Add Coupon</CModalTitle>
              </CModalHeader>
              <CModalBody>
               <CInput id = "couponName" placeholder = "Coupon Name" onChange = {handleChange} value = {values.couponName}/>
               <CInput id = "amount" type = "number" placeholder = "Coupon Amount" onChange = {handleChange} value = {values.amount}/>
              </CModalBody>
              <CModalFooter>
                <CButton color="primary" type = "number" onClick = {OnAdd} >{!isEdit ? "Add":"Update"}</CButton>{' '}
                <CButton 
                  color="secondary" 
                  onClick={toggleModal}
                >Cancel</CButton>
              </CModalFooter>
            </CModal>
    </div>
  );
}

export default AddCouponModal;

