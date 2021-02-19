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

};

let lastVisible = ''

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
  export const getApplicantsForJob = async (jobId) => {
   
    return new Promise (async (resolve)=>{
     const result =  await database.ref(SCHEMA.APPLICANTS).orderByChild("jobId")
     .equalTo(jobId).once("value")
     if (result) {
       let data = []
       const values = result.val()
       console.log("valuesvalues=",values)
       const keys = values && Object.keys(values)
       keys && keys.forEach(key=>{
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

 export const getTotalUser = ()=>{

 }



/**
   * @method getAllUsers : To fetch user data
   *
   *
   * @returns Promise that resolves or rejects query
   */
export const getAllUsers = (offset, limit) => {
  console.log("lastVisiblelastVisible=",lastVisible)
  if(!lastVisible){
    console.log("iffffffffffff")

    return new Promise((resolve, reject) => {
      try {
        database.ref(SCHEMA.USERS).orderByKey().limitToFirst(limit).once("value", (snapshot) => {
          const values = snapshot.val() || {}
          const data = Object.values(values)||[]
          const keys = Object.keys(values) || []
          lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
          resolve({totalData :data.length ,data});
        });
      } catch (error) {
        reject(error);
      }
    });
  }else {
    console.log("elseeeee")
    return new Promise((resolve, reject) => {
      try {
        database.ref(SCHEMA.USERS).orderByKey().startAfter(lastVisible).limitToFirst(limit).once("value", (snapshot) => {
          const values = snapshot.val() || {}
          const data = Object.values(values)||[]
          const keys = Object.keys(values) || []
          lastVisible = ( keys.length > 0 )? keys[keys.length -1]:''
          resolve({totalData :data.length ,data});

        });
      } catch (error) {
        reject(error);
      }
    });
  }
  
};

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
 export const  getAllPostByEmployer = () => {
  return new Promise(async (resolve) => {
    const result = await database.ref(SCHEMA.POSTBYEMPLOYER + "/").once("value")
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
 * @method updateStatusOfEmployerPost : To update status of employer post 
 * @param {string} id : id of post 
 *
 */
export const  updateStatusOfEmployerPost = async (id,status,callback)=>{
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
export const getAllPostByEmployee = () => {
  return new Promise(async (resolve) => {
    const result = await database.ref(SCHEMA.POSTBYEMPLOYEE + "/").once("value")
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

  