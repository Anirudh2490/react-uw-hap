import React, { Component } from "react";
import { compose } from "recompose";
import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
import "./styles.css";

const INITIAL_STATE = {
  dataAvailable: false,
};

class AdminPageBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentWillMount() {
    const documents  = [];
    this.props.firebase.fsdb
      .collection("form-inquiry")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const docID = doc.id;
          const docData = doc.data();
          documents.push({
            doc: {
              docData,
              docID
            }
          });
        });
      })
      .then(() => {
        this.setState({
          documents: documents,
          dataAvailable: true
        });
      })
      .catch(rej => {
        console.log(rej);
      });
  }

  assignVet = (docId) =>{
      this.props.history.push(`/admin/${docId}`)
  }

  render() {
    if (this.state.dataAvailable) {
      return (
        <div style={{margin: "100px auto 0 auto", width: "80%"}}>
          <div>
            <table>
              <tbody>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Vet Status</th>                
                  <th />
                </tr>
                {this.state.documents.map((data) => {
                  return (
                    <tr key={data.doc.docID}>
                      <td>{data.doc.docData.customerDetails.name}</td>
                      <td>{data.doc.docData.customerDetails.email}</td>
                      <td>{data.doc.docData.customerDetails.phone}</td>
                      <td>{data.doc.docData.vetDetails.isVetAssigned? 'Assigned':'Not Assigned'}</td>
                      <td>
                        <button onClick={()=>this.assignVet(data.doc.docID)}>Assign Vet</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else{
      return null
    }
  }
}

const condition = authUser => {
  return authUser && authUser.userrole === "admin";
};

const AdminPage = compose(
  withFirebase,
  withRouter,
  withAuthorization(condition)
)(AdminPageBase);

export default AdminPage;
