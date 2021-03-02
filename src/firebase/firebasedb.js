// import firebase from "../services/firebase";
// import app from "../services/firebase";
// import "firebase/database";
import {database }from '../services/firebase'
export const SCHEMA = {
  USERS: "users",
  POSTBYEMPLOYEE :"postbyemployee",
  POSTBYEMPLOYER :"postbyemployer",
  APPLICANTS : 'applicants',
  POSTBYCAMAX : 'postbycamax',
  PRODUCTS : 'products',
  COUPONS : 'coupons',
  ADMIN : 'admin',

};

let lastVisible = ''
let lastFetch 


 /**
   * @method getAllApplicants : To add post by CAMAX
   * 
   *
   */
  export const getAllApplicants = async () => {
    return new Promise (async (resolve)=>{
     const result =  await database.ref(SCHEMA.APPLICANTS + "/").once("value")
     if (result) {
       let data = []
       const values = result.val()
       const keys = values && Object.keys(values)
       keys.forEach(key=>{
         let res= values[key]
         res = {
           ...res,
           id : key
         }
         data.push(res)
       })
       resolve(data)
     } else {
       resolve(null)
     }

    })
   
 };

/**
   * @method getApplicantsForJob: To add post by CAMAX
   * 
   *
   */
  export const getApplicantsForJob = async (jobId,offset,limit) => {

    return new Promise(async (resolve) => {
    
        const result =  await database.ref(SCHEMA.APPLICANTS).orderByChild("jobId")
     .equalTo(jobId).once("value")
      if (result) {
        let data = []
        const values = result.val()
        
        const keys = values && Object.keys(values) || []
        keys.forEach(key => {
          let res = values[key]
          res = {
            ...res,
            id: key
          }
          data.push(res)
        })
        const newData = data.slice()
        const response = {
          totalData : data && data.length,
          data : newData.splice(offset,limit)
        }
        resolve(response)
      } else {
        resolve(null)
      }
  })

   
    // return new Promise (async (resolve)=>{
    //  const result =  await database.ref(SCHEMA.APPLICANTS).orderByChild("jobId")
    //  .equalTo(jobId).once("value")
    //  if (result) {
    //    let data = []
    //    const values = result.val()
    //    const keys = values && Object.keys(values)
    //    keys && keys.forEach(key=>{
    //      let res= values[key]
    //      res = {
    //        ...res,
    //        id : key
    //      }
    //      data.push(res)
    //    })
    //    resolve(data)
    //  } else {
    //    resolve(null)
    //  }

    // })
   
 };

 export const addAdminTable = async ()=>{
   let data = {
     userName : "admin",
     password : "admin",
   }
  await database.ref(SCHEMA.ADMIN + "/").push(data)
  
 }

 export const loginAdmin = async (data)=>{
   let valid = false
  const result = await database.ref(SCHEMA.ADMIN).orderByChild("userName").equalTo(data.username).limitToFirst(1).once("value")
  if(result){
    const value = result.val() || {}
    console.log("valuevaluevalue=",value)
    const resData = Object.values(value) || []
    console.log("resDataresData=",resData)
    resData.forEach(el=>{
      if(el.userName === data.username && el.password === data.password){
        valid = true
      }else{
        valid=false
      }
    })
  }
  return valid
 }



 export const getTotalUser = ()=>{
  return new Promise((resolve, reject) => {
    try {
      database.ref(SCHEMA.USERS).once("value", (snapshot) => {
        const values = snapshot.val() || {}
        const data = Object.values(values)||[]
        resolve({totalData :data.length});
      });
    } catch (error) {
      reject(error);
    }
  });
 }



/**
   * @method getAllUsers : To fetch user data
   *
   *
   * @returns Promise that resolves or rejects query
   */
// export const getAllUsers = (offset, limit) => {
//   lastVisible = (offset==0 )? '':lastVisible
//   if(!lastVisible){
//     return new Promise((resolve, reject) => {
//       try {
//         database.ref(SCHEMA.USERS).orderByKey().limitToFirst(limit).once("value", (snapshot) => {
//           const values = snapshot.val() || {}
//           const data = Object.values(values)||[]
//           const keys = Object.keys(values) || []
//           lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
//           resolve({totalData :data.length ,data});
//         });
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }else {
//     console.log("elseeeee")
//     return new Promise((resolve, reject) => {
//       try {
//         database.ref(SCHEMA.USERS).orderByKey().startAfter(lastVisible).limitToFirst(limit).once("value", (snapshot) => {
//           const values = snapshot.val() || {}
//           const data = Object.values(values)||[]
//           const keys = Object.keys(values) || []
//           lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
//           resolve({totalData :data.length ,data});

//         });
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }
  
