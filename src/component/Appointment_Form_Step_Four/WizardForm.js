import React, { useState } from "react";
import Styles from "./Styles";
import { Field } from "react-final-form";
import Wizard from "./Wizard";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Chat from '../ChatBot/PostBooking';
import Stepper from "../../elements/Stepper";
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
      <Stepper
        steps={[
          { title: "CUSTOMER DETAILS" },
          { title: "PET INFO" },
          { title: "CONFIRM BOOKING" }
        ]}
        activeStep={2}
      />
      <h1>Your Account has been Verfied</h1>
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
          <h3 style={{color: "black", border: "none"}}>Thank you for registering at Hug a pet</h3>
          <h2 style={{color: "black", border: "none"}}>We are assigning a vet to your case</h2>
          {/* <p>
            Is there anything else you would like to update about this case,
            for example, pass some more detailed information to the vet for
            better understanding about the case.
          </p> */}
          <div>
            <Chat />
          </div>
        </Wizard.Page>
      </Wizard>
    </Styles>
  );
};
const WizardForm5 = withFirebase(WizardFormBase);

export default WizardForm5;