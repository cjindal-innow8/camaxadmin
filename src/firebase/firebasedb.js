// import firebase from "../services/firebase";
// import app from "../services/firebase";
// import "firebase/database";
import { database } from "../services/firebase";
import { asyncForEach } from "../utilities/util";
export const SCHEMA = {
  USERS: "users",
  POSTBYEMPLOYEE: "postbyemployee",
  POSTBYEMPLOYER: "postbyemployer",
  APPLICANTS: "applicants",
  POSTBYCAMAX: "postbycamax",
  PRODUCTS: "products",
  COUPONS: "coupons",
  ADMIN: "admin",
  LICENCES: "licences",
};

let lastVisible = "";
let lastFetch;

/**
 * @method getAllApplicants : To add post by CAMAX
 *
 *
 */
export const getAllApplicants = async () => {
  return new Promise(async (resolve) => {
    const result = await database.ref(SCHEMA.APPLICANTS + "/").once("value");
    if (result) {
      let data = [];
      const values = result.val();
      const keys = values && Object.keys(values);
      keys.forEach((key) => {
        let res = values[key];
        res = {
          ...res,
          id: key,
        };
        data.push(res);
      });
      resolve(data);
    } else {
      resolve(null);
    }
  });
};

/**
 * @method getApplicantsForJob: To add post by CAMAX
 *
 *
 */
export const getApplicantsForJob = async (jobId, offset, limit) => {
  return new Promise(async (resolve) => {
    const result = await database
      .ref(SCHEMA.APPLICANTS)
      .orderByChild("jobId")
      .equalTo(jobId)
      .once("value");
    if (result) {
      let data = [];
      const values = result.val();

      const keys = (values && Object.keys(values)) || [];
      keys.forEach((key) => {
        let res = values[key];
        res = {
          ...res,
          id: key,
        };
        data.push(res);
      });
      const newData = data.slice();
      const response = {
        totalData: data && data.length,
        data: newData.splice(offset, limit),
      };
      resolve(response);
    } else {
      resolve(null);
    }
  });
};

export const addAdminTable = async () => {
  let data = {
    userName: "admin",
    password: "admin",
  };
  await database.ref(SCHEMA.ADMIN + "/").push(data);
};

export const loginAdmin = async (data) => {
  let valid = false;
  const result = await database
    .ref(SCHEMA.ADMIN)
    .orderByChild("userName")
    .equalTo(data.username)
    .limitToFirst(1)
    .once("value");
  if (result) {
    const value = result.val() || {};
    console.log("valuevaluevalue=", value);
    const resData = Object.values(value) || [];
    console.log("resDataresData=", resData);
    resData.forEach((el) => {
      if (el.userName === data.username && el.password === data.password) {
        valid = true;
      } else {
        valid = false;
      }
    });
  }
  return valid;
};

