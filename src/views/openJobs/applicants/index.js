import React , {useEffect,useState}from 'react';
import ApplicantContainer from './component'
import {getAllApplicants} from '../../../firebase/firebasedb'
function Applicants(props) {
  const [applicantsDetail , setApplicantsDetail] = useState([])

  useEffect(()=>{
    getApplicantsDetail()
  },[])
  const getApplicantsDetail = async()=>{
   const data = await  getAllApplicants()
   setApplicantsDetail(data)
  }
  return (
    <ApplicantContainer data = {applicantsDetail}/>
  );
}

export default Applicants;