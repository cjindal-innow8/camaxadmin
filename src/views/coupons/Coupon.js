import React, {useState,useEffect} from 'react';
import AddCouponModal from './CouponModal'
import Alert from '../../utilities/Alerts'
import {addCoupon,getAllCoupons} from '../../firebase/firebasedb'
import DisplayCoupons from './DisplayCoupons'
import {
  CButton,
} from '@coreui/react';
const formDetail = {
  couponName : '',
  amount : '',
}
function AddCoupons(props) {
  const [isOpen, setIsOpen]= useState(false)
  const [fields, setFields] = useState(formDetail);
  const [coupons, setCoupons] = useState([]);
  useEffect(()=>{
    getCoupons()
  })
  const editCoupon = (index)=>{
    const newArray = coupons.slice()
    console.log("newArray[index]=",newArray[index])
    const data = {
      amount: newArray[index].amount, 
      couponName: newArray[index].couponName
    }
  setIsOpen(true)
  setFields(data)
  }
  const getCoupons = async ()=>{
    const result = await getAllCoupons()
    setCoupons(result)
  }
  const handleChange = (event) => {
    const key = event.target.id;
    const value = event.target.value;
    // console.log("keykeykey=",key,value)
    setFields((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const handleAdd = ()=>{
   
    const {couponName, amount} = fields;
    if (!couponName || !amount 
    ) {
      Alert(400, "All fields are required !!");
      return;
    }
    const data = fields
    addCoupon(data,(res)=>{
      if(res){
      Alert(200, "Coupon Added Successfully!!");
      }
    })
    setFields(formDetail)
    setIsOpen(false)
  }
  const toggleModal = ()=>{
    setIsOpen(!isOpen)
  }

 const deleteCoupon = ()=>{

 }
  // console.log("formDetailformDetail=",formDetail)

  return (
    <div>
    <CButton onClick = {()=>{setIsOpen(true)}}> Add Coupon </CButton>
    <AddCouponModal handleChange= {handleChange} isOpen= {isOpen} values= {fields} toggleModal={toggleModal} OnAdd = {handleAdd}/>
    <DisplayCoupons coupons={coupons} editCoupon = {editCoupon} deleteCoupon = {deleteCoupon}/>
    </div>
  );
}

export default AddCoupons;