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
} from '@coreui/react'
function AcceptJobModal(props) {
  const {isOpen,changeStatus,toggleAcceptModal} = props
  return (
    <div>
       
      <CModal 
              show={isOpen} 
              onClose={toggleAcceptModal}
              centered
              className="accept-modal"
            >
              <CModalHeader closeButton>
                <CModalTitle>  </CModalTitle>
              </CModalHeader>
              <CModalBody>
               <h2> Are you sure? <br/>You want to accept this job request </h2>
               <div className="text-center accept-buttons">
               <CButton color = "success" onClick = {changeStatus} className="mr-3"> OK  </CButton>
                <CButton color = "secondary" onClick = {toggleAcceptModal}> Cancel </CButton>
               </div>
               
              </CModalBody>
         
               
                
           
            </CModal>
  
    </div>
  );
}

export default AcceptJobModal;