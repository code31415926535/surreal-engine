import React from 'react';

export interface InfoWidgetOptions {
  title: string;
  text: string;
  width?: number;
}

const InfoWidget = (props: InfoWidgetOptions) => (
  <div style={{
    width: props.width || 300,
    padding: '10px',
    color: 'white',
    pointerEvents: 'none', 
  }}>
    <div style={{
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '10px',
      pointerEvents: 'none',
    }}>{props.title}</div>
    <div style={{ fontSize: '16px', pointerEvents: 'none' }}>
      {props.text}
    </div>
  </div>
);

export default InfoWidget;