export const getTotalUser = () => {
  return new Promise((resolve, reject) => {
    try {
      database.ref(SCHEMA.USERS).once("value", (snapshot) => {
        const values = snapshot.val() || {};
        const data = Object.values(values) || [];
        resolve({ totalData: data.length });
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllUsersEmail = () => {
  return new Promise((resolve, reject) => {
    try {
      database.ref(SCHEMA.USERS).once("value", (snapshot) => {
        const values = snapshot.val() || {};
        const data = Object.values(values) || [];
        const usersEmail = data.map((el) => {
          return el.email;
        });
        resolve(usersEmail);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getTotalLicences = () => {
  return new Promise((resolve, reject) => {
    try {
      database.ref(SCHEMA.LICENCES).once("value", (snapshot) => {
        const values = snapshot.val() || {};
        const data = Object.values(values) || [];
        resolve({ totalData: data.length });
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const licenceDetail = ({ offset, limit, lastPage, newPage }) => {
  return new Promise(async (resolve, reject) => {
    const result = await getLicences({ offset, limit, lastPage, newPage });
    if (result) {
      const value = result.val();
      const keys = (value && Object.keys(value)) || [];
      lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
      const data = Object.values(value) || [];
      const dataToSent = [];
      let details;
      await asyncForEach(data, async (el, index) => {
        let uid = el.uid,
          prevUid = (data[index - 1] && data[index - 1].uid) || el.uid;

        if (uid !== prevUid || index === 0) {
          const userData = await database
            .ref(SCHEMA.USERS + "/" + uid)
            .once("value");
          details = userData.val();
        }
        let licenceData = {
          ...el,
          username: details.username,
          email: details.email,
          companyName: details.companyName,
        };
        dataToSent.push(licenceData);
      });
      resolve(dataToSent);
    } else {
      resolve([]);
    }
  });
};

const getLicences = async ({ limit, offset, newPage, lastPage }) => {
  const ref = database.ref(SCHEMA.LICENCES);
  const fetchDiffrence = newPage - lastPage;
  lastVisible = offset === 0 ? "" : lastVisible;
  if (!lastVisible) {
    const result = await ref.orderByKey().limitToFirst(limit).once("value");
    return result;
  } else {
    if (fetchDiffrence > 1) {
      const result = await ref
        .orderByKey()
        .startAfter(lastVisible)
        .limitToFirst((fetchDiffrence - 1) * limit)
        .once("value");
        if(result){
          const values = result.val();
          const keys = (values && Object.keys(values)) || [];
          lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
          const response = await ref
          .orderByKey()
          .startAfter(lastVisible)
          .limitToFirst(limit)
          .once("value");
           return response;

        }
    } else if (fetchDiffrence < 0) {
      const result = await ref
        .orderByKey()
        .limitToFirst((newPage - 1) * limit)
        .once("value");
        if(result){
          const values = result.val();
          const keys = (values && Object.keys(values)) || [];
          lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
          const reponse = await  ref
            .orderByKey()
            .startAfter(lastVisible)
            .limitToFirst(limit)
            .once("value");
        return reponse;

        }
    } else {
      const result = await ref
        .orderByKey()
        .startAfter(lastVisible)
        .limitToFirst(limit)
        .once("value");
      return result;
    }
  }
};

export const getAllUsers = async (offset, limit, lastpage, newPage) => {
  const fetchDiffrence = newPage - lastpage;
  lastVisible = offset === 0 ? "" : lastVisible;

  if (!lastVisible) {
    return new Promise((resolve, reject) => {
      try {
        database
          .ref(SCHEMA.USERS)
          .orderByKey()
          .limitToFirst(limit)
          .once("value", (snapshot) => {
            let data = [];
            const values = snapshot.val();
            const keys = (values && Object.keys(values)) || [];
            keys &&
              keys.forEach((key) => {
                let res = values[key];
                res = {
                  ...res,
                  id: key,
                };
                data.push(res);
              });
            lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
            resolve(data);
          });
      } catch (error) {
        reject(error);
      }
    });
  } else {
    if (fetchDiffrence > 1) {
      return new Promise(async (resolve, reject) => {
        const result = await database
          .ref(SCHEMA.USERS)
          .orderByKey()
          .startAfter(lastVisible)
          .limitToFirst((fetchDiffrence - 1) * limit)
          .once("value");
        if (result) {
          const values = result.val();
          const keys = (values && Object.keys(values)) || [];
          lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
          const reponse = await database
            .ref(SCHEMA.USERS)
            .orderByKey()
            .startAfter(lastVisible)
            .limitToFirst(limit)
            .once("value");
          if (reponse) {
            let data = [];
            const values = reponse.val();
            const keys = (values && Object.keys(values)) || [];
            keys &&
              keys.forEach((key) => {
                let res = values[key];
                res = {
                  ...res,
                  id: key,
                };
                data.push(res);
                resolve(data);
              });
              lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
          } else {
            resolve([]);
          }
        } else {
          resolve([]);
        }
      });
    } else if (fetchDiffrence < 0) {
      return new Promise(async (resolve, reject) => {
        const result = await database
          .ref(SCHEMA.USERS)
          .orderByKey()
          .limitToFirst((newPage - 1) * limit)
          .once("value");
        if (result) {
          const values = result.val();
          const keys = (values && Object.keys(values)) || [];
          lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
          const reponse = await database
            .ref(SCHEMA.USERS)
            .orderByKey()
            .startAfter(lastVisible)
            .limitToFirst(limit)
            .once("value");
          if (reponse) {
            let data = [];
            const values = reponse.val();
            const keys = (values && Object.keys(values)) || [];
            keys &&
              keys.forEach((key) => {
                let res = values[key];
                res = {
                  ...res,
                  id: key,
                };
                data.push(res);
                resolve(data);
              });
              lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
          } else {
            resolve([]);
          }
        } else {
          resolve([]);
        }
      });
    } else {
      return new Promise((resolve, reject) => {
        try {
          database
            .ref(SCHEMA.USERS)
            .orderByKey()
            .startAfter(lastVisible)
            .limitToFirst(limit)
            .once("value", (snapshot) => {
              let data = [];
              const values = snapshot.val();
              const keys = (values && Object.keys(values)) || [];
              keys &&
                keys.forEach((key) => {
                  let res = values[key];
                  res = {
                    ...res,
                    id: key,
                  };
                  data.push(res);
                });
              lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
              resolve(data);
            });
        } catch (error) {
          reject(error);
        }
      });
    }
  }
};
/**
 * @method addCAMAXPost : To add post by CAMAX
 * @param {object} data : values to be added
 *
 */
export const addCAMAXPost = async (data, callback) => {
  await database.ref(SCHEMA.POSTBYCAMAX + "/").push(data);
  callback(true);
};

/**
 * @method addCoupon : To add coupon
 * @param {object} data : values to be added
 *
 */
export const addCoupon = async (data, callback) => {
  await database.ref(SCHEMA.COUPONS + "/").push(data);
  callback(true);
};

/**
 * @method updateCoupon : To add coupon
 * @param {object} data : values to be added
 *
 */
export const updateCoupon = async (data, callback) => {
  const id = data.id;
  const dataToUpdate = data.data;
  await database.ref(SCHEMA.COUPONS + "/" + id).update(dataToUpdate);
  callback(true);
};

/**
 * @method deleteCoupon : To add coupon
 * @param {object} data : values to be added
 *
 */
export const deleteCoupon = async (id, callback) => {
  await database.ref(SCHEMA.COUPONS + "/" + id).remove();
  callback(true);
};

/**
 * @method getAllCoupons : To add coupon
 *
 *
 */
export const getAllCoupons = async (data, callback) => {
  return new Promise(async (resolve) => {
    const result = await database.ref(SCHEMA.COUPONS + "/").once("value");
    if (result) {
      let data = [];
      const values = result.val();
      const keys = values && Object.keys(values);
      keys.forEach((key) => {
        let res = values[key];
        res = {
          ...res,
          id: key,
        };
        data.push(res);
      });
      resolve(data);
    } else {
      resolve(null);
    }
  });
};

/**
 * @method deleteCAMAXPost : To delete post by CAMAX
 * @param {object} id : values to be added
 *
 */
export const deleteCAMAXPost = async (id, callback) => {
  await database.ref(SCHEMA.POSTBYCAMAX + "/" + id).remove();
  callback(true);
};

/**
 * @method updateCAMAXPost : To delete post by CAMAX
 * @param {object} id : values to be added
 *
 */
export const updateCAMAXPost = async (data, callback) => {
  const id = data.id;
  const dataToUpdate = data.data;
  await database.ref(SCHEMA.POSTBYCAMAX + "/" + id).update(dataToUpdate);
  callback(true);
};

/**
 * @method getProducts : get user's licences
 *
 *
 */
export const getProducts = () => {
  //  console.log("datadatadatadata=",data)
  return new Promise(async (resolve) => {
    const result = await database.ref(SCHEMA.PRODUCTS).once("value");
    if (result) {
      let data = [];
      const values = result.val();
      const keys = values && Object.keys(values);
      keys.forEach((key) => {
        let res = values[key];
        res = {
          ...res,
          id: key,
        };
        data.push(res);
      });
      resolve(data);
    } else {
      resolve(null);
    }
  });
};

/**
 * @method getAllPostByCAMAX : To get all  post added by CAMAX
 *
 */
export const getAllPostByCAMAX = async (data, callback) => {
  return new Promise(async (resolve) => {
    const result = await database.ref(SCHEMA.POSTBYCAMAX + "/").once("value");
    if (result) {
      let data = [];
      const values = result.val();
      const keys = values && Object.keys(values);
      keys.forEach((key) => {
        let res = values[key];
        res = {
          ...res,
          id: key,
        };
        data.push(res);
      });
      resolve(data);
    } else {
      resolve(null);
    }
  });
};

/**
 * @method deleteEmployeePost : To delete post by Employer
 * @param {object} id : values to be deleted
 *
 */
export const deleteEmployerPost = async (id, callback) => {
  await database.ref(SCHEMA.POSTBYEMPLOYER + "/" + id).remove();
  callback(true);
};

/**
 * @method getAllPostByEmployer: To get all post by employer
 *
 *
 */
export const getAllPostByEmployer = async (
  offset,
  limit,
  lastpage,
  newPage
) => {
  const fetchDiffrence = newPage - lastpage;
  lastVisible = offset === 0 ? "" : lastVisible;

  if (!lastVisible) {
    return new Promise((resolve, reject) => {
      try {
        database
          .ref(SCHEMA.POSTBYEMPLOYER)
          .orderByKey()
          .limitToFirst(limit)
          .once("value", (snapshot) => {
            let data = [];
            const values = snapshot.val();
            const keys = (values && Object.keys(values)) || [];
            keys &&
              keys.forEach((key) => {
                let res = values[key];
                res = {
                  ...res,
                  id: key,
                };
                data.push(res);
              });
            lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
            resolve(data);
          });
      } catch (error) {
        reject(error);
      }
    });
  } else {
    if (fetchDiffrence > 1) {
      return new Promise(async (resolve, reject) => {
        const result = await database
          .ref(SCHEMA.POSTBYEMPLOYER)
          .orderByKey()
          .startAfter(lastVisible)
          .limitToFirst((fetchDiffrence - 1) * limit)
          .once("value");
        if (result) {
          const values = result.val();
          const keys = (values && Object.keys(values)) || [];
          lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";

          const reponse = await database
            .ref(SCHEMA.POSTBYEMPLOYER)
            .orderByKey()
            .startAfter(lastVisible)
            .limitToFirst(limit)
            .once("value");
          if (reponse) {
            let data = [];
            const values = reponse.val();
            const keys = (values && Object.keys(values)) || [];
            keys &&
              keys.forEach((key) => {
                let res = values[key];
                res = {
                  ...res,
                  id: key,
                };
                data.push(res);
                lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
                resolve(data);
              });
          } else {
            resolve([]);
          }
        } else {
          resolve([]);
        }
      });
    } else if (fetchDiffrence < 0) {
      return new Promise(async (resolve, reject) => {
        const result = await database
          .ref(SCHEMA.POSTBYEMPLOYER)
          .orderByKey()
          .limitToFirst((newPage - 1) * limit)
          .once("value");
        if (result) {
          const values = result.val();
          const keys = (values && Object.keys(values)) || [];
          lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
          const reponse = await database
            .ref(SCHEMA.POSTBYEMPLOYER)
            .orderByKey()
            .startAfter(lastVisible)
            .limitToFirst(limit)
            .once("value");
          if (reponse) {
            let data = [];
            const values = reponse.val();
            const keys = (values && Object.keys(values)) || [];
            keys &&
              keys.forEach((key) => {
                let res = values[key];
                res = {
                  ...res,
                  id: key,
                };
                data.push(res);
                lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
                resolve(data);
              });
          } else {
            resolve([]);
          }
        } else {
          resolve([]);
        }
      });
    } else {
      return new Promise((resolve, reject) => {
        try {
          database
            .ref(SCHEMA.POSTBYEMPLOYER)
            .orderByKey()
            .startAfter(lastVisible)
            .limitToFirst(limit)
            .once("value", (snapshot) => {
              let data = [];
              const values = snapshot.val();
              const keys = (values && Object.keys(values)) || [];
              keys &&
                keys.forEach((key) => {
                  let res = values[key];
                  res = {
                    ...res,
                    id: key,
                  };
                  data.push(res);
                });
              lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
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
export const updateStatusOfEmployerPost = async (id, status, callback) => {
  console.log("idididid=", id);
  await database
    .ref(SCHEMA.POSTBYEMPLOYER + "/" + id)
    .update({ status: status });
  callback(true);
};

/**
 * @method updateStatusOfEmployeePost : To update status of employee post
 * @param {string} id : id of post
 *
 */
export const updateStatusOfEmployeePost = async (id, status, callback) => {
  await database
    .ref(SCHEMA.POSTBYEMPLOYEE + "/" + id)
    .update({ status: status });
  callback(true);
};

/**
 * @method deleteEmployeePost : To delete post by Employee
 * @param {object} id : values to be deleted
 *
 */
export const deleteEmployeePost = async (id, callback) => {
  await database.ref(SCHEMA.POSTBYEMPLOYEE + "/" + id).remove();
  callback(true);
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

export const userLicences = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      database
        .ref(SCHEMA.LICENCES)
        .orderByChild("uid")
        .equalTo(userId)
        .once("value", (snapshot) => {
          resolve(Object.values(snapshot.val() || {}));
        });
    } catch (error) {
      reject(error);
    }
  });
};

// updateUserLicence

export const updateUserLicence = async (userId, data, callback) => {
  const licenceNo = data.id;
  console.log("licenceNolicenceNo=", licenceNo);
  await database.ref(SCHEMA.LICENCES + "/" + licenceNo).update(data);
  callback(true);
};

export const deleteUserLicenceKey = async (userId, licenceKey, callback) => {
  const licenceNo = licenceKey;
  await database
    .ref(SCHEMA.USERS + "/" + userId + "/licence/" + licenceNo)
    .remove();
  callback(true);
};

export const getTotalOfEmployeePost = () => {
  return new Promise((resolve, reject) => {
    try {
      database.ref(SCHEMA.POSTBYEMPLOYEE).once("value", (snapshot) => {
        const values = snapshot.val() || {};
        const data = Object.values(values) || [];
        resolve({ totalData: data.length });
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getTotalOfEmployerPost = () => {
  return new Promise((resolve, reject) => {
    try {
      database.ref(SCHEMA.POSTBYEMPLOYER).once("value", (snapshot) => {
        const values = snapshot.val() || {};
        const data = Object.values(values) || [];
        resolve({ totalData: data.length });
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const addNewLicenceForUesr = async (userId, data, callback) => {
  console.log("datadata=", data);
  let dataToAdd = {
    ...data,
    uid: userId,
  };
  const licenceNo = data.id;
  await database.ref(SCHEMA.LICENCES + "/" + licenceNo).update(dataToAdd);
  callback(true);
  // await database.ref(SCHEMA.LICENCES).push()
  // const licenceNo = data.id;
  // await database
  //   .ref(SCHEMA.USERS + "/" + userId + "/licence/" + licenceNo)
  //   .update(data);
  // callback(true);
};

/**
 * @method getAllPostByEmployee : To get all post by employee
 *
 *
 */
export const getAllPostByEmployee = async (
  offset,
  limit,
  lastpage,
  newPage
) => {
  const fetchDiffrence = newPage - lastpage;
  lastVisible = offset === 0 ? "" : lastVisible;

  if (!lastVisible) {
    return new Promise((resolve, reject) => {
      try {
        database
          .ref(SCHEMA.POSTBYEMPLOYEE)
          .orderByKey()
          .limitToFirst(limit)
          .once("value", (snapshot) => {
            let data = [];
            const values = snapshot.val();
            const keys = (values && Object.keys(values)) || [];
            keys &&
              keys.forEach((key) => {
                let res = values[key];
                res = {
                  ...res,
                  id: key,
                };
                data.push(res);
              });
            lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
            resolve(data);
          });
      } catch (error) {
        reject(error);
      }
    });
  } else {
    if (fetchDiffrence > 1) {
      return new Promise(async (resolve, reject) => {
        const result = await database
          .ref(SCHEMA.POSTBYEMPLOYEE)
          .orderByKey()
          .startAfter(lastVisible)
          .limitToFirst((fetchDiffrence - 1) * limit)
          .once("value");
        if (result) {
          const values = result.val();
          const keys = (values && Object.keys(values)) || [];
          lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";

          const reponse = await database
            .ref(SCHEMA.POSTBYEMPLOYEE)
            .orderByKey()
            .startAfter(lastVisible)
            .limitToFirst(limit)
            .once("value");
          if (reponse) {
            let data = [];
            const values = reponse.val();
            const keys = (values && Object.keys(values)) || [];
            keys &&
              keys.forEach((key) => {
                let res = values[key];
                res = {
                  ...res,
                  id: key,
                };
                data.push(res);
                lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
                resolve(data);
              });
          } else {
            resolve([]);
          }
        } else {
          resolve([]);
        }
      });
    } else if (fetchDiffrence < 0) {
      return new Promise(async (resolve, reject) => {
        const result = await database
          .ref(SCHEMA.POSTBYEMPLOYEE)
          .orderByKey()
          .limitToFirst((newPage - 1) * limit)
          .once("value");
        if (result) {
          const values = result.val();
          const keys = (values && Object.keys(values)) || [];
          lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
          const reponse = await database
            .ref(SCHEMA.POSTBYEMPLOYEE)
            .orderByKey()
            .startAfter(lastVisible)
            .limitToFirst(limit)
            .once("value");
          if (reponse) {
            let data = [];
            const values = reponse.val();
            const keys = (values && Object.keys(values)) || [];
            keys &&
              keys.forEach((key) => {
                let res = values[key];
                res = {
                  ...res,
                  id: key,
                };
                data.push(res);
                lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
                resolve(data);
              });
          } else {
            resolve([]);
          }
        } else {
          resolve([]);
        }
      });
    } else {
      return new Promise((resolve, reject) => {
        try {
          database
            .ref(SCHEMA.POSTBYEMPLOYEE)
            .orderByKey()
            .startAfter(lastVisible)
            .limitToFirst(limit)
            .once("value", (snapshot) => {
              let data = [];
              const values = snapshot.val();
              const keys = (values && Object.keys(values)) || [];
              keys &&
                keys.forEach((key) => {
                  let res = values[key];
                  res = {
                    ...res,
                    id: key,
                  };
                  data.push(res);
                });
              lastVisible = keys.length > 0 ? keys[keys.length - 1] : "";
              resolve(data);
            });
        } catch (error) {
          reject(error);
        }
      });
    }
  }
};
