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
          console.log(doc.data());
          
          this.setState(
            {
              values: {
                email: doc.data().customerDetails.email,
                phone: doc.data().customerDetails.phone,
                name: doc.data().customerDetails.name,
                zipcode: doc.data().customerDetails.zipcode,
                session: doc.data().sessionDetails.session,
                uid: doc.data().customerDetails.uid
                // videoconsultation: doc.data().sessionDetails.videoconsultation
              }
            },
            () => {
              if (doc.data().sessionDetails.Date) {
                this.props.setDate(doc.data().sessionDetails.Date);
                this.props.setNum(doc.data().customerDetails.phone);
              }
            }
          );
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  componentWillReceiveProps(nextProps, previousProps) {
    if (nextProps.modalStatus === false) {
      this.setState(state => ({
        page: Math.min(state.page + 1, this.props.children.length - 1)
      }));
    }
  }

  onSubmit = values => {
    this.props.firebase.fsdb
      .collection("form-inquiry")
      .doc(window.localStorage.getItem("dbDocID"))
      .update({
        "customerDetails.email": values["email"],
        "customerDetails.name": values["name"],
        "customerDetails.phone": `${this.props.number}`,
        "customerDetails.uid": values.uid
      });
    this.props.firebase.fsdb
      .collection("form-inquiry")
      .doc(window.localStorage.getItem("dbDocID"))
      .update({
        "sessionDetails.Date": `${this.props.date}`,
        "sessionDetails.session": `${values["session"]}`,
        "sessionDetails.videoconsultation": `${values["videoconsultation"]}`
      })
      .then(res => {
        console.log(this.state.values);
        
        this.props.history.push(
          `${this.props.match.url}/${this.state.values.zipcode}`,
          [{ prevData: this.state.values }]
        );
      })
      .catch(rej => {
        console.log(rej);
        alert(rej);
      });
  };

  next = values => {
    console.log("Check Initiated");

    const { number } = this.props;
    const twilioVerification = number.split(" ");
    fetch(
      "https://hug-a-pet.herokuapp.com/verification/start/check-valid-number",
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
      console.log("Response Recieved");

      if (res.status === 400) {
        alert("Invalid Number");
      } else {
        //search phone number in database
        this.props.firebase.fsdb
          .collection("form-inquiry")
          .where("customerDetails.phone", "==", `${number}`)
          .limit(1)
          .get()
          .then(querySnapshot => {
            if (querySnapshot.empty) {
              this.setState(state => ({
                page: Math.min(state.page + 1, this.props.children.length - 1),
                values
              }));
            } else {
              querySnapshot.forEach(doc => {
                console.log(doc.data());
                
                window.localStorage.setItem("user", doc.id);
                this.setState({
                  values: {
                    email: doc.data().customerDetails.email,
                    name: doc.data().customerDetails.name,
                    zipcode: doc.data().customerDetails.zipcode,
                    uid: doc.id,
                    
                  }
                });
                this.props.openModal();
              });
            }
          });
      }
    });

    // .doc(window.localStorage.getItem("dbDocID"))
    // .update({
    //   "customerDetails.email": values["email"],
    //   "customerDetails.name": values["name"],
    //   "customerDetails.phone": `${this.props.number}`
    // });

    // this.props.firebase
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

  handleSubmit = values => {
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
          <form onSubmit={handleSubmit}>
            {activePage}
            <div className="buttons">
              {page > 0 && (
                <button type="button" onClick={this.previous}>
                  « Previous
                </button>
              )}
              {!isLastPage && <button type="submit">Next »</button>}
              {isLastPage && (
                <button type="submit" disabled={submitting}>
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
