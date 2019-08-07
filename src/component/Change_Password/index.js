import React from 'react';
import {withFirebase} from '../Firebase';
import {ChangePasswordForm} from '../PasswordUpdate_Form';

const INITIAL_STATE={
    passwordOne: '',
    passwordTwo: '',
    error: '',
}

class ChangePasswordComponent extends React.Component{
        constructor(props){
            super(props)
            this.state={...INITIAL_STATE};
        }

        submitPass = (event) =>{
        event.preventDefault();            
            const {passwordOne} =this.state;
            this.props.firebase.passwordUpdate(passwordOne)
            .then((res)=>{
                this.setState({
                    error : "Password Updated Successfully",
                })
            }).then(()=>{
                this.setState({
                    passwordOne: '',
                    passwordTwo: '',
                })
            })
            .catch((rej)=>{
                console.log(rej);
            })
        }

        handlePass = (event)=>{
            this.setState({
                [event.target.name]: event.target.value,
            })
        }

        render(){
            return(
                <div>
                    <ChangePasswordForm state={this.state} change={this.handlePass} submit={this.submitPass}/>
                </div>
            )
        }
}

const ChangePassword = withFirebase(ChangePasswordComponent);

export {ChangePassword};