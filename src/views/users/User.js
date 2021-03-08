import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CAlert, CLabel } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { getUser, addNewLicenceForUesr, getProducts ,updateUserLicence,deleteUserLicenceKey,userLicences} from '../../firebase/firebasedb'
import moment from 'moment'
import { generateLicenceKey } from '../../utilities/generateLicence'
import AddLicenceModal from './addLicenceModal'
import Alert from "../../utilities/Alerts"
import { useHistory, useLocation } from 'react-router-dom'
import UserLicences from './userLicences'
import Loader from '../../utilities/loader/index.js'
const formDetail = {
  licenceKey: "",
  productName: "",
  expiryDate: "",
  amcAmount : "",
}
// import usersData from './UsersData'
const User = (props) => {
  const history = useHistory()
  const [userData, setUserData] = useState()
  const [licences, setLicences] = useState()
  const [fields, setFields] = useState(formDetail);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [availableProduct, setAvailableProduct] = useState();
  const [selectedProduct , setSelectedProduct ] = useState()
 
  useEffect(() => {
    getUserDeatail()
    getAllProducts()
    
  }, [])

  const getUserLicences = async ()=>{
    const userId = props.match.params.id
    const result = await userLicences(userId)
    setLicences(result)
  }

  const getUserDeatail = async () => {
    setIsLoading(true)
    const userId = props.match.params.id
    const result = await getUser("uid", userId)
    setUserData(result)
    // const licenceObj = result && result[0] && result[0].licence
    // const licenceData = licenceObj && Object.values(licenceObj)
    // setLicences(licenceData)
    setIsLoading(false)
    getUserLicences()

  }

  const getAllProducts = async () => {
    setIsLoading(true)
    const result = await getProducts()
    setAvailableProduct(result)
    setIsLoading(false)
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
    console.log("datadata=",data)
    if(isEdit){
      updateLicence(data)
    }else {
      addLicence(data)
    }
    setFields(formDetail)
    setSelectedProduct()
    setIsOpen(false)
  }
  const addLicence = async (data) => {
    const userId = userData && userData[0].uid
    const licenceDetail = {
      id: data.licenceKey,
      expiryDate: data.expiryDate.getTime(),
      productName : data.productName,
      amcAmount: data.amcAmount,
    };
    addNewLicenceForUesr(userId, licenceDetail,(res)=>{
      if(res){
      Alert(200, "Licence Added Successfully!!");
      getUserDeatail()
      }
    })
  }

  const updateLicence = (data)=>{
    const userId = userData && userData[0].uid
    const licenceDetail = {
      id: data.licenceKey,
      // expiryDate: (data.expiryDate > 0) ? data.expiryDate :data.expiryDate.getTime(),
      expiryDate:  data.expiryDate.getTime() ? data.expiryDate.getTime() : data.expiryDate,
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
    setSelectedProduct(event)
    setFields((prevState) => ({
      ...prevState,
      productName: event.value,
      amcAmount : event.amount,
    }));
  };

  const handleEdit = (index)=>{
    const newArray = licences.slice()
    // console.log("newArraynewArray=",newArray)
    const data = {
      licenceKey: newArray[index].id,
      productName: newArray[index].productName,
      expiryDate: newArray[index].expiryDate,
      amcAmount : newArray[index].amcAmount
    }
    setSelectedProduct({label:data.productName})
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

  return (
    <>
   {isLoading && <Loader/>}
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
                <p> <CLabel> Phone : </CLabel>  <span>{userData && userData[0] && userData[0].phone || "--"}</span>  </p>
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
          <AddLicenceModal isOpen={isOpen} availableProduct={availableProduct} values={fields} isEdit={isEdit} selectedProduct = {selectedProduct}
          handleChange={handleChange} toggleModal={toggleModal} OnAdd={OnAdd} changeDate = {changeDate} />
        </CCol>
      </CRow>
    </>
  )
}

export default User
