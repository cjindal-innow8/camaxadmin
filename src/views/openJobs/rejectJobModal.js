import React from 'react';
import {
  CButton,
  CInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTextarea,
} from '@coreui/react'
function RejectJobModal(props) {
  const {isOpen,changeStatus,rejectionReason,setRejectionReason,toggleRejectModal} = props
 const handleChange = (e)=>{
     const value = e.target.value
     setRejectionReason(value)
 }
  return (
    <div>
       <CModal 
              show={isOpen} 
              onClose={toggleRejectModal}
              centered
              className="accept-modal"
            >
              <CModalHeader closeButton>
                <CModalTitle>  </CModalTitle>
              </CModalHeader>
              <CModalBody>
               <h2> Are you sure? <br />You want to reject this job request </h2>
               <label> Reason <span className="required">*</span></label>
               <CTextarea type = "textarea" value = {rejectionReason} onChange = {handleChange}/>
               <div className="text-center accept-buttons mt-3"> <CButton color = "success" onClick = {changeStatus}> OK  </CButton>
                <CButton color = "secondary" className="ml-3" onClick = {()=>{
                  toggleRejectModal()
                  setRejectionReason('')
                  }}> Cancel </CButton></div>
              
                
              </CModalBody>
            
            </CModal>
    </div>
  );
}

export default RejectJobModal;