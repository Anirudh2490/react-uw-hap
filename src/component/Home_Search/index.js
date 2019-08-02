import React, { Component } from "react"
import Box from "../../elements/Box"
import {
  SearchWrapper,
  List,
} from "../../common/src/containers/Hosting/Banner/banner.style"
import { withFirebase } from "../Firebase"
import Link from "next/link"
import Icon from "react-icons-kit"
import Button from "../../elements/Button"
import Input from "../../elements/Input"
import * as ROUTES from "../../constants/routes"
import Select from "../../elements/Select"
import { book
  // , wind
} from "react-icons-kit/feather/"
import { confirmAlert } from "react-confirm-alert"
import { withRouter } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css"
import ReactPhoneInput from 'react-phone-input-2'
// import 'react-phone-input-2/dist/style.css'
import './styles.css'


import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';


const INITIAL_STATE = {
  name: "",
  phone: "",
  zipcode: "",
  service: "",
  code: "",
  address: '',
  error: "",
}

class HomeSearchBase extends Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  // componentDidMount(){
  //   const homeform = JSON.parse(window.localStorage.getItem('homeform'));
  //   if (homeform !== null) {
  //     this.setState({
  //       name: homeform.customerDetails.name,
  //       phone: homeform.customerDetails.phone,
  //       service: homeform.customerDetails.service,
  //     })
  //   }
  // }

  // componentWillMount(){
  //  const values =  window.localStorage.getItem('homeSearch')
  //  console.log(values)
  // //  if(values){
  // //    this.setState({
  // //     name: values.customerDetails.name,
  // //     phone:  values.customerDetails.phone,
  // //     zipcode: "" ,
  // //     service: values.sessionDetails.service,
  // //     code: "",
  // //     error: "",
  // //    })
  // //  }
  // }

  onChangeZipCode = event => {
    this.setState({
      zipcode: event,
    })
  }

  onChangePhone = event => {
    console.log(this.state.phone);
    
    this.setState({
      phone: event,
    })
  }

  onChangeCode = event => {
    this.setState({
      zipcode: event,
    })
  }

  onChangeService = event => {
    this.setState({
      service: event,
    })
  }


  handleChange = address => {
    this.setState({ address });
  };


  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({address})
      })
      .catch(error => console.error('Error', error));
  };

  // onChangeOTP = event => {
  //   this.setState(
  //     {
  //       code: event,
  //     },
  //     () => {
  //       console.log(this.state)
  //     }
  //   )
  // }

  onSubmit = () => {
    // event.preventDefault()
    // window.recaptchaVerifier = new this.props.firebase.recaptcha.RecaptchaVerifier(
    //   "recaptcha-container",
    //   {
    //     size: "normal",
    //   }
    // )
    // const phoneNumber = this.state.phone
    // const appVerifier = window.recaptchaVerifier
    // this.props.firebase
    //   .doCreateUserWithPhone(phoneNumber, appVerifier)
    //   .then(confirmationResult => {
    //   alert('.')
    //   const code = prompt('ENTER OTP CODE')
    //    confirmationResult.confirm(code)
    //    .then((results)=>{
    //     console.log(results);
    //     this.props.firebase
    //     .user(results.user.uid)
    //     .set(
    //       {
    //         name: this.state.name,
    //         phone: this.state.phone,
    //         email: "",
    //         userrole: "customer",
    //         zipcode: "",                
    //       },
    //       { merge: true }
    //     )
    //     .then(() => {
    //       this.props.firebase
    //         .user(this.props.firebase.auth.currentUser.uid)
    //         .collection("appointments")
    //         .add({
    //           customerDetails: {
    //             name: this.state.name,
    //             phone: this.state.phone,
    //             service: this.state.service,
    //           },
    //           sessionDetails: {
    //             Date: "",
    //             session: "",
    //             videoconsultation: "",
    //           },
    //           petDetails: {
    //             petdate: "",
    //             type: "",
    //             gender: "",
    //             notes: "",
    //           },
    //         })
    //         .then(res => {
    //           window.localStorage.setItem('dbDocID', res.id)
    //           this.props.history.push(`/${this.state.service.value}`)
    //         })  
    //         .catch(rej => {
    //           console.log(rej)
    //           alert(rej.message)
    //         })
    //     })
    //    })
    //   })
    //   .catch(function(error) {
    //     alert(error.message)
    //     console.log("error", error)
    //     window.localStorage.removeItem('dbDocID')
    //     window.recaptchaVerifier.clear();
    //   })

    //   event.preventDefault()
    // window.recaptchaVerifier = new this.props.firebase.recaptcha.RecaptchaVerifier(
    //   "recaptcha-container",
    //   {
    //     size: "normal",
    //   }
    // )
    // const phoneNumber = this.state.phone
    // const appVerifier = window.recaptchaVerifier
    // this.props.firebase
    //   .doCreateUserWithPhone(phoneNumber, appVerifier)
    //   .then(confirmationResult => {
    //     alert('.')
    //     const code = prompt('ENTER OTP CODE')
    //      confirmationResult.confirm(code)
    //    .then((results)=>{
    //      console.log(results.user.uid);
    //     this.props.firebase
    //     .user(results.user.uid)
    //     .set(
    //       {
    //         name: this.state.name,
    //         phone: this.state.phone,
    //         userrole: "customer",
    //         zipcode: "",
    //         email: ''

    //       },
    //       { merge: true }
    //     )
    //     .then(() => {
    //       this.props.firebase
    //         .user(results.user.uid)
    //         .collection("appointments")
    //         .add({
    //           sessionDetails: {
    //             Date: "",
    //             session: "",
    //             videoconsultation: "",
    //           },
    //           petDetails: {
    //             petdate: "",
    //             type: "",
    //             gender: "",
    //             notes: "",
    //           },
    //         })
    //         .then(res => {
    //           window.localStorage.setItem('dbDocID', res.id)
    //           window.localStorage.setItem('urlParam', this.state.service.value)              
    //         }).then(()=>{
    //           this.props.history.push(`/${this.state.service.value}`)
    //         })
    //         .catch(rej => {
    //           console.log(rej)
    //           alert(rej)
    //         })
    //     })
    //    })
    //   })
    //   .catch(function(error) {
    //     alert(error.message)
    //     console.log("error", error)
    //     window.localStorage.removeItem('dbDocID')
    //     window.recaptchaVerifier.clear();
    //   })

    this.props.firebase.fsdb
    .collection("form-inquiry")
    .add(
      {
        customerDetails: {
          name: ``,
          address: `${this.state.address}`,
          phone: ``,
          email: "",
          service: `${this.state.service.value}`,
          uid: "",
          userrole: "customer"
        },
        vetDetails:{
          isVetAssigned: false,
          vetName: "",
        },
        sessionDetails: {
          Date: "",
          session: "",
          videoconsultation: "",
        },
        petDetails: {
          petdate: "",
          petname: "",
          type: "",
          gender: "",
          notes: "",
        },
        bookingStatus:{
          phoneVerfication: false,
          status: "Not confirmed"
        }
      }
    )
    .then(res => {
      // const homeform =  {
      //   customerDetails: {
      //     name: ``,
      //     zipcode: `${this.state.zipcode}`,
      //     phone: ``,
      //     email: "",
      //     service: `${this.state.service.value}`,
      //   },
      //   vetDetails:{
      //     isVetAssigned: false,
      //     vetName: "",
      //   },
      //   sessionDetails: {
      //     Date: "",
      //     session: "",
      //     videoconsultation: "",
      //   },
      //   petDetails: {
      //     petdate: "",
      //     petname: "",
      //     type: "",
      //     gender: "",
      //     notes: "",
      //   },
      //   bookingStatus:{
      //     phoneVerfication: false,
      //     status: "Not confirmed"
      //   }
      // };
        window.localStorage.setItem('dbDocID', res.id)
        // window.localStorage.setItem('homeform', JSON.stringify(homeform))
      })
      .then(()=>{
        // this.props.history.push(`/${this.state.service.value}`)
        window.localStorage.removeItem("contWithOutLogin");
        window.localStorage.removeItem("newUser");
        this.props.history.push(`${ROUTES.BOOK_AN_APPOINTMENT}/${this.state.service.value}`)

      })
      .catch(rej => {
        console.log(rej)
        alert(rej)
      })

  }

 OTPpopUp = () => {
    confirmAlert({
      title: "Verification",
      message: "Please Enter OTP Code",
      childrenElement: () => <div />,
      customUI: ({ title, message, onClose }) => (
        <div style={{ textAlign: "center" }}>
          <h1>{title}</h1>
          <h5>{message}</h5>
          <div>
            <Input
              inputType="text"
              onChange={this.onChangeOTP}
              placeholder="OTP code"
              iconPosition="right"
              className="domain_search_input"
              aria-label="domain_search_input"
            />
          </div>
          <ReactPhoneInput
            defaultCountry="de"
            onChange={this.onChangePhone}
          />
          <div style={{ marginTop: "5px", marginBottom: "5px" }}>
            <Button
              {...this.props.button}
              onClick={() => {
                onClose()
              }}
              title="Submit"
              className="domain_search_button"
            />
          </div>
        </div>
      ),
    })
  }

  render() {
    const { address , service } = this.state;
    const isInvalid =
    address === '' ||
    service === '';

    return (
      <Box {...this.props.searchArea}>
        <SearchWrapper className="home-search-bar">
          {/* <Input
            inputType="number"
            placeholder="Zip Code"
            onChange={this.onChangeZipCode}
            iconPosition="right"
            className="domain_search_input"
            aria-label="domain_search_input"
          /> */}

<PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>


          {/* <ReactPhoneInput
            defaultCountry="de"
            value={this.state.phone}
            onChange={this.onChangePhone}
          /> */}
          <Select
            options={this.props.DOMAIN_NAMES}
            placeholder="Service"
            onChange={this.onChangeService}
            className="domain_search_select"
            aria-label="domain_search_input"
          />
          <Button
            {...this.props.button}
            onClick={()=>{ 
              if(isInvalid === false){
                this.onSubmit()
              }else{
                alert("Please Fill all the feilds")
              }
            }}
            icon={<Icon icon={book} size={24} />}
            className="domain_search_button"
          />
        </SearchWrapper>
        <List>
          {this.props.DOMAIN_PRICE.map((item, index) => (
            <li key={`domain-list-${index}`}>
              {item.url ? (
                <Link href={item.url}>
                  <a>{item.content}</a>
                </Link>
              ) : (
                <>{item.content}</>
              )}
            </li>
          ))}
        </List>
    <p id="recaptcha-container" style={{textAlign: "center"}}></p>

      </Box>
    )
  }
}

