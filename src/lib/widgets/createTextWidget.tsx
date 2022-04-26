import React, { CSSProperties } from 'react';

export interface CreateTextWidgetOptions {
  text: string;
  style?: CSSProperties;
}

const CreateTextWidget = (options: CreateTextWidgetOptions) => {
  return (
    <div style={options.style || {}}>
      {options.text}
    </div>
  );
};

export default CreateTextWidget;
