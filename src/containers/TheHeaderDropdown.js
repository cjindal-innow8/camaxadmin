import React from "react";
import { Button } from "reactstrap";
import { useHistory, useLocation } from 'react-router-dom'
const TheHeaderDropdown = (props) => {
  const history = useHistory()

  const handleLogout = (e) => {
    e.preventDefault();
    history.push("/login");
  };
  return (
    <div>
      <Button
        color="primary"
        onClick={handleLogout}
        className="logout-btn ml-2"
      >
        Logout
      </Button>
    </div>
  );
};
export default TheHeaderDropdown;