// };





export const  getAllUsers = async (offset,limit,lastpage, newPage) => {
  const fetchDiffrence = newPage - lastpage 
  lastVisible = (offset===0 )? '':lastVisible
  
 if(!lastVisible){
   return new Promise((resolve, reject) => {
     try {
       database.ref(SCHEMA.USERS).orderByKey().limitToFirst(limit).once("value", (snapshot) => {
         let data = []
       const values = snapshot.val()
       const keys = values && Object.keys(values) || []
       keys && keys.forEach(key => {
         let res = values[key]
         res = {
           ...res,
           id: key
         }
         data.push(res)
       })
         lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
         resolve(data);
       });
     } catch (error) {
       reject(error);
     }
   });
 }else {
  if(fetchDiffrence > 1){
   return new Promise(async (resolve, reject) => {
   const result = await database.ref(SCHEMA.USERS).orderByKey().startAfter(lastVisible).limitToFirst((fetchDiffrence - 1) * limit).once("value")
   if(result){
     const values = result.val()
     const keys = values && Object.keys(values) || []
     lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
     const reponse = await  database.ref(SCHEMA.USERS).orderByKey().startAfter(lastVisible).limitToFirst(limit).once("value")
     if(reponse){
       let data = []
       const values = reponse.val()
       const keys = values && Object.keys(values) || []
       keys && keys.forEach(key => {
         let res = values[key]
         res = {
           ...res,
           id: key
         }
         data.push(res)
         lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
         resolve(data);
       })
     }else {
       resolve([])
     }
   }else {
     resolve([])
   }
   })
  }
  else if(fetchDiffrence < 0){
   return new Promise(async (resolve, reject) => {
     const result = await database.ref(SCHEMA.USERS).orderByKey().limitToFirst((newPage - 1)* limit).once("value")
     if(result){
       const values = result.val()
       const keys = values && Object.keys(values) || []
       lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
       const reponse = await  database.ref(SCHEMA.USERS).orderByKey().startAfter(lastVisible).limitToFirst(limit).once("value")
       if(reponse){
         let data = []
         const values = reponse.val()
         const keys = values && Object.keys(values) || []
         keys && keys.forEach(key => {
           let res = values[key]
           res = {
             ...res,
             id: key
           }
           data.push(res)
           lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
           resolve(data);
         })
       }else {
         resolve([])
       }
     }else {
       resolve([])
     }
     })
  }
  else {
   return new Promise((resolve, reject) => {
     try {
       database.ref(SCHEMA.USERS).orderByKey().startAfter(lastVisible).limitToFirst(limit).once("value", (snapshot) => {
         let data = []
       const values = snapshot.val()
       const keys = values && Object.keys(values) || []
       keys && keys.forEach(key => {
         let res = values[key]
         res = {
           ...res,
           id: key
         }
         data.push(res)
       })
         lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
         resolve(data);

       });
     } catch (error) {
       reject(error);
     }
   });
  }
  
 }
}








/**
   * @method addCAMAXPost : To add post by CAMAX
   * @param {object} data : values to be added
   *
   */
  export const addCAMAXPost = async (data,callback) => {
    await database.ref(SCHEMA.POSTBYCAMAX + "/").push(data)
    callback(true)
  };


  /**
   * @method addCoupon : To add coupon
   * @param {object} data : values to be added
   *
   */
  export const addCoupon = async (data,callback) => {
    await database.ref(SCHEMA.COUPONS + "/").push(data)
    callback(true)
  };


  /**
   * @method getAllCoupons : To add coupon
   * 
   *
   */
  export const getAllCoupons = async (data,callback) => {
    return new Promise (async (resolve)=>{
      const result =  await database.ref(SCHEMA.COUPONS + "/").once("value")
      if (result) {
        let data = []
        const values = result.val()
        const keys = values && Object.keys(values)
        keys.forEach(key=>{
          let res= values[key]
          res = {
            ...res,
            id : key
          }
          data.push(res)
        })
        resolve(data)
      } else {
        resolve(null)
      }

     })
  };

