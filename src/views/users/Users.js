import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Loader from '../../utilities/loader/index.js'
import Pagination from "react-js-pagination";
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
import {getAllUsers,getTotalUser} from '../../firebase/firebasedb'
let intialData ;
let limit = 10
const Users = (props) => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const [page, setPage] = useState(1)
  const [totaldata, setTotalData] = useState()
  const [usersData,setuserData] = useState([])
  const [headings , setHeadings] = useState([])
 const [isLoading, setIsLoading] = useState(false)
  const getUserData = async(pageNumber)=>{
    setIsLoading(true)
    const offset = (pageNumber - 1) *  limit 
    let lastPage = page
    const result = await getAllUsers(offset,limit,lastPage,pageNumber)
    intialData = result
    setuserData(result)
    setIsLoading(false)
    // setTotalData(result.totalData)
  }
  const getUserCount = async ()=>{
    setIsLoading(true)
    const result = await getTotalUser()
    setTotalData(result.totalData)
    setIsLoading(false)
  }
  useEffect(()=>{
    getUserCount()
    getUserData(page)
  },[])
  
  const pageChange = (pagenumber)=>{
    setPage(pagenumber)
    getUserData(pagenumber)

  }

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
    {isLoading && <Loader/>}
   { (usersData && usersData.length > 0) ?  
   <>
   <table className="table table-striped table-hover">
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
              <td> {phone?phone:'--'} </td>
              <td> {companyName || "--"} </td>
              <td> {gstInNumber || '--'} </td>
            </tr>
            )
          })
        }
     </table>
     <Pagination
     className="mt-3 mx-auto w-fit-content"
     itemClass="page-item"
     linkClass="page-link"
     activeClass="active"
     activePage={page}
     itemsCountPerPage={limit}
     totalItemsCount={totaldata}
    //  pageRangeDisplayed={5}
     onChange={pageChange}
   />
   </>
     : <div> 
      No Data
      </div>
     }
    </div>
  )
}

export default Users
