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
      docID: "",
      petList: [],
      prevData: "",
      petMessage: ""
    };
  }

  componentWillMount() {
    console.log("component mounted");

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
          this.setState(
            {
              values: {
                petname: doc.data().petDetails.petname,
                type: doc.data().petDetails.type,
                gender: doc.data().petDetails.gender,
                notes: doc.data().petDetails.notes,
                petdate: doc.data().petDetails.petdate,
                phone: doc.data().customerDetails.phone,
                name: doc.data().customerDetails.name,
                email: doc.data().customerDetails.email
              }
            },
            () => {
              const { petList } = this.state;

              //search phone number in database
              this.props.firebase.fsdb
                .collection("form-inquiry")
                .where(
                  "customerDetails.phone",
                  "==",
                  `${this.state.values.phone}`
                )
                .get()
                .then(querySnapshot => {
                  if (querySnapshot.empty) {
                  } else {
                    querySnapshot.forEach(doc => {
                      petList.push({
                        petId: doc.id,
                        petDoc: doc.data().petDetails
                      });
                    });
                    this.setState(
                      {
                        petList
                      },
                      () => {
                        this.props.setPet(petList);
                      }
                    );
                  }
                });
            }
          );
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.selectedPetID !== "" && nextprops.selectedPetID !== "reset") {
      this.props.firebase.fsdb
        .collection("form-inquiry")
        .doc(nextprops.selectedPetID)
        .get()
        .then(doc => {
          this.setState(
            {
              values: {
                petname: doc.data().petDetails.petname,
                type: doc.data().petDetails.type,
                gender: doc.data().petDetails.gender,
                petdate: doc.data().petDetails.petdate,
                notes: doc.data().petDetails.notes,
                phone: doc.data().customerDetails.phone,
                name: doc.data().customerDetails.name,
                email: doc.data().customerDetails.email
              }
            },
            () => {
              this.props.setPetAge(doc.data().petDetails.petdate);
              this.props.setSelectedPetID("");
            }
          );
        })
        .catch(error => {
          console.log(error);
        });
    } else if (nextprops.selectedPetID === "reset") {
      this.setState(
        {
          values: {}
        },
        () => {
          this.props.setPetAge("");
          this.props.setSelectedPetID("");
          // this.props.setStyleID("")
        }
      );
    }
  }

  next = values => {
    const showAlert =
      values["petname"] === undefined ||
      values["type"] === undefined ||
      values["gender"] === undefined ||
      values["notes"] === "";

       var phone ;

    // if (phone === undefined) {
      this.props.firebase.fsdb
        .collection("form-inquiry")
        .doc(window.localStorage.getItem("dbDocID"))
        .get()
        .then(doc => {
          phone = doc.data().customerDetails.phone;
        })
        .then(() => {
          const twilioVerification = phone.split(" ");

          if (showAlert) {
            alert("Please fill all the fields");
          } else {
            this.props.firebase.fsdb
              .collection("form-inquiry")
              .doc(window.localStorage.getItem("dbDocID"))
              .update({
                "petDetails.petdate": `${this.props.petage}`,
                "petDetails.petname": `${values["petname"]}`,
                "petDetails.type": `${values["type"]}`,
                "petDetails.gender": `${values["gender"]}`,
                "petDetails.notes": `${values["notes"]}`
              })
              .then(res => {
                fetch(
                  "https://hug-a-pet.herokuapp.com/verification/start/send-otp",
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
                      countryCode: twilioVerification[0],
                      phoneNumber: twilioVerification[1] + twilioVerification[2]
                    })
                  }
                )
                  .then(res => {
                    res.json().then(res => {
                      console.log(res);

                      window.localStorage.setItem("newUser", res);
                    });

                    //APPI CALL FOR TWILIO MSG
                    fetch("https://hug-a-pet.herokuapp.com/api/messages", {
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
                        to: values.phone,
                        body: `Hi ${
                          values.name
                        }! thankyou for registering at Hug a Pet, you will be notified once a vet is assigned to your case`
                      })
                    })
                      .then(() => {
                        //APPI CALL FOR TWILIO Email
                        fetch("https://hug-a-pet.herokuapp.com/send/mail", {
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
                            emailContent:
                              "Hi " +
                              values.name +
                              "! thankyou for registering at Hug a Pet, you will be notified once a vet is assigned to your case."
                          })
                        });
                      })
                      .then(() => {
                        this.props.history.push(ROUTES.BOOKING_VERIFICATION);
                      });
                  })
                  .catch(rej => {
                    alert("There is some error");
                  });
              })
              .catch(rej => {
                console.log(rej);
                alert(rej);
              });
          }
        });
    // }
  };

  previous = (event, values) => {
    event.preventDefault();
    const validData =
      this.props.petage === "" ||
      values["petname"] === "" ||
      values["type"] === "" ||
      values["gender"] === "" ||
      values["notes"] === "";
    console.log(validData);

    if (!validData) {
      this.props.firebase.fsdb
        .collection("form-inquiry")
        .doc(window.localStorage.getItem("dbDocID"))
        .update({
          "petDetails.petdate": `${this.props.petage}`,
          "petDetails.petname": `${values["petname"]}`,
          "petDetails.type": `${values["type"]}`,
          "petDetails.gender": `${values["gender"]}`,
          "petDetails.notes": `${values["notes"]}`
        })
        .then(res => {
          console.log(res);
        })
        .catch(rej => {
          console.log(rej);
          alert(rej);
        });
    }

    this.props.history.goBack();
  };
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
          <form>
            {activePage}
            <div className="buttons">
              <button type="button" onClick={e => this.previous(e, values)}>
                « Previous
              </button>
              <button
                type="submit"
                onClick={e => this.handleSubmit(e, values)}
                disabled={submitting}
              >
                Submit
              </button>
            </div>
            {/* 
            <pre>
              <p>Gender: {this.state.values.gender} </p>
              <p>Notes: {this.state.values.notes} </p>
              <p>Petname: {this.state.values.petname} </p>
              <p>Type: {this.state.values.type} </p>
            </pre> */}
          </form>
        )}
      </Form>
    );
  }
}

const Wizard = withRouter(WizardBase);

export default Wizard;
