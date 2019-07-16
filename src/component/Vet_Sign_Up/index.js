import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import {SignUpForm} from '../Sign_Up_Form';
import VetsSection from "../../common/src/containers/Hosting/Domain";
import VetsSectionData from '../Landing_Page'



const INITIAL_STATE = {
  username: '',
  email: '',
  name: '',
  phone: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

class VetSignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne , name, phone } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email,
          userrole: 'vet',
          name,
          phone,
        }, {merge: true}
        );
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.VET);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };


  render() {
    return (
      <div>
        <VetsSection data={VetsSectionData} />
        <SignUpForm formInputs={this.state} onChange={this.onChange} onSubmit={this.onSubmit} />
      </div>
     );
  }
}


export default withFirebase(withRouter(VetSignUpFormBase));
