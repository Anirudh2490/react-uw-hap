import React, { useState } from "react";
import Styles from "./Styles";
import { Field } from "react-final-form";
import Wizard from "./Wizard";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import Stepper from "react-stepper-horizontal";
import "react-datepicker/dist/react-datepicker.css";
import Chat from '../ChatBot/PostBooking';
import './index.css';

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
  const [emailError, setEmailError] = useState("");
  const [docID, setdocID] = useState("");
  const [date, setDate] = useState(new Date());

  function dateUpdate(event) {
    setDate(event);
  }

  function errorHandler() {
    setEmailError(
      <p>
        Email already exists please <a href={ROUTES.SIGNIN}>signin</a>
      </p>
    );
  }
  return (
    <Styles>
      <div className="stepper">
        <Stepper
          steps={[
            { title: "CUSTOMER DETAILS" },
            { title: "PET INFO" },
            { title: "CONFIRM BOOKING" }
          ]}
          activeStep={2}
        />
      </div>
      <h1>Booking Successful</h1>
      <Wizard 
        initialValues={{ employed: true, stooge: "larry", date: new Date() }}
        firebase={props.firebase}
        date={date}
        emailPrompt={errorHandler}
        setdocID={setdocID}
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
            <h4 style={{textAlign: "center"}}>Thanks for booking at HUGAPET</h4>
          <h2>We will soon assign a vet to your case</h2>
          {/* <div style={{ height: "163px", margin: "0" }}>
            <Field
              name="otpnotes"
              type="text"
              placeholder="My dog is a Golden retriever..."
              component="input"
            />
          </div> */}
        </Wizard.Page>
      </Wizard>
      <div>
        <Chat />
      </div>
    </Styles>
  );
};
const WizardForm5 = withFirebase(WizardFormBase);

export default WizardForm5;
