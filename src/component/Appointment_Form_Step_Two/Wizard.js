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
      if (this.state.values === "") {
        this.props.firebase.fsdb
          .collection("form-inquiry")
          .doc(window.localStorage.getItem("dbDocID"))
          .get()
          .then(doc => {
            console.log(doc.data().customerDetails.phone);

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
                this.props.setPetAge(doc.data().petDetails.petdate);
                const { petList } = this.state;
                this.props.setClientName(doc.data().customerDetails.name);
                //search phone number in database
                if (
                  window.localStorage.getItem("contWithOutLogin") === "true"
                ) {
                  this.setState(state => ({
                    page: Math.min(
                      state.page + 1,
                      this.props.children.length - 1
                    )
                  }));
                } else {
                  this.props.firebase.fsdb
                    .collection("form-inquiry")
                    .where(
                      "customerDetails.phone",
                      "==",
                      `${this.state.values.phone}`
                    )
                    .get()
                    .then(querySnapshot => {
                      console.log(querySnapshot);

                      if (querySnapshot.empty) {
                        this.setState(state => ({
                          page: Math.min(
                            state.page + 1,
                            this.props.children.length - 1
                          )
                        }));
                      } else {
                        console.log(querySnapshot);

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
                            // console.log(petList);
                            if (petList.length === 1) {
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
            );
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }

  componentWillReceiveProps(nextprops) {
    console.log(nextprops);

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
                email: doc.data().customerDetails.email,
                zipcode: doc.data().customerDetails.zipcode,
                service: doc.data().customerDetails.service,
                isVetAssigned: doc.data().vetDetails.isVetAssigned,
                Date: doc.data().sessionDetails.Date,
                session: doc.data().sessionDetails.Date
              }
            },
            () => {
              this.props.setPetAge(doc.data().petDetails.petdate);
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
          this.props.setPetAge("");
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
    } else if (this.props.petage === undefined || this.props.petage === "") {
      this.props.setPetAgeError(true);
    } else if (values.type === undefined || values.type === "") {
      this.props.setTypeError(true);
    } else if (values.gender === undefined || values.gender === "") {
      this.props.setGenderError(true);
    } else if (values.notes === undefined || values.notes === "") {
      this.props.setNotesError(true);
    } else {
      var phone;
      this.props.firebase.fsdb
        .collection("form-inquiry")
        .doc(window.localStorage.getItem("dbDocID"))
        .get()
        .then(doc => {
          phone = doc.data().customerDetails.phone;
        })
        .then(() => {
          const twilioVerification = phone.split(" ");
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
              if (
                this.props.firebase.auth.currentUser === null &&
                window.localStorage.getItem("contWithOutLogin") === null
              ) {
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
                ).then(res => {
                  if (res.status === 400) {
                    this.props.setisLoading(false);
                    this.props.openModal(true);
                  } else {
                    res
                      .json()
                      .then(res => {
                        console.log("code sent", res);
                        window.localStorage.setItem("newUser", res);
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
                            emailReceiver: this.state.values.email,
                            emailSubject:
                              "Hi " +
                              this.state.values.name +
                              " Thankyou for registering at Hug a Pet!",
                            emailContent:
                              "Hi " +
                              this.state.values.name +
                              "! thankyou for registering at Hug a Pet, you will be notified once a vet is assigned to your case."
                          })
                        })
                          // })
                          .then(() => {
                            this.props.history.push(
                              ROUTES.BOOKING_VERIFICATION
                            );
                          });
                      });
                  }
                });
              } else {
                if (this.props.firebase.auth.currentUser !== null) {
                  this.props.firebase.fsdb
                    .collection("form-inquiry")
                    .doc(window.localStorage.getItem("dbDocID"))
                    .get()
                    .then(doc => {
                      console.log(doc);
                      var userData = doc.data();
                      console.log("My data", userData);
                      return userData;
                    })
                    .then(userData => {
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
                          res
                            .json()
                            .then(res => {
                              console.log(res);
                            })

                            .then(() => {
                              //APPI CALL FOR TWILIO Email
                              fetch(
                                "https://hug-a-pet.herokuapp.com/send/mail",
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
                                    emailReceiver:
                                      userData.customerDetails.email,
                                    emailSubject:
                                      "Hi " +
                                      userData.customerDetails.name +
                                      " Thankyou for registering at Hug a Pet!",
                                    emailContent:
                                      "Hi " +
                                      userData.customerDetails.name +
                                      "! thankyou for registering at Hug a Pet, you will be notified once a vet is assigned to your case."
                                  })
                                }
                              )
                                // })
                                .then(() => {
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
                      }
                    });
                }
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
            })
            .catch(rej => {
              this.props.setisLoading(false);
              alert("There is some error");
            });
        });
    }
  };

  next = (e, values) => {
    e.preventDefault();
    this.setState(
      state => ({
        page: Math.min(state.page + 1, this.props.children.length - 1),
        values
      }),
      () => {
        this.props.setPetAge("");
        this.props.setSelectedPetID("");
        this.props.triggerAddNewPetEvent("");
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
        "petDetails.type": `${values["type"]}`,
        "petDetails.gender": `${values["gender"]}`,
        "petDetails.notes": `${values["notes"]}`
      })
      .then(res => {
        console.log(res);

        if (this.props.firebase.auth.currentUser !== null) {
          this.setState(
            state => ({
              page: Math.max(state.page - 1, 0)
            }),
            () => {
              this.props.setPetAge("");
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
      })
      .catch(rej => {
        console.log(rej);
        alert(rej);
      });

    // const validData =
    //   this.props.petage === "" ||
    //   values["petname"] === "" ||
    //   values["type"] === "" ||
    //   values["gender"] === "" ||
    //   values["notes"] === "";
    // console.log(validData);

    // if (!validData) {
    //   this.props.firebase.fsdb
    //     .collection("form-inquiry")
    //     .doc(window.localStorage.getItem("dbDocID"))
    //     .update({
    //       "petDetails.petdate": `${this.props.petage}`,
    //       "petDetails.petname": `${values["petname"]}`,
    //       "petDetails.type": `${values["type"]}`,
    //       "petDetails.gender": `${values["gender"]}`,
    //       "petDetails.notes": `${values["notes"]}`
    //     })
    //     .then(res => {
    //       // console.log(res);
    //       // console.log(res);
    //       // if (this.props.firebase.auth.currentUser !== null) {
    //       //   this.setState(
    //       //     state => ({
    //       //       page: Math.max(state.page - 1, 0)
    //       //     }),
    //       //     () => {
    //       //       this.props.setPetAge("");
    //       //       this.props.setSelectedPetID("");
    //       //       this.props.triggerAddNewPetEvent("");
    //       //     }
    //       //   );
    //       // }else{
    //       //   this.props.history.goBack()
    //       // }
    //       console.log(res);
    //       this.setState(
    //         state => ({
    //           page: Math.max(state.page - 1, 0)
    //         }),
    //         () => {
    //           this.props.setPetAge("");
    //           this.props.setSelectedPetID("");
    //           this.props.triggerAddNewPetEvent("");
    //         }
    //       );
    //     })
    //     .catch(rej => {
    //       console.log(rej);
    //       alert(rej);
    //     });
    // } else {
    //   this.setState(
    //     {
    //       value: {}
    //     },
    //     () => {
    //       this.setState(
    //         state => ({
    //           page: Math.max(state.page - 1, 0)
    //         }),
    //         () => {
    //           this.props.setPetAge("");
    //           this.props.setSelectedPetID("");
    //           this.props.triggerAddNewPetEvent("");
    //         }
    //       );
    //     }
    //   );
    // }
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
    console.log(this.state);
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
              {page > 0 && (
                <button
                  type="button"
                  onClick={event => this.previous(event, values)}
                >
                  « Previous
                </button>
              )}
              {/* {!isLastPage && <button type="submit">Next »</button>} */}
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
