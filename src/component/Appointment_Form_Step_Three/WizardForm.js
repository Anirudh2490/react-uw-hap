import React, { useState } from "react";
import Styles from "./Styles";
import { Field } from "react-final-form";
import Wizard from "./Wizard";
import { withFirebase } from "../Firebase";
import Stepper from "../../elements/Stepper";

const Error = ({ name }) => (
  <Field
    name={name}
    subscribe={{ touched: true, error: true }}
    render={({ meta: { touched, error } }) =>
      touched && error ? <span>{error}</span> : null
    }
  />
);

const required = value => (value ? undefined : "Required");

const WizardFormBase = props => {
  // const [emailError, setEmailError] = useState("");
  // const [docID, setdocID] = useState("");
  const [date, setDate] = useState(new Date());

  function dateUpdate(event) {
    setDate(event);
  }

  
  return (
    <div id="wizard-step-three">
      <Styles>
        <Stepper
          steps={[
            { title: "CUSTOMER DETAILS" },
            { title: "PET INFO" },
            { title: "CONFIRM BOOKING" }
          ]}
          activeStep={2}
        />
        <h1>We are assigning a vet to your case</h1>
        <Wizard
          initialValues={{
            employed: true,
            stooge: "larry",
            date: new Date()
          }}
          firebase={props.firebase}
          date={date}
          setDate={setDate}
        >
          <Wizard.Page
            validate={values => {
              const errors = {};
              if (!values.otpcode) {
                errors.type = "Required";
              }
              return errors;
            }}
          >
            <h3>We have sent an OTP to your phone number</h3>
            <div>
              <label>OTP CODE</label>
              <Field
                name="token"
                component="input"
                type="text"
                placeholder="otp code"
                validate={required}
              />
            </div>

            <p>
              Is there anything else you would like to update about this case,
              for example, pass some more detailed information to the vet for
              better understanding about the case.
            </p>
          </Wizard.Page>
        </Wizard>
      </Styles>
    </div>
  );
};
const WizardForm4 = withFirebase(WizardFormBase);

export default WizardForm4;
