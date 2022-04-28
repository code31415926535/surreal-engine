import React from 'react';

export interface ErrorWidgetOptions {
  error: Error;
}

export const ErrorWidget = (props: ErrorWidgetOptions) => (
  <div style={{
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    paddingTop: 10,
    paddingLeft: 10,
  }}>
    <div style={{
      color: 'white',
      fontSize: '36px',
      marginBottom: 10,
    }}>
      {props.error.message}
    </div>
    <div style={{
      color: 'red',
      fontSize: '18px',
    }}>
      {props.error.stack?.split('\n').map((line, i) => (
        <div key={i} style={{
          color: 'red',
          marginBottom: '4px',
          marginLeft: i === 0 ? 0 : 24,
        }}>
          {line}
          </div>
      ))}
    </div>
  </div>
);

export default ErrorWidget;