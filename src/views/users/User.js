import React,{useEffect,useState} from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow,CButton,CAlert} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {getUser,addNewLicenecForUesr} from '../../firebase/firebasedb'
import moment from 'moment'
import {generateLicenceKey} from '../../utilities/generateLicence'
import AddLicenceModal from './addLicenceModal'
import Alert from "../../utilities/Alerts"
const formDetail = {
  productName : '',
  amount : '',
}
// import usersData from './UsersData'
const User = ({match}) => {
  const [userData, setUserData] = useState()
  const [licence, setLicence] = useState()
  const [fields, setFields] = useState(formDetail);
  const [isOpen, setIsOpen] = useState(false);

    useEffect(()=>{
     getUserDeatail()
    },[])
    const getUserDeatail =async()=>{
     const result =  await getUser("uid",match.params.id)
     setUserData(result)
    }

    const OnAdd = ()=>{
      const {productName,amount} = fields
      if(!productName||!amount){
      Alert(400, "All fields are required!!");
        return 
      }
      const data = fields
      addLicence(data)
      setFields(formDetail)
      setIsOpen(false)
    
    }
    const addLicence = async (data)=>{
      const userName = userData && userData[0].username
      const userId = userData && userData[0].uid
      console.log("userNameuserName=",userName)
      const licenceNo = await generateLicenceKey(userName)
      const date = new Date()
      const expiryDate =
      new Date(date.setMonth(date.getMonth()+12))
      const productName=data.productName
      const amount =data.amount
      const licenceDetail = {
            id: licenceNo,
            expiryDate : expiryDate.getTime(),
            productName,
            price: amount,
          };
          console.log("licenceNolicenceNo=",licenceNo)
          addNewLicenecForUesr(userId,licenceDetail)


    }
    const toggleModal =()=>{
      setIsOpen(!isOpen)
    }

    const handleChange = (event) => {
      const key = event.target.id;
      const value = event.target.value;
      setFields((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    };


const licenceObj = userData &&  userData[0].licence
const licences = licenceObj && Object.values(licenceObj)
const expiredLicences = licences && licences.filter((data)=>{
  const currentDate= moment(new Date().getTime()) 
  const expiryDate = moment(data.expiryDate)
  return (expiryDate<currentDate)
})

    const handleClick = async ()=>{
      setIsOpen(true)
    }
  return (
    <CRow>
      <CCol lg={6}>
        
      <CButton
              color="primary"
              onClick={handleClick}
              className={'mb-1'}
            >Add Licence</CButton>
        <CCard>
      
          <CCardHeader>
            User id: {match.params.id}
          </CCardHeader>
          <CCardBody>
              <table className="table table-striped table-hover">
                <tbody>
                  <tr> 
                    <th>Name </th>
                    <th>Email </th>
                    <th>GSTInNumber </th>
                  </tr>
                  {
                   userData && userData.map((el, index) => {
                    //  console.log("[el.userName]",[el.username],el.username)
                      return (
                        <tr key={index}> 
                          <td><strong>{el.username}</strong></td>
                          <td><strong>{el.email}</strong></td>
                          <td><strong>{el.gstInNumber}</strong></td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
             
          </CCardBody>
        </CCard>
          <p> Total licence </p>
              <ul> 
             { licences && licences.map(el=>{
               return <li>{el.id} </li>
             })}
              </ul>
              <p> Expired licence </p>
              <ul> 
             { expiredLicences && expiredLicences.map(el=>{
               return <li>{el.id} </li>
             })}
              </ul>
      </CCol>
      <AddLicenceModal isOpen = {isOpen} handleChange= {handleChange} values = {fields} toggleModal={toggleModal} OnAdd = {OnAdd}/>
    </CRow>
  )
}

export default User
