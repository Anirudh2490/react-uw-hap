import React, { Fragment } from "react";
import Styles from "./Styles";
import { Field } from "react-final-form";
import Wizard from "./Wizard";
import { withFirebase } from "../Firebase";
import moment from "moment";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/dist/style.css";
import DatePicker from "react-datepicker";
import "./index.css";
import "react-datepicker/dist/react-datepicker.css";
import Countdown from "react-countdown-now";
import Stepper from "../../elements/Stepper";
import TestimonialSection from "../../common/src/containers/Hosting/Testimonials";
const INITIAL_STATE = {
  number: "",
  date: new Date(),
  token: "",
  timer: "",
  service: "",
  checkOtp: "",
  isLoading: false,
  disabled: false,
  resendOtp: false,
  emailError: "",
  nameError: "",
  sessionError: "",
  withOutLogin: ""
};
class WizardFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  dateUpdate = event => {
    this.setState({
      date: event
    });
  };

  updateNumber = e => {
    this.setState({
      number: e
    });
  };

  setCheckOtp = e => {
    this.setState({
      checkOtp: e
    });
  };

  setEmailError = e => {
    this.setState({
      emailError: e
    });
  };

  setSessionError = e => {
    this.setState({
      sessionError: e
    });
  };

  setIsDisabled = e => {
    this.setState({
      isDisabled: e
    });
  };

  setNameError = e => {
    this.setState({
      nameError: e
    });
  };

  setwithOutLogin = e => {
    this.setState({
      withOutLogin: e
    });
  };

  continueWithoutLogin = () => {
    this.setwithOutLogin(true);
  };

  setTimer = e => {
    this.setState({
      timer: e
    });
  };

  required = value => (value ? undefined : "Required");

  setDate = e => {
    this.setState({
      date: e
    });
  };

  setService = e => {
    this.setState({
      service: e
    });
  };

  setresendOtp = e => {
    this.setState({
      resendOtp: e
    });
  };

  setisLoading = e => {
    this.setState({
      isLoading: e
    });
  };

  triggerresendOtp = () => {
    this.setTimer(Date.now() + 30000);
    this.setresendOtp(true);
  };

  sessionFocus = () => {
    this.setState({
      sessionError: ""
    });
  };

  emailFocus = () => {
    this.setState({
      emailError: ""
    });
  };

  nameFocus = () => {
    this.setState({
      nameError: ""
    });
  };

  render() {
    return (
      <div id="wizard-step-one">
        <Styles>
          <div style={{ textAlign: "center" }}>
            <Stepper
              steps={[
                { title: "CUSTOMER DETAILS" },
                { title: "PET INFO" },
                { title: "CONFIRM BOOKING" }
              ]}
              activeStep={0}
            />
            <h1>
              Great, you are looking for an appointment for {this.state.service}
            </h1>
            <a href="#">Free video consultation on confirmed appointment</a>
            <p>
              We can honor the appointment upto one hour after inquiry time.
            </p>
            <h2>Step 2 of 4</h2>
          </div>
          <Wizard
            firebase={this.props.firebase}
            setDate={this.setDate}
            setService={this.setService}
            setCheckOtp={this.setCheckOtp}
            number={this.state.number}
            checkOtp={this.state.checkOtp}
            withOutLogin={this.state.withOutLogin}
            setisLoading={this.setisLoading}
            resendOtp={this.state.resendOtp}
            setresendOtp={this.setresendOtp}
            date={this.state.date}
            setIsDisabled={this.setIsDisabled}
            errors={this.state.errors}
            setErrors={this.setErrors}
            setwithOutLogin={this.setwithOutLogin}
            setTimer={this.setTimer}
            setNum={this.updateNumber}
            setEmailError={this.setEmailError}
            setNameError={this.setNameError}
            setSessionError={this.setSessionError}
          >
            <Wizard.Page>
              {this.state.isLoading ? (
                <div style={{ height: "200px" }}>
                  <div style={{ display: "inline-block", margin: "auto" }}>
                    <div className="loader" />
                    <div>
                      <p>Searching number in database</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Fragment>
                  <h4 style={{ color: "white" }}>What is your phone number</h4>
                  <div style={{ margin: "25px 10px" }}>
                    <ReactPhoneInput
                      defaultCountry="de"
                      value={this.state.number}
                      disabled={this.state.isDisabled}
                      inputExtraProps={{
                        name: "phone",
                        required: true,
                        autoFocus: true
                      }}
                      onChange={this.updateNumber}
                    />
                  </div>
                  <label>We will need send an OTP to verify you</label>
                </Fragment>
              )}
            </Wizard.Page>
            <Wizard.Page>
              {this.state.isLoading ? (
                <div style={{ height: "200px" }}>
                  <div style={{ display: "inline-block", margin: "auto" }}>
                    <div className="loader" />
                    <div>
                      <p>Searching number in database</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Fragment>
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
                        <span>
                          We've sent you a passcode on your phone. Please enter
                          to login
                        </span>
                      </div>
                      <div className="sc-bdVaJa kQXApq">
                        <div
                          width="80%"
                          style={{ width: "80%", margin: "auto" }}
                          className="sc-bdVaJa iqngkO"
                        >
                          <div id="otp-feild">
                            <Field
                              name="token"
                              component="input"
                              type="text"
                              placeholder="otp code"
                              validate={this.required}
                            />
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
                                onClick={() => this.continueWithoutLogin()}
                              >
                                <span className="btn-text">
                                  Continue Without Login
                                </span>
                              </button>
                            </div>
                            <div id="pop-button-two">
                              <Countdown
                                key={this.state.timer}
                                date={Date.now() + 30000}
                              >
                                <button
                                  style={{
                                    width: "100%",
                                    margin: "10px 0 0 0"
                                  }}
                                  type="button"
                                  // className="reusecore__button pop-button"
                                  fontSize="2"
                                  fontWeight="600"
                                  height="4"
                                  onClick={() => this.triggerresendOtp()}
                                >
                                  <span className="btn-text">Resend OTP</span>
                                </button>
                              </Countdown>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </Fragment>
              )}
            </Wizard.Page>
            <Wizard.Page>
              <div>
                <label>Email</label>
                <Field
                  name="email"
                  component="input"
                  onFocus={() => this.emailFocus()}
                  type="email"
                  typemismatch="That's not an email address"
                  placeholder="Email"
                  validate={this.required}
                />
                {this.state.emailError ? (
                  <p style={{ color: "white", margin: "0 10px 0 10px" }}>
                    Required
                  </p>
                ) : null}
              </div>
              <div>
                <label>Name</label>
                <Field
                  name="name"
                  onFocus={() => this.nameFocus()}
                  component="input"
                  type="text"
                  placeholder="Name"
                  validate={this.required}
                />
                {this.state.nameError ? (
                  <p style={{ color: "white", margin: "0 10px 0 10px" }}>
                    Required
                  </p>
                ) : null}
              </div>
              <div>
                <label>Date</label>
                <DatePicker
                  minDate={new Date()}
                  className="date-picker"
                  name="date"
                  onChange={e => this.dateUpdate(e)}
                  validate={this.required}
                  value={moment(this.state.date).format("DD-MM-YYYY")}
                />
              </div>
              <div>
                <label>Session</label>
                <Field
                  name="session"
                  onFocus={() => this.sessionFocus()}
                  component="select"
                >
                  <option value="">Choose time</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </Field>
                {this.state.sessionError ? (
                  <p style={{ color: "white", margin: "0 10px 0 10px" }}>
                    Required
                  </p>
                ) : null}
              </div>
            </Wizard.Page>
          </Wizard>
          <a href="#">Free video consultation on confirmed appointment</a>
          <p>We can honor the appointment upto one hour after inquiry time.</p>
        </Styles>
      </div>
    );
  }
}
const WizardForm = withFirebase(WizardFormBase);
const WizardFormWithTestimonial = () => (
  <>
    <WizardForm />
    <TestimonialSection />
  </>
);
export default WizardFormWithTestimonial;