const HomeSearch = withFirebase(withRouter(HomeSearchBase))

export default HomeSearch

// <Box {...searchArea}>
//             <SearchWrapper>
//               <Input
//                 inputType="text"
//                 placeholder="Your name"
//                 iconPosition="right"
//                 className="domain_search_input"
//                 aria-label="domain_search_input"
//               />
//               <Input
//                 inputType="text"
//                 placeholder="Phone number"
//                 iconPosition="right"
//                 className="domain_search_input"
//                 aria-label="domain_search_input"
//               />
//               <Input
//                 inputType="text"
//                 placeholder="Zipcode"
//                 iconPosition="right"
//                 className="domain_search_input"
//                 aria-label="domain_search_input"
//               />
//               <Select
//                 options={DOMAIN_NAMES}
//                 placeholder="Service"
//                 className="domain_search_select"
//                 aria-label="domain_search_input"
//               />
//               <Button
//                 {...button}
//                 icon={<Icon icon={search} size={24} />}
//                 className="domain_search_button"
//               />
//             </SearchWrapper>
//             <List>
//               {DOMAIN_PRICE.map((item, index) => (
//                 <li key={`domain-list-${index}`}>
//                   {item.url ? (
//                     <Link href={item.url}>
//                       <a>{item.content}</a>
//                     </Link>
//                   ) : (
//                     <>{item.content}</>
//                   )}
//                 </li>
//               ))}
//             </List>
//           </Box>