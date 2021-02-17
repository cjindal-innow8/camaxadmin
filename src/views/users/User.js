import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CAlert, CLabel } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { getUser, addNewLicenecForUesr, getProducts ,updateUserLicence,deleteUserLicenceKey} from '../../firebase/firebasedb'
import moment from 'moment'
import { generateLicenceKey } from '../../utilities/generateLicence'
import AddLicenceModal from './addLicenceModal'
import Alert from "../../utilities/Alerts"
import { useHistory, useLocation } from 'react-router-dom'
import UserLicences from './userLicences'
const formDetail = {
  licenceKey: "",
  productName: "",
  expiryDate: ""
}
// import usersData from './UsersData'
const User = (props) => {
  console.log("UserUser=", props)
  const history = useHistory()
  const [userData, setUserData] = useState()
  const [licences, setLicences] = useState()
  const [fields, setFields] = useState(formDetail);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [availableProduct, setAvailableProduct] = useState();

  useEffect(() => {
    getUserDeatail()
    getAllProducts()
  }, [])

  const getUserDeatail = async () => {
    const userId = props.match.params.id
    const result = await getUser("uid", userId)
    setUserData(result)
    const licenceObj = result && result[0] && result[0].licence
    const licenceData = licenceObj && Object.values(licenceObj)
    setLicences(licenceData)
  }

  const getAllProducts = async () => {
    const result = await getProducts()
    setAvailableProduct(result)
  }

  const OnAdd = () => {
    const { licenceKey,
    productName,
    expiryDate } = fields
    console.log("fieldsfields OnAdd=",fields)
    if (!licenceKey || !productName ||!expiryDate) {
      Alert(400, "All fields are required!!");
      return
    }
    const data = fields
    if(isEdit){
      updateLicence(data)
    }else {
      addLicence(data)
    }
    setFields(formDetail)
    setIsOpen(false)
  }
  const addLicence = async (data) => {
    const userId = userData && userData[0].uid
    console.log("datadatadata=",data)
    const licenceDetail = {
      id: data.licenceKey,
      expiryDate: data.expiryDate.getTime(),
      productName : data.productName,
      // price: amount,
    };
    console.log("licenceDetaillicenceDetail=",licenceDetail)

    addNewLicenecForUesr(userId, licenceDetail,(res)=>{
      if(res){
      Alert(200, "Licence Added Successfully!!");
      getUserDeatail()
      }
    })
  }

  const updateLicence = (data)=>{
    console.log("updateLicenceupdateLicence=",data)
    const userId = userData && userData[0].uid
    const licenceDetail = {
      id: data.licenceKey,
      expiryDate: (data.expiryDate > 0) ? data.expiryDate :data.expiryDate.getTime(),
      productName : data.productName,
    };
      updateUserLicence(userId,licenceDetail,(res)=>{
        if(res){
          Alert(200, "Licence Updated Successfully!!");
          getUserDeatail()
          }
      })
  }

  const toggleModal = () => {
    setIsOpen(!isOpen)
  }


  const setKeyAndExpiryDate = (key) => {
    const date = new Date()
    const expiryDate =
      new Date(date.setMonth(date.getMonth() + 12))
    setFields({
      ...fields,
      expiryDate: expiryDate,
      licenceKey: key
    })
  }

  const getLicenceKey = async () => {
    const userName = userData && userData[0] && userData[0].username
    const key = await generateLicenceKey(userName)
    setKeyAndExpiryDate(key)
  }

  const changeDate = (date)=>{
    setFields({
      ...fields,
      expiryDate: date
      // licenceKey: key
    })
  }

  const handleChange = (event) => {
    // console.log("eventeventevent=",event)
    console.log("eventevent=", event.target.value)
    const key = event.target.id;
    const value = event.target.value;
    setFields((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleEdit = (index)=>{
    const newArray = licences.slice()
    const data = {
      licenceKey: newArray[index].id,
      productName: newArray[index].productName,
      expiryDate: newArray[index].expiryDate
    }
    setIsEdit(true)
    setFields(data)
    setIsOpen(true)
  }

  const handleDelete = (index)=>{
    const newArray = licences.slice()
    const licenceKey = newArray[index].id
    const userId = userData && userData[0].uid
    deleteLicence(userId,licenceKey)
    
  }

  const deleteLicence =async (userId,licenceKey)=>{
    await deleteUserLicenceKey(userId,licenceKey,(res)=>{
      if(res){
        Alert(200, "Licence Deleted Successfully!!");
        getUserDeatail()
      }
    })
  }
  
  const handleClick = async () => {
    setIsOpen(true)
    setIsEdit(false)
    getLicenceKey()
  }

  console.log("fieldsfieldsfields=", fields)


  return (
    <>
      <CRow>
        <CCol lg={8}>

          <CButton
            color="primary"
            onClick={() => { props.history.push('/users') }}
            className={'mb-1'}
          >Back</CButton>

          <CCard>

            <CCardHeader>
              <h2>Basic Details </h2>
            </CCardHeader>
            <CCardBody>
              <div className="user-details-wrapper">
                <p> <CLabel> FullName : </CLabel> <span> {userData && userData[0] && userData[0].username}</span> </p>
                <p> <CLabel> Email : </CLabel> <span>{userData && userData[0] && userData[0].email}</span> </p>
                <p> <CLabel> Phone : </CLabel>  <span>{userData && userData[0] && userData[0].phone || "9876543210"}</span>  </p>
                <p> <CLabel> Address : </CLabel><span> {userData && userData[0] && userData[0].address}</span>  </p>
                <p> <CLabel> City : </CLabel> <span> {userData && userData[0] && userData[0].city}</span>  </p>
                <p> <CLabel> State: </CLabel>  <span> {userData && userData[0] && userData[0].state} </span></p>
                <p> <CLabel> Country : </CLabel>  <span> {userData && userData[0] && userData[0].country} </span></p>
                <p> <CLabel> GSTInNumber : </CLabel>  <span> {userData && userData[0] && userData[0].gstInNumber} </span></p>
                <p> <CLabel> CompanyName : </CLabel>  <span> {userData && userData[0] && userData[0].companyName} </span></p>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <UserLicences licences={licences} handleClick={handleClick} handleEdit = {handleEdit} handleDelete = {handleDelete}/>
          <AddLicenceModal isOpen={isOpen} availableProduct={availableProduct} values={fields} isEdit={isEdit}
          handleChange={handleChange} toggleModal={toggleModal} OnAdd={OnAdd} changeDate = {changeDate} />
        </CCol>
      </CRow>
    </>
  )
}

export default User
