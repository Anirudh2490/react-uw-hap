import React, { useState } from "react";
import Styles from "./Styles";
import { Field } from "react-final-form";
import Wizard from "./Wizard";
import { withFirebase } from "../Firebase";
import Modal from "react-awesome-modal";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import moment from "moment";

import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/dist/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TestimonialSection from "../../common/src/containers/Hosting/Testimonials";
// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
// const ButtonOptions = ["Untersucheng", "Kastration", "Impung", "Der Letze Weg", "Andere"]

const Error = ({ name }) => (
  <Field
    name={name}
    subscribe={{ touched: true, error: true }}
    render={({ meta: { touched, error } }) =>
      touched && error ? <span>{error}</span> : null
    }
  />
);

/* 
INQUIRY
1. Step 1 -> name, phone, zip, service
2. Step 2 -> date, session, online video consultation
3. Step 3 -> pet details
4. Summary -> OTP validation, user gets created
CONFIRMED
1. Step 1 -> in progress - Video consultation, date is confirmed
2. Step 2 -> visit complete, summary
3. Step 3 -> additional visit
4. Summary
*/

const required = value => (value ? undefined : "Required");

const WizardFormBase = props => {
  const [date, setDate] = useState(new Date());
  const [number, setNumber] = useState("");
  const [visible, setVisibilty] = useState("");
  const [service, setService] = useState("");


  function dateUpdate(event) {
    setDate(event);
  }

  function updateNumber(e) {
    setNumber(e);
  }

  function openModal() {
    setVisibilty(true);
  }

  function closeModal() {
    setVisibilty(false);
  }

  return (
    <div>
      <Styles>
        <div style={{ textAlign: "center" }}>
          <h1>Great, you are looking for an appointment for {service}</h1>
          
          <a href="#">Free video consultation on confirmed appointment</a>
          <p>We can honor the appointment upto one hour after inquiry time.</p>
        </div>
        <h2>Step 2 of 4</h2>
        <div className="modal-name">
          <Modal
            visible={visible}
            width="400"
            height="300"
            effect="fadeInUp"
            onClickAway={() => closeModal()}
          >
            <div style={{ textAlign: "center" }}>
              <h1>You have already registered at Hug a Pet</h1>
              <p>
                Click Here to <Link to={ROUTES.SIGNIN}>Sign In</Link>
              </p>
              <p>Or close to continue with booking an appointment</p>
              <button onClick={() => closeModal()} type="submit">
                Close »
              </button> 
            </div>
          </Modal>
        </div>
        <Wizard
          // initialValues={{ employed: true, stooge: 'larry' }}
          // onSubmit={onSubmit}
          firebase={props.firebase}
          setDate={setDate}
          openModal={openModal}
          setService={setService}
          // emailPrompt={errorHandler}
          number={number}
          modalStatus={visible}
          date={date}
          setNum={setNumber}
          // setdocID={setdocID}
        >
          <Wizard.Page>
            <h4>What is your phone number</h4>
            <label>We will need send an OTP to verify you</label>
            <div style={{ margin: "25px 10px" }}>
              <ReactPhoneInput
                defaultCountry="de"
                value={number}
                inputExtraProps={{
                  name: "phone",
                  required: true,
                  autoFocus: true
                }}
                onChange={updateNumber}
              />
            </div>
          </Wizard.Page>
          <Wizard.Page>
            <div>
              <label>Email</label>
              <Field
                name="email"
                component="input"
                type="email"
                placeholder="Email"
                validate={required}
              />
              <Error name="email" />
            </div>
            <div>
              <label>Name</label>
              <Field
                name="name"
                component="input"
                type="text"
                placeholder="Name"
                validate={required}
              />
              <Error name="zipcode" />
            </div>
            {/* <div>
            <label>Video consultation?</label>
            <Field name="videoconsultation" component="input" type="checkbox" />
            <div align="left">Yes</div>
          </div> */}

            {/* <div>
            <label>Phone Number</label>
            <ReactPhoneInput
              defaultCountry="de"
              value={number}
              onChange={updateNumber}
            />
          </div> */}

            <div> 
              <label>Date</label>
              <DatePicker
                minDate={new Date()}
                className="date-picker"
                onChange={e => dateUpdate(e)}
                validate={required}
                value={moment(date).format("DD-MM-YYYY")}
              />
              <Error name="email" />
            </div>
            <div>
              <label>Session</label>
              <Field name="session" validate={required} component="select">
                <option>Choose time</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </Field>
              <Error name="session" />
            </div>
          </Wizard.Page>
        </Wizard>
      </Styles>
      <TestimonialSection />
    </div>
  );
};
const WizardForm = withFirebase(WizardFormBase);

export default WizardForm;
