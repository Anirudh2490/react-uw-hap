import React, { useState, Fragment } from "react";
import Styles from "./Styles";
import { Field } from "react-final-form";
import Wizard from "./Wizard";
import { withFirebase } from "../Firebase";
// import Modal from "react-awesome-modal";
// import { Link } from "react-router-dom";
// import * as ROUTES from "../../constants/routes";
import moment from "moment";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/dist/style.css";
import DatePicker from "react-datepicker";
import "./index.css";
import "react-datepicker/dist/react-datepicker.css";
import Countdown from "react-countdown-now";
// import TestimonialSection from "../../common/src/containers/Hosting/Testimonials";
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
  const [number, setNumber] = useState("");
  const [visible, setVisibilty] = useState("");
  const [service, setService] = useState("");
  const [checkOtp, setCheckOtp] = useState("");
  const [resendOtp, setresendOtp] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [token, setToken] = useState(false);
  const [timer, setTimer] = useState("");



  function dateUpdate(event) {
    setDate(event);
  }

  function updateOtp(e) {
    console.log(e.target.value);

    setToken(e.target.value);
    console.log(token);
  }

  function updateNumber(e) {
    setNumber(e);
  }

  function openModal() {
    setVisibilty(true);
  }

  function validateOtp() {
    setCheckOtp(true);
  }

  function closeModal() {
    // setCheckOtp(false)
    setVisibilty(false);
  }

  function triggerresendOtp() {
    setTimer(Date.now() + 30000)
    setresendOtp(true);
  }

  let style = {
    otpTimer: {
      margin: "10px",
      color: "white"
    },
    resendBtn: {
      width: "100%",
      margin: "10px 0px 0px",
      cursor: "pointer",
      display: "inline-flex",
      backgroundImage: "none",
      alignItems: "center",
      justifyContent: "center",
      color: " #ffffff",
      backgroundColor: "#028489",
      minHeight: "46px",
      minWidth: "48px",
      borderRadius: "3px",
      fontFamily: "inherit",
      fontSize: "16px",
      fontWeight: "500",
      textDecoration: "none",
      textTransform: "capitalize",
      paddingTop: "8px",
      paddingBottom: "8px",
      paddingLeft: "15px",
      paddingRight: "15px",
      border: "0",
      transition: "all 0.3s ease",
      color: "#ffffff",
      backgroundColor: "#eb4d4b",
      borderColor: "#eb4d4b",
      boxSizing: "border-box",
      paddingLeft: "22px",
      paddingRight: "22px",
      height: "48px",
      fontSize: "14px"
    }
  };
  return (
    <div id="wizard-step-one">
      <Styles>
        <div style={{ textAlign: "center" }}>
          <h1>Great, you are looking for an appointment for {service}</h1>
          <a href="#">Free video consultation on confirmed appointment</a>
          <p>We can honor the appointment upto one hour after inquiry time.</p>
        </div>
        <h2>Step 2 of 4</h2>
        <div>
          {/* <Modal
            visible={visible}
            width="400"
            height="300"
            effect="fadeInUp"
            // onClickAway={() => closeModal()}
          >
            <section id="contact_section" className="sc-bdVaJa gfSVMY">
              <div className="container sc-EHOje gzbFsC">
                <div
                  style={{ marginBottom: "25px" }}
                  className="sc-bdVaJa hbDlSm"
                >
                  <h2
                    fontSize="6,8"
                    fontWeight="400"
                    color="headingColor"
                    letterSpacing="-0.025em"
                    className="sc-htpNat kpHkZI"
                  >
                    Welcome back to HugAPet!
                  </h2>
                  <span
                    display="block"
                    fontSize="2"
                    letterSpacing="0.15em"
                    fontWeight="6"
                    color="primary"
                    className="sc-bwzfXH gdhEJB"
                  >
                    We've sent you a passcode on your phone. Please enter to
                    login
                  </span>
                </div>
                <div className="sc-bdVaJa kQXApq">
                  <div
                    width="80%"
                    style={{ width: "80%" }}
                    className="sc-bdVaJa iqngkO"
                  >
                    <div
                      style={{ width: "100%", margin: "auto" }}
                      className="reusecore__input email_input  sc-kpOJdX gaENIB"
                    >
                      <div className="field-wrapper">
                        <input
                          name="token"
                          component="input"
                          type="text"
                          onChange={(e)=>{updateOtp(e)}}
                          placeholder="otp code"
                        />
                      </div>
                    </div>
                    <div>
                      <div id="pop-button-two">
                        <button
                          style={{ width: "100%", margin: "10px 0 0 0" }}
                          type="button"
                          // className="reusecore__button pop-button"
                          fontSize="2"
                          fontWeight="600"
                          height="4"
                          onClick={() => validateOtp()}
                        >
                          <span className="btn-text">Submit</span>
                        </button>
                      </div>
                      <div id="pop-button-two">
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
                      </div>
                      <div id="pop-button-one">
                        <button
                          style={{ width: "100%", margin: "10px 0 0px 0" }}
                          type="button"
                          // className="reusecore__button pop-button"
                          fontSize="2"
                          fontWeight="600"
                          height="4"
                          onClick={() => closeModal()}
                        >
                          <span className="btn-text">Close</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section> */}
          {/* <div style={{ textAlign: "center" }}>
              <h1 />

              <div>
                <label>OTP CODE</label>
                <input
                  name="token"
                  component="input"
                  type="text"
                  placeholder="otp code"
                />
              </div>
              <button onClick={() => validateOtp()}>Submit</button>
              <button onClick={() => closeModal()}>Close</button>
            </div> */}
          {/* </Modal> */}
        </div>
        <Wizard
          firebase={props.firebase}
          setDate={setDate}
          openModal={openModal}
          setService={setService}
          setCheckOtp={setCheckOtp}
          number={number}
          modalStatus={visible}
          setVisibilty={setVisibilty}
          checkOtp={checkOtp}
          setisLoading={setisLoading}
          resendOtp={resendOtp}
          setresendOtp={setresendOtp}
          date={date}
          token={token}
          setTimer={setTimer}
          setNum={setNumber}
        >
          <Wizard.Page>
            {isLoading ? (
              <div style={{ height: "200px" }}>
                <div style={{ display: "inline-block", margin: "auto" }}>
                  <div class="loader" />
                  <div>
                    <p>Searching number in database</p>
                  </div>
                </div>
              </div>
            ) : (
              <Fragment>
                {" "}
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
              </Fragment>
            )}
          </Wizard.Page>
          <Wizard.Page>
            <section id="contact_section" className="sc-bdVaJa gfSVMY">
              <div className="container sc-EHOje gzbFsC">
                <div
                  style={{ marginBottom: "25px" }}
                  className="sc-bdVaJa hbDlSm"
                >
                  <h2
                    fontSize="6,8"
                    fontWeight="400"
                    color="headingColor"
                    letterSpacing="-0.025em"
                    className="sc-htpNat kpHkZI"
                  >
                    Welcome back to HugAPet!
                  </h2>
                  <span
                    display="block"
                    fontSize="2"
                    letterSpacing="0.15em"
                    fontWeight="6"
                    color="primary"
                    className="sc-bwzfXH gdhEJB"
                  >
                    We've sent you a passcode on your phone. Please enter to
                    login
                  </span>
                </div>
                <div className="sc-bdVaJa kQXApq">
                  <div
                    width="80%"
                    style={{ width: "80%", margin: "auto" }}
                    className="sc-bdVaJa iqngkO"
                  >
                    <div
                      style={{ width: "100%", margin: "auto" }}
                      className="reusecore__input email_input  sc-kpOJdX gaENIB"
                    >
                      <div className="field-wrapper">
                        <input
                          name="token"
                          component="input"
                          type="text"
                          onChange={e => {
                            updateOtp(e);
                          }}
                          placeholder="otp code"
                        />
                      </div>
                    </div>
                    <div>
                      <div id="pop-button-two">
                        <button
                          style={{ width: "100%", margin: "10px 0 0 0" }}
                          type="button"
                          // className="reusecore__button pop-button"
                          fontSize="2"
                          fontWeight="600"
                          height="4"
                          onClick={() => validateOtp()}
                        >
                          <span className="btn-text">Submit</span>
                        </button>
                      </div>
                      <div id="pop-button-two">
                        <Countdown key={timer} date={Date.now() + 30000}>
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
                      {/* <div id="pop-button-one">
                        <button
                          style={{ width: "100%", margin: "10px 0 0px 0" }}
                          type="button"
                          // className="reusecore__button pop-button"
                          fontSize="2"
                          fontWeight="600"
                          height="4"
                          onClick={() => closeModal()}
                        >
                          <span className="btn-text">Close</span>
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </section>
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
      {/* <TestimonialSection /> */}
    </div>
  );
};
const WizardForm = withFirebase(WizardFormBase);

export default WizardForm;
