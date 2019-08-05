import React, { useState, Fragment } from "react";
import Styles from "./Styles";
import { Field } from "react-final-form";
import Wizard from "./Wizard";
import { withFirebase } from "../Firebase";
import Countdown from "react-countdown-now";
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
  const [date, setDate] = useState(new Date());
  const [token, setToken] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [resendOtp, setresendOtp] = useState(false);
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
                <h3>We have sent an OTP to your phone number</h3>
                  <label>OTP CODE</label>
                  <input
                    name="token"
                    onChange={e => {
                      updateOtp(e);
                    }}
                    required
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
