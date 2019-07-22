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

  componentDidMount() {
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
          if (doc.data().bookingStatus.status === "Confirmed") {
            window.localStorage.removeItem("dbDocID");
            this.props.history.push(
              `${ROUTES.BOOKING_VERIFICATION}/opt-successfully-verified`
            );
          } else {
            console.log('esle block');
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
    console.log(this.state.values);
    
    const { token, phone, name, email, zipcode } = this.state.values;
    const twilioVerification = phone.split(" ");
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
      if (res.status === 400) {
        alert("Invalid Code");
      } else {
        // let code = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTU2Mzc1Mzg5NiwiZXhwIjoxNTYzNzU3NDk2LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1zbm9vb0BodWdhcGV0LWRlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstc25vb29AaHVnYXBldC1kZS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6InN3ZWV0LXRvb3RoIn0.kl9KG7mZ3fWuI60XGpOntvcDvNQfRXuhNAB0yvvadLIuHGGqO4W4TCjx2hrPVZXTOEKFEoHLQNJXOX5ttCtH9oIIi_zrtqrKBtC85-en3daZeXkxFXyTrXqnuFewzCvF37l6-BjlJ47l4xAeXouLpBI9JHqQxF8BO0SQwbtn0cybhRawsidOLm7IlfaJhRpjjrnRaXf8EoBHPbjCcwPQKb-_o2bhJ0peUrKwtXfGIW2f2KNpGw-_jT6xfyrOrPTEOMLMLbALF23_JNSf7crUGATbU1Bq4Gzi2kZPZhgXuBwJvULlcdR8Rvg0UsQSJdWUMfOxCoOk2WQA7ZE2RUjmYQ"
        this.props.firebase
          .doSignInWithCustomToken(window.localStorage.getItem("newUser"))
                    .then(authUser => {
            const uid = authUser.user.uid;
            // this.props.firebase.fsdb
            //   .collection(
            //     `userCollection/${
            //       this.props.firebase.auth.currentUser.uid
            //     }/appointments/`
            //   )
            //   .doc(window.localStorage.getItem("dbDocID"))
            //   .set({
            //     appointmentID: window.localStorage.getItem("dbDocID")
            //   })
            // .then(() => {
            this.props.firebase.fsdb
              .collection("form-inquiry")
              .doc(window.localStorage.getItem("dbDocID"))
              .update({
                "bookingStatus.phoneVerfication": true,
                "bookingStatus.status": "Confirmed",
                "customerDetails.uid": uid
              })

              .then(() => {
                // window.localStorage.removeItem("dbDocID");
                // window.localStorage.removeItem("newUser");
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
