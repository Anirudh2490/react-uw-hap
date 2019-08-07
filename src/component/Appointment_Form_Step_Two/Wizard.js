import React from "react";
import { Form } from "react-final-form";
import { withRouter } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { sendOtp } from "../../services/otp";
import { sendEmailToAdmin } from "../../services/emails";

class WizardBase extends React.Component {
  static Page = ({ children }) => children;

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      values: "",
      docID: "",
      petList: [],
      petMessage: ""
    };
  }

  componentWillMount() {
    if (window.localStorage.getItem("dbDocID") === null) {
      this.props.history.push("/");
    } else {
      if (this.props.firebase.auth.currentUser === null) {
        this.setState({
          page: 1
        });
      }
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
                this.props.setPetAge(parseInt(doc.data().petDetails.petdate));
                this.props.petTypeUpdate(doc.data().petDetails.type);
                const { petList } = this.state;
                this.props.setClientName(doc.data().customerDetails.name);
                this.props.setGenderRadio(doc.data().petDetails.gender)
                //search phone number in database
                if (
                  window.localStorage.getItem("contWithOutLogin") === "true" ||
                  this.props.firebase.auth.currentUser === null
                ) {
                  this.setState(state => ({
                    page: Math.min(
                      state.page + 1,
                      this.props.children.length - 1
                    )
                  }));
                } else {
                  if (this.props.firebase.auth.currentUser !== null) {
                    this.props.firebase.fsdb
                      .collection(
                        `userCollection/${
                          this.props.firebase.auth.currentUser.uid
                        }/pets`
                      )
                      .get()
                      .then(querySnapshot => {
                        if (querySnapshot.empty) {
                          this.setState(state => ({
                            page: Math.min(
                              state.page + 1,
                              this.props.children.length - 1
                            )
                          }));
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
                              if (petList.length === 0) {
                                this.setState(state => ({
                                  page: Math.min(
                                    state.page + 1,
                                    this.props.children.length - 1
                                  )
                                }));
                              }
                              this.props.setPet(petList);
                            }
                          );
                        }
                      });
                  }
                }
              }
            );
          })
          .catch(error => {
            console.log(error);
          });
    }
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.validNum === true) {
      this.props.firebase.fsdb
        .collection("form-inquiry")
        .doc(window.localStorage.getItem("dbDocID"))
        .update({
          "customerDetails.phone": `${this.props.number}`
        })
        .then(() => {
          this.props.setvalidNum(false);
          this.props.closeModal();
        });
    }

    if (nextprops.selectedPetID !== "") {
      this.props.firebase.fsdb
        .collection(
          `userCollection/${this.props.firebase.auth.currentUser.uid}/pets`
        )
        .doc(`${nextprops.selectedPetID}`)
        .get()
        .then(doc => {
          this.setState(
            {
              values: {
                petname: doc.data().petDetails.petname,
                type: doc.data().petDetails.type,
                gender: doc.data().petDetails.gender,
                petdate: doc.data().petDetails.petdate
              }
            },
            () => {
              this.props.setPetAge(parseInt(doc.data().petDetails.petdate));
              this.props.petTypeUpdate(doc.data().petDetails.type);
              this.props.setGenderRadio(doc.data().petDetails.gender)
              this.setState(
                state => ({
                  page: Math.min(state.page + 1, this.props.children.length - 1)
                }),
                () => {
                  this.props.setSelectedPetID("");
                  this.props.triggerAddNewPetEvent("");
                }
              );
            }
          );
        })
        .catch(error => {
          console.log(error);
        });
    } else if (nextprops.addNewPetEvent) {
      this.setState(
        {
          values: {}
        },
        () => {
          this.props.setPetAge(5);
          this.props.petTypeUpdate("");
          this.props.setSelectedPetID("");
          this.props.triggerAddNewPetEvent("");
          this.setState(state => ({
            page: Math.min(state.page + 1, this.props.children.length - 1)
          }));
        }
      );
    }
  }

  onSubmit = values => {
    if (values.petname === undefined || values.petname === "") {
      this.props.setPetNameError(true);
    } else if (
      this.props.petage === undefined ||
      this.props.petage === "" ||
      this.props.petage.toString() === "NaN"
    ) {
      this.props.setPetAgeError(true);
    } else if (this.props.type === undefined || this.props.type === "") {
      this.props.setTypeError(true);
    } else if (this.props.gender === undefined || this.props.gender === "") {
      this.props.setGenderError(true);
    } else if (values.notes === undefined || values.notes === "") {
      this.props.setNotesError(true);
    } else {
      this.props.setisLoading(true);
      var phone;
      this.props.firebase.fsdb
        .collection("form-inquiry")
        .doc(window.localStorage.getItem("dbDocID"))
        .get()
        .then(doc => {
          phone = doc.data().customerDetails.phone;
        })
        .then(() => {
          this.props.firebase.fsdb
            .collection("form-inquiry")
            .doc(window.localStorage.getItem("dbDocID"))
            .update({
              "petDetails.petdate": `${this.props.petage}`,
              "petDetails.petname": `${values["petname"].toLowerCase()}`,
              "petDetails.type": `${this.props.type}`,
              "petDetails.gender": `${this.props.gender}`,
              "petDetails.notes": `${values["notes"]}`
            })
            .then(res => {
              if (
                this.props.firebase.auth.currentUser === null &&
                window.localStorage.getItem("contWithOutLogin") === null
              ) {
                sendOtp(phone)
                  .then(res => {
                    window.localStorage.setItem("newUser", res.data);
                  })
                  .then(() => {
                    var userData;
                        this.props.firebase.fsdb
                          .collection("form-inquiry")
                          .doc(window.localStorage.getItem("dbDocID"))
                          .get()
                          .then(doc => {
                            userData = doc.data();
                            sendEmailToAdmin(
                              userData.customerDetails.email,
                              userData.customerDetails.name,
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
                                  phoneVerfication: true,
                                  status: "Confirmed"
                                }
                              }
                            )
                          })
                          .then(() => {
                            this.props.history.push(ROUTES.BOOKING_VERIFICATION);
                          })
                          .catch(rej => {
                            console.log(rej);
                          });
                  })
                  .catch(() => {
                    this.props.setisLoading(false);
                    this.props.openModal(true);
                  });
              } else if (
                window.localStorage.getItem("contWithOutLogin") === "true"
              ) {
                    this.props.history.push(ROUTES.BOOKING_VERIFICATION);
              } else if (this.props.firebase.auth.currentUser !== null) {
                this.props.firebase.fsdb
                  .collection("form-inquiry")
                  .doc(window.localStorage.getItem("dbDocID"))
                  .update({
                    "bookingStatus.phoneVerfication": true,
                    "bookingStatus.status": "Confirmed",
                    "customerDetails.uid": this.props.firebase.auth.currentUser
                      .uid
                  })
                  .then(() => {
                    this.props.firebase.fsdb
                      .collection(
                        `userCollection/${
                          this.props.firebase.auth.currentUser.uid
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
                                petdate: `${this.props.petage}`,
                                petname: values["petname"].toLowerCase(),
                                type: `${this.props.type}`,
                                gender: `${this.props.gender}`,
                                notes: `${values["notes"]}`
                              }
                            });
                        }
                        var userData;
                        this.props.firebase.fsdb
                          .collection("form-inquiry")
                          .doc(window.localStorage.getItem("dbDocID"))
                          .get()
                          .then(doc => {
                            userData = doc.data();
                            sendEmailToAdmin(
                              userData.customerDetails.email,
                              userData.customerDetails.name,
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
                                  phoneVerfication: true,
                                  status: "Confirmed"
                                }
                              }
                            ).then(() => {
                              window.localStorage.removeItem("dbDocID");
                              window.localStorage.removeItem(
                                "contWithOutLogin"
                              );
                              window.localStorage.removeItem("newUser");
                              this.props.history.push(
                                `${
                                  ROUTES.BOOKING_VERIFICATION
                                }/opt-successfully-verified`
                              );
                            });
                          });
                      });
                  });
              }
            })
            .catch(rej => {
              this.props.setisLoading(false);
              alert(rej);
            });
        });
    }

    //APPI CALL FOR TWILIO MSG
    // fetch("https://hug-a-pet.herokuapp.com/api/messages", {
    //   method: "POST",
    //   mode: "cors",
    //   cache: "no-cache",
    //   credentials: "same-origin",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   redirect: "follow",
    //   referrer: "no-referrer",
    //   body: JSON.stringify({
    //     to: values.phone,
    //     body: `Hi ${
    //       values.name
    //     }! thankyou for registering at Hug a Pet, you will be notified once a vet is assigned to your case`
    //   })
    // });
    // .then(() => {
  };

  next = (e, values) => {
    e.preventDefault();
    this.setState(
      {
        values: {}
      },
      () => {
        this.props.setPetAge(5);
        this.props.petTypeUpdate("");
        this.props.setSelectedPetID("");
        this.props.triggerAddNewPetEvent("");
        this.setState(state => ({
          page: Math.min(state.page + 1, this.props.children.length - 1)
        }));
      }
    );
  };

  previous = (event, values) => {
    event.preventDefault();

    this.props.firebase.fsdb
      .collection("form-inquiry")
      .doc(window.localStorage.getItem("dbDocID"))
      .update({
        "petDetails.petdate": `${this.props.petage}`,
        "petDetails.petname": `${values["petname"]}`,
        "petDetails.type": `${this.props.type}`,
        "petDetails.gender": `${this.props.gender}`,
        "petDetails.notes": `${values["notes"]}`
      });

    if (this.state.page === 0) {
      this.props.firebase.fsdb
        .collection("form-inquiry")
        .doc(window.localStorage.getItem("dbDocID"))
        .get()
        .then(doc => {
          this.props.history.push(
            `${ROUTES.BOOK_AN_APPOINTMENT}/${
              doc.data().customerDetails.service
            }`,
            [{ pageNumber: 2 }]
          );
        });
    } else if (this.props.firebase.auth.currentUser !== null) {
      this.setState(
        state => ({
          page: Math.max(state.page - 1, 0)
        }),
        () => {
          this.props.setPetAge(5);
          this.props.setSelectedPetID("");
          this.props.triggerAddNewPetEvent("");
        }
      );
    } else {
      this.props.firebase.fsdb
        .collection("form-inquiry")
        .doc(window.localStorage.getItem("dbDocID"))
        .get()
        .then(doc => {
          this.props.history.push(
            `${ROUTES.BOOK_AN_APPOINTMENT}/${
              doc.data().customerDetails.service
            }`,
            [{ pageNumber: 2 }]
          );
        });
    }
  };

  validate = values => {
    const activePage = React.Children.toArray(this.props.children)[
      this.state.page
    ];
    return activePage.props.validate ? activePage.props.validate(values) : {};
  };

  handleSubmit = (e, values) => {
    e.preventDefault();
    const { children, onSubmit } = this.props;
    const { page } = this.state;
    const isLastPage = page === React.Children.count(children) - 1;
    if (isLastPage) {
      return this.onSubmit(values);
    } else {
      this.next(e, values);
    }
  };

  render() {
    const { children } = this.props;
    const { page, values } = this.state;
    const activePage = React.Children.toArray(children)[page];
    const isLastPage = page === React.Children.count(children) - 1;
    return (
      <Form
        initialValues={values}
        validate={this.validate}
        onSubmit={this.handleSubmit}
      >
        {({ handleSubmit, submitting, values }) => (
          <form
            className="wizard-form"
            onSubmit={e => this.handleSubmit(e, values)}
          >
            {activePage}
            <div className="buttons">
              <button
                type="button"
                onClick={event => this.previous(event, values)}
              >
                « Previous
              </button>
              {!isLastPage && <button type="submit">Add a new Pet »</button>}
              {isLastPage && (
                <button
                  type="submit"
                  disabled={this.props.isLoading ? true : false}
                >
                  Submit »
                </button>
              )}
            </div>
          </form>
        )}
      </Form>
    );
  }
}

const Wizard = withRouter(WizardBase);

export default Wizard;
