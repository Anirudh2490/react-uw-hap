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
      this.props.history.push("/", {
        message: "Register for a vet a visit from here."
      });
    } else {
      this.props.firebase.fsdb
        .collection("form-inquiry")
        .doc(window.localStorage.getItem("dbDocID"))
        .get()
        .then(doc => {
          console.log(doc);
          
          if (doc.data().bookingStatus.status === "Confirmed" || window.localStorage.getItem("contWithOutLogin") === "true") {
          
            if (true) {
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
                    emailReceiver: doc.data().customerDetails.email,
                    emailSubject:
                      "Hi " +
                      doc.data().customerDetails.name +
                      " Thankyou for registering at Hug a Pet!",
                    emailContent: {
                      customerDetails: {
                        name: doc.data().customerDetails.name,
                        zipcode: doc.data().customerDetails.zipcode,
                        phone: doc.data().customerDetails.phone,
                        email: doc.data().customerDetails.email,
                        service: doc.data().customerDetails.service
                      },
                      vetDetails: {
                        isVetAssigned: false,
                        vetName: ""
                      },
                      sessionDetails: {
                        Date: doc.data().sessionDetails.Date,
                        session: doc.data().sessionDetails.session
                      },
                      petDetails: {
                        petdate: doc.data().petDetails.petdate,
                        petname: doc.data().petDetails.petname,
                        type: doc.data().petDetails.type,
                        gender: doc.data().petDetails.gender,
                        notes: doc.data().petDetails.notes
                      },
                      bookingStatus: {
                        phoneVerfication: false,
                        status: "Not confirmed"
                      }
                    }
                  })
                }
              ).then(res => {
                window.localStorage.removeItem("dbDocID");
                window.localStorage.removeItem("contWithOutLogin");
                window.localStorage.removeItem("newUser");
                this.props.history.push(
                  `${ROUTES.BOOKING_VERIFICATION}/opt-successfully-verified`
                );
              });
            }
          } else {
            this.setState({
              values: {
                petname: doc.data().petDetails.petname,
                type: doc.data().petDetails.type,
                gender: doc.data().petDetails.gender,
                petdate: doc.data().petDetails.petdate,
                notes: doc.data().petDetails.notes,
                phone: doc.data().customerDetails.phone,
                name: doc.data().customerDetails.name,
                email: doc.data().customerDetails.email,
                zipcode: doc.data().customerDetails.zipcode,
                service: doc.data().customerDetails.service,
                isVetAssigned: doc.data().vetDetails.isVetAssigned,
                Date: doc.data().sessionDetails.Date,
                session: doc.data().sessionDetails.session
              }
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  next = values => {
    this.props.setisLoading(true);
    const {  token } = this.props;
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
              })
              this.props.firebase.fsdb
              .collection("userCollection")
              .doc(uid)
              .set({
                name: this.state.values.name,
                email: this.state.values.email,
                phone: this.state.values.phone,
                uid: uid,
                userrole: "customer"
              },{merge: true})
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
                          phoneVerfication: false,
                          status: "Not confirmed"
                        }
                      }
                    })
                  }
                ).then(res => {
                  window.localStorage.removeItem("dbDocID");
                  window.localStorage.removeItem("contWithOutLogin");
                  window.localStorage.removeItem("newUser");
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
          <form className="wizard-form">
            {activePage}
            <div className="buttons">
              <button
                type="submit"
                onClick={e => this.handleSubmit(e, values)}
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
