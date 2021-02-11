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
};

/**
   * @method getAllUsers : To fetch user data
   *
   *
   * @returns Promise that resolves or rejects query
   */
export const getAllUsers = () => {
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