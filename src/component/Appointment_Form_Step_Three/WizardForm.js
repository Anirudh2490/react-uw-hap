import React, { useState, Fragment } from "react";
import Styles from "./Styles";
import { Field } from "react-final-form";
import Wizard from "./Wizard";
import { withFirebase } from "../Firebase";
import Countdown from "react-countdown-now";


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
  const [token, setToken] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [resendOtp, setresendOtp] = useState("");
  const [timer, setTimer] = useState(Date.now() + 10000);

  function updateOtp(e) {
    setToken(e.target.value);
  }

  function dateUpdate(event) {
    setDate(event);
  }

  function triggerresendOtp() {
    setTimer(Date.now() + 30000);
    setresendOtp(true);
  }

  return (
    <div id="wizard-step-three">
      <Styles>
        <h1>We are assigning a vet to your case</h1>
        <h2>We have sent an OTP to your phone number</h2>
        <h2>Step 4 of 4</h2>
        <Wizard
          initialValues={{ employed: true, stooge: "larry", date: new Date() }}
          firebase={props.firebase}
          date={date}
          isLoading={isLoading}
          setisLoading={setisLoading}
          token={token}
          resendOtp={resendOtp}
          setTimer={setTimer}
          setresendOtp={setresendOtp}
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
            {isLoading ? (
              <div style={{ height: "200px" }}>
                <div style={{ display: "inline-block", margin: "auto" }}>
                  <div className="loader" />
                  <div>
                    <p>Verifying Code</p>
                  </div>
                </div>
              </div>
            ) : (
              <Fragment>
                <div>
                  <label>OTP CODE</label>
                  {/* <Field
              name="token"
              component="input"
              type="text"
              placeholder="otp code"
              validate={required}
            /> */}
                  <input
                    name="token"
                    onChange={e => {
                      updateOtp(e);
                    }}
                    type="text"
                    placeholder="otp code"
                    value={token}
                  />
                </div>
                <div id="pop-button-two">
                  <Countdown key={timer} date={timer}>
                    <button
                      style={{ width: "100%", margin: "10px 0 0 0" }}
                      type="button"
                      // className="reusecore__button pop-button"
                      fontSize="2"
                      fontWeight="600"
                      height="4"
                      onClick={() => triggerresendOtp()}
                    >
                      <span className="btn-text">Resend OTP</span>
                    </button>
                  </Countdown>
                </div>
                <p>
                  Is there anything else you would like to update about this
                  case, for example, pass some more detailed information to the
                  vet for better understanding about the case.
                </p>
              </Fragment>
            )}
          </Wizard.Page>
        </Wizard>
      </Styles>
    </div>
  );
};
const WizardForm4 = withFirebase(WizardFormBase);

export default WizardForm4;
