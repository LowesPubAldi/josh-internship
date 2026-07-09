import React from "react";

const ErrorNotice = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="col-md-12 text-center" role="alert" aria-live="polite">
      <div className="alert alert-danger mb-3" style={{ display: "inline-block" }}>
        {message}
      </div>
    </div>
  );
};

export default ErrorNotice;
