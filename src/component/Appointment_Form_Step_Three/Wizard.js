import React from "react";
import { Form } from "react-final-form";
import { withRouter } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
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
          console.log(doc);
          let userData = doc.data()          
          console.log('My data', userData);
          return userData;
        })
        .then((userData)=>{
          if (userData.bookingStatus.status === "Confirmed") {
            console.log("email sent out");
            
              fetch(
                "https://hug-a-pet.herokuapp.com/admin/admin-verification-mail",
                {
                  method: "POST",
                  mode: "cors",
                  cache: "no-cache",
                  credentials: "same-origin",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  redirect: "follow",
                  referrer: "no-referrer",
                  body: JSON.stringify({
                    emailReceiver: userData.customerDetails.email,
                    emailSubject:
                      "Hi " +
                      userData.customerDetails.name +
                      " Thankyou for registering at Hug a Pet!",
                    emailContent: {
                      customerDetails: {
                        name: userData.customerDetails.name,
                        zipcode: userData.customerDetails.zipcode,
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
                  })
                }
              ).then(res => {
                
                res.json().then((res)=>{
                    console.log(res);
                    
                });
                
                window.localStorage.removeItem("dbDocID");
                window.localStorage.removeItem("contWithOutLogin");
                window.localStorage.removeItem("newUser");
              })
              .then(()=>{
                this.props.history.push(
                  `${ROUTES.BOOKING_VERIFICATION}/opt-successfully-verified`
                );
              })
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
                zipcode: userData.customerDetails.zipcode,
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
          console.log(phone);

          var twilioVerification = phone.split(" ");
          fetch("https://hug-a-pet.herokuapp.com/verification/start/send-otp", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json"
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify({
              countryCode: twilioVerification[0],
              phoneNumber: twilioVerification[1] + twilioVerification[2]
            })
          }).then(res => {
            if (res.status === 400) {
              this.props.setresendOtp(false);
              this.props.setTimer(Date.now() + 30000);
              alert("Invalid Number");
            } else {
              this.props.setresendOtp(false);
              res.json().then(res => {
                console.log(res);
                window.localStorage.setItem("newUser", res);
              });
            }
          });
        });
    }
  }

  next = values => {
    this.props.setresendOtp(false);
    this.props.setisLoading(true);
    const { token } = this.props;
    const { phone } = this.state.values;
    const twilioVerification = phone.split(" ");
    console.log(twilioVerification, token);

    // verify-otp
    fetch("https://hug-a-pet.herokuapp.com/verification/start/verify-otp", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      redirect: "follow",
      referrer: "no-referrer",
      body: JSON.stringify({
        token: token,
        phoneNumber: twilioVerification[1] + twilioVerification[2]
      })
    }).then(res => {
      this.props.setisLoading(false);
      if (res.status === 400) {
        alert("Invalid Code");
      } else {
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
              });
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
                console.log(this.state);
                
                fetch(
                  "https://hug-a-pet.herokuapp.com/admin/admin-verification-mail",
                  {
                    method: "POST",
                    mode: "cors",
                    cache: "no-cache",
                    credentials: "same-origin",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    redirect: "follow",
                    referrer: "no-referrer",
                    body: JSON.stringify({
                      emailReceiver: values.email,
                      emailSubject:
                        "Hi " +
                        values.name +
                        " Thankyou for registering at Hug a Pet!",
                      emailContent: {
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
                    })
                  }
                )
                .then(()=>{
                  window.localStorage.removeItem("contWithOutLogin");
                  window.localStorage.removeItem("dbDocID");
                  window.localStorage.removeItem("newUser");
                })
                .then(res => {
                  this.props.history.push(
                    `${ROUTES.BOOKING_VERIFICATION}/opt-successfully-verified`
                  );
                });
              });
          });
        // });
      }
    });
  };

  previous = (event, values) => {};
  /**
   * NOTE: Both validate and handleSubmit switching are implemented
   * here because 🏁 Redux Final Form does not accept changes to those
   * functions once the form has been defined.
   */

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
          <form onSubmit={e => this.handleSubmit(e, values)} className="wizard-form">
            {activePage}
            <div className="buttons">
              <button
                type="submit"
                disabled={submitting}
              >
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