/**
   * @method deleteCAMAXPost : To delete post by CAMAX
   * @param {object} id : values to be added
   *
   */
  export const deleteCAMAXPost = async (id,callback) => {
    await database.ref(SCHEMA.POSTBYCAMAX + "/" + id).remove()
    callback(true)
  };

 /**
   * @method updateCAMAXPost : To delete post by CAMAX
   * @param {object} id : values to be added
   *
   */
  export const updateCAMAXPost = async (data,callback) => {
    const id = data.id
    const dataToUpdate = data.data
   await database.ref(SCHEMA.POSTBYCAMAX + "/" + id).update(dataToUpdate)
   callback(true)
 };

 /**
   * @method getProducts : get user's licences
   * 
   *
   */
   export const  getProducts = () => {
    //  console.log("datadatadatadata=",data)
    return new Promise(async (resolve) => {
      const result = await database.ref(SCHEMA.PRODUCTS).once("value")
      if (result) {
        let data = []
        const values = result.val()
        const keys = values && Object.keys(values)
        keys.forEach(key => {
          let res = values[key]
          res = {
            ...res,
            id: key
          }
          data.push(res)
        })
        resolve(data)
      }
      else {
        resolve(null)
      }
    })
  }


/**
   * @method getAllPostByCAMAX : To get all  post added by CAMAX
   *
   */
  export const getAllPostByCAMAX = async (data,callback) => {
    return new Promise (async (resolve)=>{
      const result =  await database.ref(SCHEMA.POSTBYCAMAX + "/").once("value")
      if (result) {
        let data = []
        const values = result.val()
        const keys = values && Object.keys(values)
        keys.forEach(key=>{
          let res= values[key]
          res = {
            ...res,
            id : key
          }
          data.push(res)
        })
        resolve(data)
      } else {
        resolve(null)
      }

     })
  };

 /**
   * @method deleteEmployeePost : To delete post by Employer
   * @param {object} id : values to be deleted
   *
   */
  export const  deleteEmployerPost = async (id,callback) => {
    await database.ref(SCHEMA.POSTBYEMPLOYER + "/" + id).remove()
    callback(true)
  };


 /**
  * @method getAllPostByEmployer: To get all post by employer
  * 
  *
  */
 export const  getAllPostByEmployer = async (offset,limit,lastpage, newPage) => {
   const fetchDiffrence = newPage - lastpage 
   lastVisible = (offset===0 )? '':lastVisible
   
  if(!lastVisible){
    return new Promise((resolve, reject) => {
      try {
        database.ref(SCHEMA.POSTBYEMPLOYER).orderByKey().limitToFirst(limit).once("value", (snapshot) => {
          let data = []
        const values = snapshot.val()
        const keys = values && Object.keys(values) || []
        keys && keys.forEach(key => {
          let res = values[key]
          res = {
            ...res,
            id: key
          }
          data.push(res)
        })
          lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
          resolve(data);
        });
      } catch (error) {
        reject(error);
      }
    });
  }else {
   if(fetchDiffrence > 1){
    return new Promise(async (resolve, reject) => {
    const result = await database.ref(SCHEMA.POSTBYEMPLOYER).orderByKey().startAfter(lastVisible).limitToFirst((fetchDiffrence - 1) * limit).once("value")
    if(result){
      const values = result.val()
      const keys = values && Object.keys(values) || []
      lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''

      const reponse = await  database.ref(SCHEMA.POSTBYEMPLOYER).orderByKey().startAfter(lastVisible).limitToFirst(limit).once("value")
      if(reponse){
        let data = []
        const values = reponse.val()
        const keys = values && Object.keys(values) || []
        keys && keys.forEach(key => {
          let res = values[key]
          res = {
            ...res,
            id: key
          }
          data.push(res)
          lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
          resolve(data);
        })
      }else {
        resolve([])
      }
    }else {
      resolve([])
    }

    })


   }

   else if(fetchDiffrence < 0){
    return new Promise(async (resolve, reject) => {
      const result = await database.ref(SCHEMA.POSTBYEMPLOYER).orderByKey().limitToFirst((newPage - 1)* limit).once("value")
      if(result){
        const values = result.val()
        const keys = values && Object.keys(values) || []
        lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
        const reponse = await  database.ref(SCHEMA.POSTBYEMPLOYER).orderByKey().startAfter(lastVisible).limitToFirst(limit).once("value")
        if(reponse){
          let data = []
          const values = reponse.val()
          const keys = values && Object.keys(values) || []
          keys && keys.forEach(key => {
            let res = values[key]
            res = {
              ...res,
              id: key
            }
            data.push(res)
            lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
            resolve(data);
          })
        }else {
          resolve([])
        }
      }else {
        resolve([])
      }
  
      })
    
   }
   
   else {
    return new Promise((resolve, reject) => {
      try {
        database.ref(SCHEMA.POSTBYEMPLOYER).orderByKey().startAfter(lastVisible).limitToFirst(limit).once("value", (snapshot) => {
          let data = []
        const values = snapshot.val()
        const keys = values && Object.keys(values) || []
        keys && keys.forEach(key => {
          let res = values[key]
          res = {
            ...res,
            id: key
          }
          data.push(res)
        })
          lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
          resolve(data);

        });
      } catch (error) {
        reject(error);
      }
    });
   }
   
  }


  // return new Promise(async (resolve) => {
  //   const result = await database.ref(SCHEMA.POSTBYEMPLOYER + "/").once("value")
  //   if (result) {
  //     let data = []
  //     const values = result.val()
  //     const keys = values && Object.keys(values)
  //     keys.forEach(key=>{
  //       let res= values[key]
  //       res = {
  //         ...res,
  //         id : key
  //       }
  //       data.push(res)
  //     })
  //     resolve(data)
  //   } else {
  //     resolve(null)
  //   }
  // })
};

   /**
 * @method updateStatusOfEmployerPost : To update status of employer post 
 * @param {string} id : id of post 
 *
 */
