import React, { useState } from "react";
import Styles from "./Styles";
import { Field } from "react-final-form";
import Wizard from "./Wizard";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Chat from '../ChatBot/PostBooking'

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
      <Wizard
        initialValues={{ employed: true, stooge: "larry", date: new Date() }}
        firebase={props.firebase}
        date={date}
        emailPrompt={errorHandler}
        setdocID={setdocID}
        setDate={setDate}
        // onSubmit={onSubmit}
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
          <h1>Your Account has been Verfied</h1>
          <h4>Thanks for confirming the OTP</h4>
          <h2>We are assigning a vet to your case</h2>
          <p>
            Is there anything else you would like to update about this case, for
            example, pass some more detailed information to the vet for better
            understanding about the case.
          </p>
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
      <div><Chat/></div>
    </Styles>
  );
};
const WizardForm5 = withFirebase(WizardFormBase);

export default WizardForm5;
