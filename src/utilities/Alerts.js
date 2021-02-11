// import { NotificationManager } from "react-notifications";

// export default (status, message) => {
//   console.log("NotificationManagerNotificationManager")
//   if (status === 200) {
//     NotificationManager.success(message, "", 1000);
//   } else {
//     NotificationManager.error(message, "", 2000);
//   }
// };



import { toast } from 'react-toastify';
import '../../node_modules/react-toastify/dist/ReactToastify.css';
toast.configure();
export default (status, message) => {
    const options = {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        hideProgressBar: true,
    };
    if (status === 200) {
        toast.success(message, options);
    } else {
        toast.error(message, options);
    }
};
