import React from 'react';

export interface ProgressWidgetOptions {
  percentage: number;
}

export const ProgressWidget = (props: ProgressWidgetOptions) => (
  <div style={{
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <div style={{
      color: 'white',
      fontSize: '48px',
    }}>
      {props.percentage * 100}%
    </div>
  </div>
);

export default ProgressWidget;