import axios from "axios";
import { API_URL,EMAIL_NOTIFICATION } from "./constants";

export const sendMail = ({ to, from, subject, content }) => {
  return new Promise((resolve, reject) => {
    const msg = {
      to: to ,
      from: from || EMAIL_NOTIFICATION.FROM,
      subject: subject || "Ca Max",
      text: content,
    };

    const body = JSON.stringify(msg);
     console.log("msgmsgmsg=",msg)
    axios
      .post(API_URL.sendMail, {
        data: "" + body,
      })
      .then((response) => {
        console.log("Email sent successfully.");
        resolve(response);
      })
      .catch((error) => {
        console.log("Unable to send email at this time.");
        reject(error);
      });
  });
};