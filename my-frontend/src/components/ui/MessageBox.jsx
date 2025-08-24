import React from "react";
import PropTypes from "prop-types";

export function ErrorBox({ children }) {
  return <div className="message-box error" role="alert">{children}</div>;
}
export function SuccessBox({ children }) {
  return <div className="message-box success" role="status">{children}</div>;
}

ErrorBox.propTypes = SuccessBox.propTypes = {
  children: PropTypes.node.isRequired,
};
