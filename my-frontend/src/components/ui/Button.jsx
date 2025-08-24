import React from "react";
import PropTypes from "prop-types";

export default function Button({ children, loading, type = "button", ...rest }) {
  return (
    <button className="btn" type={type} disabled={loading || rest.disabled} {...rest}>
      {loading ? <span className="spinner" aria-label="Loading" /> : children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  type: PropTypes.string,
};
