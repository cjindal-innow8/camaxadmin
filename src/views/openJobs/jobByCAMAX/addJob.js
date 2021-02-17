import React from 'react';
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

 const inputFiels = {
  jobTitle : {
    id: "jobTitle",
    label: "JobTitle",
    type: "text",
    fieldType: "input",
    col : 6
  },
  experience : {
    id: "experience",
    label: "Experience",
    type: "text",
    fieldType: "input",
    col : 6
  },
  }

function AddJob(props) {
  const { isOpen, onToggle, values,onChange,onAdd,isUpdate,updateJob,} = props
  return (
    <div>
      
   <CModal
       show={isOpen} 
       onClose={onToggle}
      centered
    >
       <CModalHeader closeButton>
                <CModalTitle>Add New JOB</CModalTitle>
              </CModalHeader>
      <CModalBody>
        
          <CRow>
            {inputFiels && Object.keys(inputFiels).map(key => {
              const field = inputFiels[key]
              return (
                <CCol >
                  <label>{field.label} <span className="required">*</span></label>
                  <CInput 
                    value={values[key]}
                    type={field.type} 
                    onChange={onChange}
                    id={field.id}/>
                </CCol>
              )
            })}
          </CRow>
          <div className="mt-3 text-center add-btn">
          <CButton color = "primary" onClick = {()=>{
           if(!isUpdate){
             onAdd()
           }else{
            updateJob()
           }
          }
            }> {isUpdate ? "Update":"Add"}</CButton>
          </div>
         
       
      </CModalBody>
    </CModal>

    </div>
  );
}

export default AddJob;