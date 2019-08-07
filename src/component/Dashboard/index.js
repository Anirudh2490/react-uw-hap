import React from 'react';
import {withAuthorization} from '../Customer_Session';

const CustomerPageBase = () => {
  return (
    <div style={{marginTop: "200px"}}>
      <h1>Customer Page</h1>
      <p>The Customer Page is accessible by every signed in customer.</p>
    </div>
  );
}

const condition = authUser => {
  return authUser && (authUser.userrole === 'customer' || authUser.userrole === 'admin' )
}

const CustomerPage = withAuthorization(condition)(CustomerPageBase);

export {CustomerPage};