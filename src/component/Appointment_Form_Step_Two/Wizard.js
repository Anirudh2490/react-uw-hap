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
      prevData: "",
      petMessage: ""
    };
  }

  componentWillMount() {
    const petList = []
    this.props.firebase.fsdb
          .collection("form-inquiry")
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


    // if (window.localStorage.getItem("dbDocID") === null) {
    //   this.props.history.push("/", {
    //     message: "Register for a vet a visit from here."
    //   });
    // } else {
    //   if (this.state.values === "") {
    //     this.props.firebase.fsdb
    //       .collection("form-inquiry")
    //       .doc(window.localStorage.getItem("dbDocID"))
    //       .get()
    //       .then(doc => {
    //         this.setState(
    //           {
    //             values: {
    //               petname: doc.data().petDetails.petname,
    //               type: doc.data().petDetails.type,
    //               gender: doc.data().petDetails.gender,
    //               notes: doc.data().petDetails.notes,
    //               petdate: doc.data().petDetails.petdate,
    //               phone: doc.data().customerDetails.phone,
    //               name: doc.data().customerDetails.name,
    //               email: doc.data().customerDetails.email
    //             }
    //           },
    //           () => {
    //             const { petList } = this.state;
    //             this.props.setClientName(doc.data().customerDetails.name)
    //             //search phone number in database
    //             this.props.firebase.fsdb
    //               .collection("form-inquiry")
    //               .where(
    //                 "customerDetails.phone",
    //                 "==",
    //                 `${this.state.values.phone}`
    //               )
    //               .get()
    //               .then(querySnapshot => {
    //                 if (querySnapshot.empty) {
    //                 } else {
    //                   querySnapshot.forEach(doc => {
    //                     petList.push({
    //                       petId: doc.id,
    //                       petDoc: doc.data().petDetails
    //                     });
    //                   });
    //                   this.setState(
    //                     {
    //                       petList
    //                     },
    //                     () => {
    //                       // console.log(petList);
    //                       if (petList.length === 1) {
    //                         this.setState(state => ({
    //                           page: Math.min(
    //                             state.page + 1,
    //                             this.props.children.length - 1
    //                           )
    //                         }));
    //                       }
    //                       this.props.setPet(petList);
    //                     }
    //                   );
    //                 }
    //               });
    //           }
    //         );
    //       })
    //       .catch(error => {
    //         console.log(error);
    //       });
    //   }
    // }
  }

  componentWillReceiveProps(nextprops) {
    // console.log(nextprops);

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
                session: doc.data().sessionDetails.Date,
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
          this.setState(
            state => ({
              page: Math.min(state.page + 1, this.props.children.length - 1)
            }));
        }
      );
    }
  }

  onSubmit = values => {
    // console.log(values);

    // const showAlert =
    //   values["petname"] === undefined ||
    //   values["type"] === undefined ||
    //   values["gender"] === undefined ||
    //   values["notes"] === "";

    // var phone;

    // // if (phone === undefined) {
    // this.props.firebase.fsdb
    //   .collection("form-inquiry")
    //   .doc(window.localStorage.getItem("dbDocID"))
    //   .get()
    //   .then(doc => {
    //     phone = doc.data().customerDetails.phone;
    //   })
    //   .then(() => {
    //     const twilioVerification = phone.split(" ");

    //     if (showAlert) {
    //       alert("Please fill all the fields");
    //     } else {
    //       this.props.firebase.fsdb
    //         .collection("form-inquiry")
    //         .doc(window.localStorage.getItem("dbDocID"))
    //         .update({
    //           "petDetails.petdate": `${this.props.petage}`,
    //           "petDetails.petname": `${values["petname"]}`,
    //           "petDetails.type": `${values["type"]}`,
    //           "petDetails.gender": `${values["gender"]}`,
    //           "petDetails.notes": `${values["notes"]}`
    //         })
    //         .then(res => {
    //           fetch(
    //             "https://hug-a-pet.herokuapp.com/verification/start/send-otp",
    //             {
    //               method: "POST",
    //               mode: "cors",
    //               cache: "no-cache",
    //               credentials: "same-origin",
    //               headers: {
    //                 "Content-Type": "application/json"
    //               },
    //               redirect: "follow",
    //               referrer: "no-referrer",
    //               body: JSON.stringify({
    //                 countryCode: twilioVerification[0],
    //                 phoneNumber: twilioVerification[1] + twilioVerification[2]
    //               })
    //             }
    //           )
    //             .then(res => {
    //               res.json().then(res => {
    //                 console.log(res);

    //                 window.localStorage.setItem("newUser", res);
    //               });

    //               //APPI CALL FOR TWILIO MSG
    //               fetch("https://hug-a-pet.herokuapp.com/api/messages", {
    //                 method: "POST",
    //                 mode: "cors",
    //                 cache: "no-cache",
    //                 credentials: "same-origin",
    //                 headers: {
    //                   "Content-Type": "application/json"
    //                 },
    //                 redirect: "follow",
    //                 referrer: "no-referrer",
    //                 body: JSON.stringify({
    //                   to: values.phone,
    //                   body: `Hi ${
    //                     values.name
    //                   }! thankyou for registering at Hug a Pet, you will be notified once a vet is assigned to your case`
    //                 })
    //               })
    //                 .then(() => {
    //                   //APPI CALL FOR TWILIO Email
    //                   fetch("https://hug-a-pet.herokuapp.com/send/mail", {
    //                     method: "POST",
    //                     mode: "cors",
    //                     cache: "no-cache",
    //                     credentials: "same-origin",
    //                     headers: {
    //                       "Content-Type": "application/json"
    //                     },
    //                     redirect: "follow",
    //                     referrer: "no-referrer",
    //                     body: JSON.stringify({
    //                       emailReceiver: values.email,
    //                       emailSubject:
    //                         "Hi " +
    //                         values.name +
    //                         " Thankyou for registering at Hug a Pet!",
    //                       emailContent:
    //                         "Hi " +
    //                         values.name +
    //                         "! thankyou for registering at Hug a Pet, you will be notified once a vet is assigned to your case."
    //                     })
    //                   });
    //                 })
    //                 .then(() => {
                      this.props.history.push(ROUTES.BOOKING_VERIFICATION);
    //                 });
    //             })
    //             .catch(rej => {
    //               alert("There is some error");
    //             });
    //         })
    //         .catch(rej => {
    //           console.log(rej);
    //           alert(rej);
    //         });
    //     }
    //   });
    // }
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


    // event.preventDefault();
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
    return (
      <Form
        initialValues={values}
        validate={this.validate}
        onSubmit={this.handleSubmit}
      >
        {({ handleSubmit, submitting, values }) => (
          <form   className="wizard-form"  onSubmit={e => this.handleSubmit(e, values)}>
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
                <button type="submit" disabled={submitting}>
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
