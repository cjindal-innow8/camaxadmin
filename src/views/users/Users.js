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
  CPagination
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

const Users = () => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [usersData,setuserData] = useState([])
  const [headings , setHeadings] = useState([])
  const title =  ["username","email","companyName","gstInNumber"]

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/users?page=${newPage}`)
  }
  const getUserData = async()=>{
    const result = await getAllUsers()
    console.log("getAllUsersgetAllUsers=",result)
    // console.log("titletitletitle=",title)
    // Object.delete("address")
    setuserData(result)
  }
//   0: "address"
// 1: "city"
// 2: "companyName"
// 3: "country"
// 4: "email"
// 5: "gstInNumber"
// 6: "role"
// 7: "state"
// 8: "uid"
// 9: "username"

  const handleClick = async ()=>{
    console.log("handleClick")
    const result = await getAllUsers()
    console.log("getAllUsersgetAllUsers=",result)
  }
  useEffect(()=>{
    console.log("useEffectuseEffect")
    getUserData()
  },[])

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page])
  
  return (
    <CRow>
      <CBadge onClick = {handleClick} color='success'>
                      test
                    </CBadge>
      <CCol xl={6}>
        <CCard>
          <CCardHeader>
            Users
            <small className="text-muted"> example</small>
          </CCardHeader>
          <CCardBody>
          <CDataTable
            items={usersData}
            // fields={[
            //   { key: 'name', _classes: 'font-weight-bold' },
            //   'registered', 'role', 'status'
            // ]}
            fields={[
             ...title
            ]}
            hover
            striped
            itemsPerPage={5}
            activePage={page}
            clickableRows
            onRowClick={(item) => history.push(`/users/${item.uid}`)}
            scopedSlots = {{
              'status':
                (item)=>(
                  <td>
                    {console.log("{getBadge(item.status)=",getBadge(item.status))}
                    <CBadge color={getBadge(item.status)}>
                      {item.status}
                    </CBadge>
                  </td>
                )
            }}
          />
          <CPagination
            activePage={page}
            onActivePageChange={pageChange}
            pages={5}
            doubleArrows={false} 
            align="center"
          />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Users
