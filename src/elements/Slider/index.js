import React from "react";
import Tooltip from "rc-tooltip";
import RcSlider from "rc-slider";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import "./index.css";

 const createSliderWithTooltip = RcSlider.createSliderWithTooltip;
const Range = createSliderWithTooltip(RcSlider.Range);
const Handle = RcSlider.Handle;

 const handle = props => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

 export const Slider = ({ min, max, defaultValue, marks, onChange, onAfterChange, value }) => (
         <RcSlider
           min={min}
           onAfterChange={onAfterChange}
           max={max}
           value={value}
           onChange={onChange}
           defaultValue={defaultValue}
           handle={handle}
           marks={marks}
         />
       );