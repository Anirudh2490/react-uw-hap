import React from "react";
import { Form } from "react-final-form";
import { withRouter } from "react-router-dom";

class WizardBase extends React.Component {
  static Page = ({ children }) => children;

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      values: props.initialValues || {}
    };
  }

  componentDidMount() {
    // if (window.localStorage.getItem("dbDocID") === null) {
    //   this.props.history.push("/", {
    //     message: "Register for a vet a visit from here."
    //   });
    // } else {
    //   this.props.firebase.fsdb
    //     .collection("form-inquiry")
    //     .doc(window.localStorage.getItem("dbDocID"))
    //     .get()
    //     .then(doc => {
    //       console.log(doc.data());

    //       this.setState(
    //         {
    //           values: {
    //             email: doc.data().customerDetails.email,
    //             phone: doc.data().customerDetails.phone,
    //             name: doc.data().customerDetails.name,
    //             zipcode: doc.data().customerDetails.zipcode,
    //             session: doc.data().sessionDetails.session,
    //             uid: doc.data().customerDetails.uid
    //             // videoconsultation: doc.data().sessionDetails.videoconsultation
    //           }
    //         },
    //         () => {
    //           this.props.setService(doc.data().customerDetails.service);
    //           if (doc.data().sessionDetails.Date) {
    //             this.props.setDate(doc.data().sessionDetails.Date);
    //             this.props.setNum(doc.data().customerDetails.phone);
    //           }
    //         }
    //       );
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // }
  }

  componentWillReceiveProps(nextProps, previousProps) {
    // if (nextProps.modalStatus === false) {
    //   // this.setState(state => ({
    //   //   page: Math.min(state.page + 1, this.props.children.length - 1)
    //   // }));
    // }
    // console.log(nextProps.checkOtp);

    // if (nextProps.checkOtp === true) {
    //   console.log("otp check initiated");
    //   const { token } = this.state.values;
    //   const { number } = this.props;
    //   const twilioVerification = number.split(" ");
    //   console.log(twilioVerification[1] + twilioVerification[2]);

    //   fetch("https://hug-a-pet.herokuapp.com/verification/start/verify-otp", {
    //     method: "POST",
    //     mode: "cors",
    //     cache: "no-cache",
    //     credentials: "same-origin",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     redirect: "follow",
    //     referrer: "no-referrer",
    //     body: JSON.stringify({
    //       token: token,
    //       phoneNumber: twilioVerification[1] + twilioVerification[2]
    //     })
    //   }).then(res => {
    //     if (res.status === 400) {
    //       alert("Invalid Code");
    //       // this.props.setCheckOtp(false);
    //     } else {
    //   this.props.firebase
    //     .doSignInWithCustomToken(window.localStorage.getItem("newUser"))
    //     .then(authUser => {
    //       this.props.setCheckOtp(false);
    //       const uid = authUser.user.uid;
    //       this.props.firebase.fsdb
    //         .collection("form-inquiry")
    //         .doc(window.localStorage.getItem("dbDocID"))
    //         .update({
    //           "bookingStatus.phoneVerfication": true,
    //           "bookingStatus.status": "Confirmed",
    //           "customerDetails.uid": uid
    //         });
    //     })
    //     .then(() => {
    //       this.props.firebase.fsdb
    //         .collection("form-inquiry")
    //         .doc(window.localStorage.getItem("user"))
    //         .get()
    //         .then(doc => {
    //           this.setState({
    //             values: {
    //               email: doc.data().customerDetails.email,
    //               name: doc.data().customerDetails.name,
    //               zipcode: doc.data().customerDetails.zipcode,
    //               uid: doc.id
    //             }
    //           });
    //         });
    //     })
    //     .then(() => {
    //       this.setState(
    //         state => ({
    //           page: Math.min(state.page + 1, this.props.children.length - 1)
    //         }),
    //         () => {
    //           this.props.setVisibilty(false);
    //         }
    //       );
    //     });
    //   }

    //   if (nextProps.resendOtp === true) {
    //     fetch("https://hug-a-pet.herokuapp.com/verification/start/send-otp", {
    //       method: "POST",
    //       mode: "cors",
    //       cache: "no-cache",
    //       credentials: "same-origin",
    //       headers: {
    //         "Content-Type": "application/json"
    //       },
    //       redirect: "follow",
    //       referrer: "no-referrer",
    //       body: JSON.stringify({
    //         countryCode: twilioVerification[0],
    //         phoneNumber: twilioVerification[1] + twilioVerification[2]
    //       })
    //     }).then(res => {
    //       res.json().then(res => {
    //         console.log(res);
    //         window.localStorage.setItem("newUser", res);
    //         this.props.setresendOtp(false);
    //       });
    //     });
    //   }
    //   });
    // }
  }

  onSubmit = values => {
    // this.props.firebase.fsdb
    //   .collection("form-inquiry")
    //   .doc(window.localStorage.getItem("dbDocID"))
    //   .update({
    //     "customerDetails.email": values["email"],
    //     "customerDetails.name": values["name"],
    //     "customerDetails.phone": `${this.props.number}`,
    //     "customerDetails.uid": values.uid
    //   });
    // this.props.firebase.fsdb
    //   .collection("form-inquiry")
    //   .doc(window.localStorage.getItem("dbDocID"))
    //   .update({
    //     "sessionDetails.Date": `${this.props.date}`,
    //     "sessionDetails.session": `${values["session"]}`,
    //     "sessionDetails.videoconsultation": `${values["videoconsultation"]}`
    //   })
    //   .then(res => {
    //     console.log(this.state.values);

        this.props.history.push(
          `${this.props.match.url}/123231`,
          [{ prevData: this.state.values }]
        );
      // })
    //   .catch(rej => {
    //     console.log(rej);
    //     alert(rej);
    //   });
  };

  next = values => {
    this.setState(state => ({
      page: Math.min(
        state.page + 1,
        this.props.children.length - 1
      )}))
    // this.props.setisLoading(true)
    // console.log("check Initiated");
    // let userDoc = null;
    // let docID = null;
    // const { number } = this.props;
    // const twilioVerification = number.split(" ");
    // fetch(
    //   "https://hug-a-pet.herokuapp.com/verification/start/check-valid-number",
    //   {
    //     method: "POST",
    //     mode: "cors",
    //     cache: "no-cache",
    //     credentials: "same-origin",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     redirect: "follow",
    //     referrer: "no-referrer",
    //     body: JSON.stringify({
    //       countryCode: twilioVerification[0],
    //       phoneNumber: twilioVerification[1] + twilioVerification[2]
    //     })
    //   }
    // ).then(res => {
    //   console.log("Response Recieved");

    //   if (res.status === 400) {
    //    this.props.setisLoading(false)
    //     alert("Invalid Number");
    //   } else {
    //     // if () {

    //     // }

    //     //search phone number in database
    //     this.props.firebase.fsdb
    //       .collection("form-inquiry")
    //       .where("customerDetails.phone", "==", `${number}`)
    //       .limit(1)
    //       .get()
    //       .then(querySnapshot => {
    //         if (querySnapshot.empty) {
    //           this.setState(state => ({
    //             page: Math.min(state.page + 1, this.props.children.length - 1),
    //             values
    //           }));
    //         } else {
    //           querySnapshot.forEach(doc => {
    //             console.log(doc.data());
    //             userDoc = doc.data();
    //             docID = doc.id;
    //             window.localStorage.setItem("user", doc.id);
    //             console.log(this.props.firebase.auth.currentUser);
                
    //           });
    //           if (this.props.firebase.auth.currentUser === null) {
    //             fetch(
    //               "https://hug-a-pet.herokuapp.com/verification/start/send-otp",
    //               {
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
    //                   countryCode: twilioVerification[0],
    //                   phoneNumber: twilioVerification[1] + twilioVerification[2]
    //                 })
    //               }
    //             ).then(res => {
    //               res.json().then(res => {
    //                 console.log(res);
    //                 window.localStorage.setItem("newUser", res);
    //               })
    //               .then(()=>{
    //            this.props.setisLoading(false)
    //             this.props.openModal();
    //                 })
    //               });
    //             // } else{
    //           } else {
    //             this.props.firebase.fsdb
    //               .collection("form-inquiry")
    //               .doc(window.localStorage.getItem("dbDocID"))
    //               .update({
    //                 "bookingStatus.phoneVerfication": true,
    //                 "bookingStatus.status": "Confirmed",
    //                 "customerDetails.uid": docID
    //               })
    //               .then(() => {
    //                 this.setState(
    //                   {
    //                     values: {
    //                       email: userDoc.customerDetails.email,
    //                       name: userDoc.customerDetails.name,
    //                       zipcode: userDoc.customerDetails.zipcode,
    //                       uid: docID
    //                     }
    //                   },
    //                   () => {
    //                  this.props.setisLoading(false)
    //                     this.setState(state => ({
    //                       page: Math.min(
    //                         state.page + 1,
    //                         this.props.children.length - 1
    //                       )
    //                     }));
    //                   }
    //                 );
    //               });
    //           }
    //         }
    //       });
    //   }
    // });
  };

  previous = () =>
    this.setState(state => ({
      page: Math.max(state.page - 1, 0)
    }));

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
    console.log("Hello");
    e.preventDefault();
    const { children, onSubmit } = this.props;
    const { page } = this.state;
    const isLastPage = page === React.Children.count(children) - 1;
    if (isLastPage) {
      return this.onSubmit(values);
    } else {
      this.next(values);
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
          <form className="wizard-form">
            {activePage}
            <div className="buttons">
              {page > 0 && (
                <button type="button" onClick={this.previous}>
                  « Previous
                </button>
              )}
              {!isLastPage && (
                <button
                  onClick={e => this.handleSubmit(e, values)}
                  type="submit"
                >
                  Next »
                </button>
              )}
              {isLastPage && (
                <button
                  onClick={e => this.handleSubmit(e, values)}
                  type="submit"
                  disabled={submitting}
                >
                  Next »
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
