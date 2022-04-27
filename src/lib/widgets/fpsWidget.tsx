import React from 'react';

export interface FpsWidgetOptions {
  fps: number;
}

const FpsWidget = (props: FpsWidgetOptions) => (
  <div style={{
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '24px',
    textAlign: 'right',
    color: 'green'
  }}>
    FPS: {props.fps}
  </div>
);

export default FpsWidget;