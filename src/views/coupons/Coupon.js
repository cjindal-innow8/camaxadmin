import React, {useState,useEffect} from 'react';
import AddCouponModal from './CouponModal'
import Alert from '../../utilities/Alerts'
import {addCoupon,getAllCoupons,updateCoupon,deleteCoupon} from '../../firebase/firebasedb'
import DisplayCoupons from './DisplayCoupons'
import {
  CButton,
} from '@coreui/react';
import Loader from '../../utilities/loader/index.js'

const formDetail = {
  couponName : '',
  amount : '',
}

function AddCoupons(props) {
  const [isOpen, setIsOpen]= useState(false)
  const [fields, setFields] = useState(formDetail);
  const [coupons, setCoupons] = useState([]);
  const [idToUpdate, setIdToUpdate] = useState()
  const [isEdit, setEdit] = useState(false)
  const [isLoading, setLoading ] = useState(false)

  useEffect(()=>{
    getCoupons()
  },[])
  const editCoupon = (index)=>{
    const newArray = coupons.slice()
    let coupon = newArray[index]
    const data = {
      amount: newArray[index].amount, 
      couponName: newArray[index].couponName
    }
  setIsOpen(true)
  setFields(data)
  setEdit(true)
  setIdToUpdate(coupon.id)
  }
  const getCoupons = async ()=>{
    setLoading(true)
    const result = await getAllCoupons()
    setLoading(false)
    setCoupons(result)
  }
  const handleChange = (event) => {
    const key = event.target.id;
    const value = event.target.value;
    setFields((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const handleAdd = async ()=>{
   
    const {couponName, amount} = fields;
    if (!couponName || !amount 
    ) {
      Alert(400, "All fields are required !!");
      return;
    }
    const data = fields
    if(isEdit){
      setLoading(true)
     await  updateCoupon({id: idToUpdate, data},(res)=>{
      if(res){
        setLoading(false)
        Alert(200,"Coupon edited Successfully !!")
        getCoupons()
       }
     })

    }else {
      setLoading(true)
      addCoupon(data,(res)=>{
        if(res){
        Alert(200, "Coupon Added Successfully!!");
        getCoupons()
        }
      })
      setLoading(false)

    }
   
    setFields(formDetail)
    setIsOpen(false)
  }
  const toggleModal = ()=>{
    setIsOpen(!isOpen)
  }

 const removeCoupon =  async (index)=>{
  const newArray = coupons.slice()
  let coupon = newArray[index]
  // console.log("newArraynewArray=",coupon)
  // console.log("couponcouponcouponcoupon=",coupon.id)
  let id = coupon && coupon.id
  deleteCoupon(id, (res)=>{
    if(res){
      Alert(400, "Coupon deleted Successfully!!");
      getCoupons()
      }
  })
 }
  // console.log("formDetailformDetail=",for mDetail)

  return (
    <div>
 { isLoading &&  <Loader/>}
    <CButton color="primary" onClick = {()=>{
      setIsOpen(true)
      setEdit(false)
      }}> Add Coupon </CButton>
    <AddCouponModal handleChange= {handleChange} isOpen= {isOpen} values= {fields} toggleModal={toggleModal} OnAdd = {handleAdd} isEdit = {isEdit}/>
    <DisplayCoupons coupons={coupons} editCoupon = {editCoupon} deleteCoupon = {removeCoupon} />
    </div>
  );
}

export default AddCoupons;