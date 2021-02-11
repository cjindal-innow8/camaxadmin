import React,{useEffect,useState} from 'react';

function ApplicantContainer(props) {
  const {data} = props
  const [headings, setHeadings] = useState()
  useEffect(()=>{
    console.log("Monika monika =",data)
   if(data.lenght > 0){
    const firstEntry =  data.lenght ? data[0] : null
    const heading = firstEntry &&  Object.keys(firstEntry)
    const newHeadings= headings.map(el=>{
      return (el.charAt(0).toUpperCase() + el.slice(1))
    })
    setHeadings(newHeadings)
   }
  },[data])
  return (
    <div>
      <table className="table table-striped table-hover">
        <tr >
          <td> Name </td>
          <td> Email </td>
          <td> Position </td>
          <td> About </td>
        </tr>
        {
          data && data.map((employee, index) => {
            const { about,email,position, firstName,file,lasttName } = employee
            return (<tr key = {index}>
              <td> {firstName} </td>
              <td> {email} </td>
              <td> {position} </td>
              <td> {about} </td>
            </tr>)
          })
        }
        </table>
    </div>
  );
}

export default ApplicantContainer;