import React from 'react';


export const ChangePasswordForm = (props) => {
    const { passwordOne, passwordTwo, error } = props.state;
    const isDisabled = passwordOne !== passwordTwo || passwordOne === '' || passwordTwo === '';
    return (
        <div >
            <div >
                <h5>
                    Change Password
            </h5>
                <form onSubmit={props.submit}>
                    <div>
                        <label>
                            <div>
                                Enter Password
                        </div>
                            <input name="passwordOne" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                                type="password" value={passwordOne} onChange={props.change} />
                        </label>
                    </div>
                    <div>
                        <label>
                            <div>
                                Confirm Password
                        </div>
                            <input name="passwordTwo" type="password" value={passwordTwo} onChange={props.change} />
                        </label>
                    </div>
                    <button disabled={isDisabled}>
                        Update Password
            </button >
                    {
                        error ? <p>{error}</p> : <p></p>
                    }
                </form>
            </div>
        </div>
    )
}