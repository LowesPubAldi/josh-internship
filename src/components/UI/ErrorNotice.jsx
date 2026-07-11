import React from "react";

const ErrorNotice = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="col-md-12">
      <div className="alert alert-warning" role="alert">
        {message}
      </div>
    </div>
  );
};

export default ErrorNotice;
