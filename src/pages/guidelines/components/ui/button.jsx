import React from 'react';

export function Button({ children, className = '', ...props }) {
  return (
    <button className={`${className} inline-block`} {...props}>
      {children}
    </button>
  );
}

export default Button;
