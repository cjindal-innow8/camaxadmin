import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { useHistory, useLocation } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Alert from '../../../utilities/Alerts'
import {addAdminTable,loginAdmin} from '../../../firebase/firebasedb'

const Login = (props) => {
  const history = useHistory()
  const[username, setUserName] = useState('')
  const[password, setPassword] = useState('')

  const handleChange = (e)=>{
 const key = e.target.id
 const value = e.target.value
 if(key === "username"){
  setUserName(value)
 } else if(key === "password"){
  setPassword(value)
 }
  }

  const handleLogin = async()=>{
  if(!username|| !password){
    Alert(400, "All fields are required !!");
    return;
  }
  let data = {
    username,
    password,
  }
  const isVlidAdmin = await loginAdmin(data)
  console.log("isVlidAdminisVlidAdminisVlidAdmin=",isVlidAdmin)
  if(isVlidAdmin){
    localStorage.setItem("isLogin",true)
    props.history.push("/users")
  }else {
    return Alert(400, "Please enter correct username or password ");
  }
    
    
  }

  // const handleLoginData = ()=>{
  //   addAdminTable()
  // }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="Username" id = "username" autoComplete="username" onChange = {handleChange}/>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Password" id = "password" autoComplete="current-password"  onChange= {handleChange} />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" className="px-4" onClick = {handleLogin}>Login</CButton>
                      </CCol>
                      {/* <CCol xs="6">
                        <CButton color="primary" className="px-4" onClick = {handleLoginData}>LoginData</CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
