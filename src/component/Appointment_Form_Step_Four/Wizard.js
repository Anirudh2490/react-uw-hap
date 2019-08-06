import React from "react";
import { Form } from "react-final-form";
import { withRouter } from "react-router-dom";
// import * as ROUTES from "../../constants/routes";
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
    //       this.setState({
    //         values: {
    //           phone: doc.data().customerDetails.phone,
    //           name: doc.data().customerDetails.name,
    //           email: doc.data().customerDetails.email,
    //           zipcode: doc.data().customerDetails.zipcode,
    //           petname: doc.data().petDetails.petname
    //         }
    //       });
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // }
  }

  next = values => {
    // //APPI CALL FOR TWILIO MSG
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
    //     body: `Hi ${values.name}! thankyou for registering at Hug a Pet, you will be notified once a vet is assigned to your case`
    //   })
    // })
    //   .then(response => {
    //     console.log(response.json());
    //     //APPI CALL FOR TWILIO Email
    //     fetch("https://hug-a-pet.herokuapp.com/send/mail", {
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
    //         emailReceiver: values.email,
    //         emailSubject: "Hi " + values.name + " Thankyou for registering at Hug a Pet!",
    //         emailContent: "Hi " + values.name + "! thankyou for registering at Hug a Pet, you will be notified once a vet is assigned to your case."
    //       })
    //     })
    //       .then(response => {
    //         console.log(response.json());
    //       })
    //       .catch(rej => {
    //         alert(rej.message);
    //       });
    //   })
    //   .catch(rej => {
    //     alert(rej.message);
    //   });

    // window.localStorage.removeItem("dbDocID");
    // this.props.history.push(`${this.props.match.url}${ROUTES.SUCCESS}`);
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
         <form>{activePage}</form>
        )}
      </Form>
    );
  }
}

const Wizard = withRouter(WizardBase);

export default Wizard;
