import React from "react";
import { Form } from "react-final-form";
import { withRouter } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { sendOtp, verifyOtp } from "../../services/otp";
import { sendEmailToAdmin } from "../../services/emails";

class WizardBase extends React.Component {
  static Page = ({ children }) => children;

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      values: props.initialValues || {},
      docID: ""
    };
  }

  componentWillMount() {
    if (window.localStorage.getItem("dbDocID") === null) {
      this.props.history.push("/");
    } else {
      this.props.firebase.fsdb
        .collection("form-inquiry")
        .doc(window.localStorage.getItem("dbDocID"))
        .get()
        .then(doc => {
          let userData = doc.data();
          return userData;
        })
        .then(userData => {
          if (userData.bookingStatus.status === "Confirmed") {
            sendEmailToAdmin(
              userData.customerDetails.email,
              "Hi " +
                userData.customerDetails.name +
                " Thankyou for registering at Hug a Pet!",
              {
                customerDetails: {
                  name: userData.customerDetails.name,
                  address: userData.customerDetails.address,
                  phone: userData.customerDetails.phone,
                  email: userData.customerDetails.email,
                  service: userData.customerDetails.service
                },
                vetDetails: {
                  isVetAssigned: false,
                  vetName: ""
                },
                sessionDetails: {
                  Date: userData.sessionDetails.Date,
                  session: userData.sessionDetails.session
                },
                petDetails: {
                  petdate: userData.petDetails.petdate,
                  petname: userData.petDetails.petname,
                  type: userData.petDetails.type,
                  gender: userData.petDetails.gender,
                  notes: userData.petDetails.notes
                },
                bookingStatus: {
                  phoneVerfication: false,
                  status: "Not confirmed"
                }
              }
            )
              .then(res => {
                window.localStorage.removeItem("dbDocID");
                window.localStorage.removeItem("contWithOutLogin");
                window.localStorage.removeItem("newUser");
              })
              .then(() => {
                this.props.history.push(
                  `${ROUTES.BOOKING_VERIFICATION}/opt-successfully-verified`
                );
              })
              .catch(rej => {
                console.log(rej);
              });
          } else {
            window.localStorage.removeItem("contWithOutLogin");
            this.setState({
              values: {
                petname: userData.petDetails.petname,
                type: userData.petDetails.type,
                gender: userData.petDetails.gender,
                petdate: userData.petDetails.petdate,
                notes: userData.petDetails.notes,
                phone: userData.customerDetails.phone,
                name: userData.customerDetails.name,
                email: userData.customerDetails.email,
                address: userData.customerDetails.address,
                service: userData.customerDetails.service,
                isVetAssigned: userData.vetDetails.isVetAssigned,
                Date: userData.sessionDetails.Date,
                session: userData.sessionDetails.session
              }
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  componentWillReceiveProps(nextProps) {
    var phone;
    if (nextProps.resendOtp === true) {
      this.props.setresendOtp(false);
      this.props.firebase.fsdb
        .collection("form-inquiry")
        .doc(window.localStorage.getItem("dbDocID"))
        .get()
        .then(doc => {
          phone = doc.data().customerDetails.phone;
          sendOtp(phone)
            .then(res => {
              this.props.setresendOtp(false);
              window.localStorage.setItem("newUser", res.data);
            })
            .catch(rej => {
              this.props.setresendOtp(false);
              this.props.setTimer(Date.now() + 30000);
              alert("Invalid Number");
            });
        });
    }
  }

  next = values => {
    this.props.setresendOtp(false);
    this.props.setisLoading(true);
    const { token } = this.props;
    const { phone } = this.state.values;
    verifyOtp(phone, token).then(res => {
      this.props.firebase
        .doSignInWithCustomToken(window.localStorage.getItem("newUser"))
        .then(authUser => {
          const uid = authUser.user.uid;
          this.props.firebase.fsdb
            .collection("form-inquiry")
            .doc(window.localStorage.getItem("dbDocID"))
            .update({
              "bookingStatus.phoneVerfication": true,
              "bookingStatus.status": "Confirmed",
              "customerDetails.uid": uid
            })
            .then(() => {
              this.props.firebase.fsdb
                .collection("userCollection")
                .doc(uid)
                .set(
                  {
                    name: this.state.values.name,
                    email: this.state.values.email,
                    phone: this.state.values.phone,
                    uid: uid,
                    userrole: "customer"
                  },
                  { merge: true }
                )
                .then(() => {
                  this.props.firebase.fsdb
                    .collection(
                      `userCollection/${
                        uid
                      }/pets`
                    )
                    .where(
                      "petDetails.petname",
                      "==",
                      `${values["petname"].toLowerCase()}`
                    )
                    .get()
                    .then(querySnapshot => {
                      if (querySnapshot.empty) {
                        this.props.firebase.fsdb
                          .collection(
                            `userCollection/${
                              this.props.firebase.auth.currentUser.uid
                            }/pets`
                          )
                          .add({
                            petDetails: {
                              petdate: `${this.state.values.petdate}`,
                              petname: this.state.values.petname.toLowerCase(),
                              type: `${this.state.values.type}`,
                              gender: `${this.state.values.gender}`,
                              notes: `${this.state.values.notes}`
                            }
                          });
                      }
                    })
                    .then(() => {
                      if (window.localStorage.getItem("contWithOutLogin") === "true") {
                        sendEmailToAdmin(
                          values.email,
                          "Hi " +
                            values.name +
                            " Thankyou for registering at Hug a Pet!",
                          {
                            customerDetails: {
                              name: this.state.values.name,
                              zipcode: this.state.values.zipcode,
                              phone: this.state.values.phone,
                              email: this.state.values.email,
                              service: this.state.values.service
                            },
                            vetDetails: {
                              isVetAssigned: false,
                              vetName: ""
                            },
                            sessionDetails: {
                              Date: this.state.values.Date,
                              session: this.state.values.session
                            },
                            petDetails: {
                              petdate: values.petdate,
                              petname: values.petname,
                              type: values.type,
                              gender: values.gender,
                              notes: values.notes
                            },
                            bookingStatus: {
                              phoneVerfication: true,
                              status: "Confirmed"
                            }
                          }
                        )
                          .then(() => {
                            window.localStorage.removeItem("contWithOutLogin");
                            window.localStorage.removeItem("dbDocID");
                            window.localStorage.removeItem("newUser");
                            this.props.history.push(
                              `${
                                ROUTES.BOOKING_VERIFICATION
                              }/opt-successfully-verified`
                            );
                          })
                          .catch(rej => {
                            console.log(rej);
                            this.props.setresendOtp(false);
                            this.props.setisLoading(false);   
                          });
                      }
                    })
                    .then(()=>{
                      window.localStorage.removeItem("contWithOutLogin");
                      window.localStorage.removeItem("dbDocID");
                      window.localStorage.removeItem("newUser");
                      this.props.history.push(
                        `${
                          ROUTES.BOOKING_VERIFICATION
                        }/opt-successfully-verified`
                      );
                    })
                });
            })
            .catch(rej => {
              console.log(rej);
              this.props.setresendOtp(false);
             this.props.setisLoading(false);
            });
        });
    })
    .catch((rej)=>{
      console.log(rej);
      alert("Invalid Code Please Try Again")
      this.props.setresendOtp(false);
      this.props.setisLoading(false);
    })
  };

  previous = (event, values) => {};

  validate = values => {
    const activePage = React.Children.toArray(this.props.children)[
      this.state.page
    ];
    return activePage.props.validate ? activePage.props.validate(values) : {};
  };

  handleSubmit = (e, values) => {
    e.preventDefault();
    this.next(values);
  };

  render() {
    const { children } = this.props;
    const { page, values } = this.state;
    const activePage = React.Children.toArray(children)[page];
    return (
      <Form
        initialValues={values}
        validate={this.validate}
        onSubmit={this.handleSubmit}
      >
        {({ handleSubmit, submitting, values }) => (
          <form
            onSubmit={e => this.handleSubmit(e, values)}
            className="wizard-form"
          >
            {activePage}
            <div className="buttons">
              <button type="submit" disabled={submitting}>
                Verify OTP
              </button>
            </div>
          </form>
        )}
      </Form>
    );
  }
}

const Wizard = withRouter(WizardBase);

export default Wizard;