export const  updateStatusOfEmployerPost = async (id,status,callback)=>{
  console.log("idididid=",id)
  await database.ref(SCHEMA.POSTBYEMPLOYER + "/" + id).update({status:status})
   callback(true)
  }


  /**
 * @method updateStatusOfEmployeePost : To update status of employee post 
 * @param {string} id : id of post 
 *
 */
export const updateStatusOfEmployeePost = async (id,status,callback)=>{
  await database.ref(SCHEMA.POSTBYEMPLOYEE + "/" + id).update({status:status})
   callback(true)
  }
 

/**
   * @method deleteEmployeePost : To delete post by Employee
   * @param {object} id : values to be deleted
   *
   */
  export const deleteEmployeePost = async (id,callback) => {
    await database.ref(SCHEMA.POSTBYEMPLOYEE + "/" + id).remove()
    callback(true)
  };

/**
   * @method getAllUsers : To fetch user data
   *
   *
   * @returns Promise that resolves or rejects query
   */
  export const getUserDetail = () => {
    return new Promise((resolve, reject) => {
      try {
        database.ref(SCHEMA.USERS).once("value", (snapshot) => {
          resolve(Object.values(snapshot.val() || {}));
        });
      } catch (error) {
        reject(error);
      }
    });
  };

   /**
   * @method getUser : To fetch user data
   *
   * @param {string} key : email of field
   * @param {string|number} value : value of given key
   *
   * @returns Promise that resolves or rejects query
   */
  export const getUser = (key, value) => {
    return new Promise((resolve, reject) => {
      try {
        database
          .ref(SCHEMA.USERS)
          .orderByChild(key)
          .equalTo(value)
          .once("value", (snapshot) => {
            resolve(Object.values(snapshot.val() || {}));
          });
      } catch (error) {
        reject(error);
      }
    });
  };

  // updateUserLicence

  export const updateUserLicence = async (userId, data, callback)=>{
    const licenceNo = data.id
    await database
    .ref(SCHEMA.USERS + "/" + userId + "/licence/" + licenceNo)
    .update(data);
    callback(true)
  }

  export const deleteUserLicenceKey = async (userId, licenceKey, callback)=>{
    const licenceNo = licenceKey
    await database
    .ref(SCHEMA.USERS + "/" + userId + "/licence/" + licenceNo)
    .remove();
    callback(true)
  }

