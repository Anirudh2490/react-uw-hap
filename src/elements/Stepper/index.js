import React from "react";
import ReactStepper from "react-stepper-horizontal";
import "./index.css";

export const Stepper = ({ steps, activeStep }) => (
  <div className="stepper">
    <ReactStepper
      steps={steps}
      activeStep={activeStep}
      activeColor="rgb(2, 132, 137)"
      completeColor="rgb(2, 132, 137)"
      completeBarColor="rgb(2, 132, 137)"
      completeOpacity="0.7"
      size={35}
    />
  </div>
);

export default Stepper;
