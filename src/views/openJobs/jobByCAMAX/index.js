import React , { useEffect, useState } from 'react';
import JobContainer from './component'
import {getAllPostByCAMAX,updateCAMAXPost,deleteCAMAXPost} from '../../../firebase/firebasedb'
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
   <JobContainer jobs = {jobs}  deleteJob = {deleteJob} 
   toggle = {toggle}
   editJob = {editJob} isOpen= {isOpen} handleChange = {handleChange} values = {fields} isUpdate = {true} updateJob = {updateJob} toggleJob= {toggleJob} getJob={getJob}/>
  );
  
}

export default JobByCAMAX;