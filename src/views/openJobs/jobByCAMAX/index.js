import React , { useEffect, useState } from 'react';
import JobContainer from './component'
import {
  CButton
 } from '@coreui/react'
import {getAllPostByCAMAX,updateCAMAXPost,deleteCAMAXPost,addCAMAXPost} from '../../../firebase/firebasedb'
import Alert from '../../../utilities/Alerts'
const formDetail = {
  jobTitle : '',
  experience : '',
}
function JobByCAMAX(props) {
  const [jobs, setJobs] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [fields, setFields] = useState(formDetail);
  const [idToUpdate, setIdToUpdate] = useState()
  const [isUpdate, setIsUpdate] = useState(false)
  const {toggleJob,getJob} = props
  useEffect(() => {
    getCAMAXPost ()
  }, [])
  const getCAMAXPost = async()=>{
    const result =  await getAllPostByCAMAX()
    setJobs(result)
   }
   const updateJob = async()=>{
    //  console.log("updateJobupdateJob=",updateJob)
  const {jobTitle,experience} = fields
  if(!jobTitle||!experience){
    Alert(400,"All fields are required!!")
    return 
  }

    await updateCAMAXPost({id: idToUpdate, data: fields},(res)=>{
      if(res){
       Alert(200,"Post edited Successfully !!")
        getCAMAXPost()
      }
    })
    setFields(formDetail)
    setIsOpen(false)
 }
 const toggle = ()=>{
  setIsOpen(!isOpen)
}

const editJob = (index)=>{
  const newArray = jobs.slice()
  let job = newArray[index]
  setFields({
    jobTitle : job.jobTitle,
    experience : job.experience
  })
  setIsOpen(true)
  setIdToUpdate(job.id)
  setIsUpdate(true)
}
const handleAdd = ()=>{
  const {jobTitle, experience} = fields;
  if (!jobTitle || !experience 
  ) {
    Alert(400, "All fields are required !!");
    return;
  }
  const data = fields
   addCAMAXPost(data,(res)=>{
    if(res){
    Alert(200, "Job Added Successfully!!");
    getCAMAXPost ()
    }
  })
  setFields(formDetail)
  setIsOpen(false)
}

const handleChange = (event) => {
  const key = event.target.id;
  const value = event.target.value;
  setFields((prevState) => ({
    ...prevState,
    [key]: value,
  }));
};

 const  deleteJob = (index)=>{
  const newArray = jobs.slice()
  let job = newArray.splice(index,1)
  const id = job[0].id
  setJobs(newArray)
  deleteCAMAXPost(id,(res)=>{
    if(res){
      Alert(200,"Post deleted Successfully !!")
    }
  })
}

   return (
     <>
     <div className="text-right my-2">
     <CButton color = "primary" onClick = {()=>{
       setIsOpen(true)
       setFields(formDetail)
       setIsUpdate(false)
       }}> Add Job </CButton>
     </div>
    
   <JobContainer jobs = {jobs}  deleteJob = {deleteJob} 
   toggle = {toggle}
   editJob = {editJob} isOpen= {isOpen} handleChange = {handleChange} values = {fields} isUpdate = {isUpdate} updateJob = {updateJob} toggleJob= {toggleJob} getJob={getJob} onAdd = {handleAdd}/>
   </>
  );
  
}

export default JobByCAMAX;