import React from 'react';
import {
  CButton
 } from '@coreui/react'
function DisplayCoupons(props) {
  const {coupons,editCoupon,deleteCoupon} = props 
  return (
    <div>
       <table className="table table-striped table-hover">
        <tr >
          <td> Name </td>
          <td> Amount </td>
        </tr>
        {
          coupons && coupons.map((el, index) => {
            const {couponName, amount } = el
            return (<tr key = {index}>
              <td> {couponName} </td>
              <td> {amount} </td>
              <td> <CButton color = "primary" onClick = {()=>{editCoupon(index)}}> Edit</CButton> </td>
              <td> <CButton color = "danger" onClick = {()=>{deleteCoupon(index)}}> Delete</CButton> </td>
            </tr>)
          })
        }
        </table>
    </div>
  );
}

export default DisplayCoupons;