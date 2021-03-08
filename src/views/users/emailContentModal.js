import React , {useState,useEffect}from 'react';
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CModalTitle,
  CButton,
  CTextarea
} from '@coreui/react'
import Alert from '../../utilities/Alerts'
import {getAllUsersEmail} from '../../firebase/firebasedb'
import {sendMail} from '../../utilities/sendEmail'

function EmailContentModal({isOpen, toggleModal}) {
  
  const [content, setContent] = useState();
  const [allEmails, setAllEmail] = useState()
  useEffect(()=>{
  getEmails()
  },[])

  const getEmails = async()=>{
    const  result  = await getAllUsersEmail()
    setAllEmail(result)
  }

  const handleChange = (e)=>{
    setContent(e.target.value)
  }

  const handleSend = ()=>{
    if(!content){  
      Alert(400,'Please enter email content!!')
      return;
    }
    sendEmailToAll()
  }

  const sendEmailToAll = async ()=>{
    console.log("allEmailsallEmails sendEmailToAll",allEmails)
    const  emailContent = `<div> <p>${content}</p></div>`;
    allEmails && allEmails.forEach((email) =>{
      console.log("emailemail=",email)
          sendMailToUser({email,emailContent})
    })
  }


  const sendMailToUser = ({email,emailContent})=>{

    const data = {
      from :"mmahajaninnow8@gmail.com",
      to: email,
      subject: "CA MAX",
      content : emailContent,
    };
  console.log("emailContentemailContent=",emailContent)
  console.log("datadatadatadata=",data)
    sendMail(data)
    .then(() => {
      console.log("email send to =",email )
      // Alert(200, "Email sent successfully.");
    })
    .catch(() => {
      // Alert(400, "Unable to send email at this time.");
    });
  
  }
  console.log("allEmailsallEmails=",allEmails)

  return (
    <CModal 
    show={isOpen} 
     onClose={toggleModal}
    centered
    >
      <CModalHeader closeButton>
                {/* <CModalTitle>Add Coupon</CModalTitle> */}
              </CModalHeader>
      <CModalBody>
        <CTextarea placeholder = "Enter eamil content" value = {content} onChange= {handleChange}/>
        <CButton color = "primary" onClick = {handleSend}> Send</CButton>
      </CModalBody>
    </CModal>
  );
}

export default EmailContentModal;