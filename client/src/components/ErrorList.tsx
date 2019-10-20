import * as React from 'react';

interface IErrorListProps {
  errors: [string?]
}

const ErrorList: React.FunctionComponent<IErrorListProps> = (props) => {
  return (
    <div className="error-box">
      <ul className="error-list">
        {props.errors.map((error, index) => (
          <li key={index}> {error} </li>
        ))}
      </ul>
    </div>
  )
};

export default ErrorList;
