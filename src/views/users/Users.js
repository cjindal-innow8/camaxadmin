import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CInput
} from '@coreui/react'
import {getAllUsers} from '../../firebase/firebasedb'
// import usersData from './UsersData'
// {id: 0, name: 'John Doe', registered: '2018/01/01', role: 'Guest', status: 'Pending'}
const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}
let intialData ;
const Users = (props) => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [usersData,setuserData] = useState([])
  const [headings , setHeadings] = useState([])
 
  const getUserData = async()=>{
    const result = await getAllUsers()
    console.log("getAllUsersgetAllUsers=",result)
    intialData = result
    setuserData(result)
  }
  useEffect(()=>{
    console.log("useEffectuseEffect")
    getUserData()
  },[])

  const goToUser = (user)=>{
    console.log("useruser=",user)
    props.history.push(`/user/${user.uid}`)
  }

  const handleSearch = (e)=>{
   const value = e.target.value
   if(value.length >= 3){
    const nameFilter = usersData.filter(el=>{
      const username = el.username.toLowerCase()
      const val = value.toLowerCase()
      return username.includes(val)
    })
    const  emailFilter = usersData.filter(el=>{
      const email = el.email.toLowerCase()
      const val = value.toLowerCase()
      return email.includes(val)
    })
    const  phoneFiter = usersData.filter(el=>{
      const phone = el.phone && el.phone.toString().toLowerCase() ||''
      const val = value.toLowerCase()
      return phone.includes(val)
    })
    console.log("nameFilternameFilter=",nameFilter,emailFilter)
    const dataToSet =( nameFilter && nameFilter.length > 0) ? nameFilter : (emailFilter && emailFilter.length > 0) ? emailFilter : (phoneFiter && phoneFiter.length > 0) ? phoneFiter :[]
    setuserData(dataToSet)
   }else{
    setuserData(intialData)
   }
  }

  
  return (
   <div>
     <div>
     <CInput className="search-input" onChange = {handleSearch} placeholder = "Search" />
     </div>
   { (usersData && usersData.length > 0) ?  <table className="table table-striped table-hover">
        <tr >
          <th> FullName </th>
          <th> Email </th>
          <th> Phone </th>
          <th> Company Name </th>
          <th> GSTInNumber </th>
        </tr >
        {
          usersData && usersData.map((user, index) => {
            const { username, email, companyName, phone ,gstInNumber} = user
            return (
            <tr key = {index} onClick = {()=>{goToUser(user)}}>
              <td> {username} </td>
              <td> {email} </td>
              <td> {phone?phone:'0987654321'} </td>
              <td> {companyName} </td>
              <td> {gstInNumber} </td>
            </tr>
            )
          })
        }
     </table>
     : <div> 
      No Data
      </div>
     }
    </div>
  )
}

export default Users