export const getTotalOfEmployeePost = ()=>{
  return new Promise((resolve, reject) => {
    try {
      database.ref(SCHEMA.POSTBYEMPLOYEE).once("value", (snapshot) => {
        const values = snapshot.val() || {}
        const data = Object.values(values)||[]
        resolve({totalData :data.length});
      });
    } catch (error) {
      reject(error);
    }
  });
}

export const getTotalOfEmployerPost = ()=>{
  return new Promise((resolve, reject) => {
    try {
      database.ref(SCHEMA.POSTBYEMPLOYER).once("value", (snapshot) => {
        const values = snapshot.val() || {}
        const data = Object.values(values)||[]
        resolve({totalData :data.length});
      });
    } catch (error) {
      reject(error);
    }
  });
}



export const addNewLicenecForUesr = async (userId, data, callback)=>{
  const licenceNo = data.id
  await database
  .ref(SCHEMA.USERS + "/" + userId + "/licence/" + licenceNo)
  .update(data);
  callback(true)
}

 /**
 * @method getAllPostByEmployee : To get all post by employee
 * 
 *
 */
  export const  getAllPostByEmployee = async (offset,limit,lastpage, newPage) => {
    const fetchDiffrence = newPage - lastpage 
    lastVisible = (offset===0 )? '':lastVisible
    
   if(!lastVisible){
     return new Promise((resolve, reject) => {
       try {
         database.ref(SCHEMA.POSTBYEMPLOYEE).orderByKey().limitToFirst(limit).once("value", (snapshot) => {
           let data = []
         const values = snapshot.val()
         const keys = values && Object.keys(values) || []
         keys && keys.forEach(key => {
           let res = values[key]
           res = {
             ...res,
             id: key
           }
           data.push(res)
         })
           lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
           resolve(data);
         });
       } catch (error) {
         reject(error);
       }
     });
   }else {
    if(fetchDiffrence > 1){
     return new Promise(async (resolve, reject) => {
     const result = await database.ref(SCHEMA.POSTBYEMPLOYEE).orderByKey().startAfter(lastVisible).limitToFirst((fetchDiffrence - 1) * limit).once("value")
     if(result){
       const values = result.val()
       const keys = values && Object.keys(values) || []
       lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
 
       const reponse = await  database.ref(SCHEMA.POSTBYEMPLOYEE).orderByKey().startAfter(lastVisible).limitToFirst(limit).once("value")
       if(reponse){
         let data = []
         const values = reponse.val()
         const keys = values && Object.keys(values) || []
         keys && keys.forEach(key => {
           let res = values[key]
           res = {
             ...res,
             id: key
           }
           data.push(res)
           lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
           resolve(data);
         })
       }else {
         resolve([])
       }
     }else {
       resolve([])
     }
 
     })
 
 
    }
 
    else if(fetchDiffrence < 0){
     return new Promise(async (resolve, reject) => {
       const result = await database.ref(SCHEMA.POSTBYEMPLOYEE).orderByKey().limitToFirst((newPage - 1)* limit).once("value")
       if(result){
         const values = result.val()
         const keys = values && Object.keys(values) || []
         lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
         const reponse = await  database.ref(SCHEMA.POSTBYEMPLOYEE).orderByKey().startAfter(lastVisible).limitToFirst(limit).once("value")
         if(reponse){
           let data = []
           const values = reponse.val()
           const keys = values && Object.keys(values) || []
           keys && keys.forEach(key => {
             let res = values[key]
             res = {
               ...res,
               id: key
             }
             data.push(res)
             lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
             resolve(data);
           })
         }else {
           resolve([])
         }
       }else {
         resolve([])
       }
   
       })
     
    }
    
    else {
     return new Promise((resolve, reject) => {
       try {
         database.ref(SCHEMA.POSTBYEMPLOYEE).orderByKey().startAfter(lastVisible).limitToFirst(limit).once("value", (snapshot) => {
           let data = []
         const values = snapshot.val()
         const keys = values && Object.keys(values) || []
         keys && keys.forEach(key => {
           let res = values[key]
           res = {
             ...res,
             id: key
           }
           data.push(res)
         })
           lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
           resolve(data);
 
         });
       } catch (error) {
         reject(error);
       }
     });
    }
    
   }
  }