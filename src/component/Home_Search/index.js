import React, { Component } from "react";
import Box from "../../elements/Box";
import {
  SearchWrapper,
  List
} from "../../common/src/containers/Hosting/Banner/banner.style";
import { withFirebase } from "../Firebase";
import Link from "next/link";
import Icon from "react-icons-kit";
import Button from "../../elements/Button";
import * as ROUTES from "../../constants/routes";
import Select from "../../elements/Select";
import {
  book
  // , wind
} from "react-icons-kit/feather/";
import { withRouter } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./styles.css";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

const INITIAL_STATE = {
  name: "",
  phone: "",
  zipcode: "",
  service: "",
  code: "",
  address: "",
  error: ""
};

class HomeSearchBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onChangeZipCode = event => {
    this.setState({
      zipcode: event
    });
  };

  onChangePhone = event => {
    console.log(this.state.phone);

    this.setState({
      phone: event
    });
  };

  onChangeCode = event => {
    this.setState({
      zipcode: event
    });
  };

  onChangeService = event => {
    this.setState({
      service: event
    });
  };

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({ address });
      })
      .catch(error => console.error("Error", error));
  };

  onSubmit = () => {
    this.props.firebase.fsdb
      .collection("form-inquiry")
      .add({
        customerDetails: {
          name: ``,
          address: `${this.state.address}`,
          phone: ``,
          email: "",
          service: `${this.state.service.value}`,
          uid: "",
          userrole: "customer"
        },
        vetDetails: {
          isVetAssigned: false,
          vetName: ""
        },
        sessionDetails: {
          Date: "",
          session: "",
          videoconsultation: ""
        },
        petDetails: {
          petdate: "",
          petname: "",
          type: "",
          gender: "",
          notes: ""
        },
        bookingStatus: {
          phoneVerfication: false,
          status: "Not confirmed"
        }
      })
      .then(res => {
        window.localStorage.removeItem("contWithOutLogin");
        window.localStorage.removeItem("newUser");
        window.localStorage.setItem("dbDocID", res.id);
      })
      .then(() => {
       
        this.props.history.push(
          `${ROUTES.BOOK_AN_APPOINTMENT}/${this.state.service.value}`
        );
      })
      .catch(rej => {
        alert(rej);
      });
  };

  render() {
    const { address, service } = this.state;
    const isInvalid = address === "" || service === "";

    return (
      <Box {...this.props.searchArea}>
        <SearchWrapper className="home-search-bar">
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading
            }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: "Search Places ...",
                    className: "location-search-input"
                  })}
                />
                <div className="autocomplete-dropdown-container">
                  {loading && <div>Loading...</div>}
                  {suggestions.map(suggestion => {
                    const className = suggestion.active
                      ? "suggestion-item--active"
                      : "suggestion-item";
                    // inline style for demonstration purpose
                    const style = suggestion.active
                      ? { backgroundColor: "#fafafa", cursor: "pointer" }
                      : { backgroundColor: "#ffffff", cursor: "pointer" };
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style
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

          <Select
            options={this.props.DOMAIN_NAMES}
            placeholder="Service"
            onChange={this.onChangeService}
            className="domain_search_select"
            aria-label="domain_search_input"
          />
          <Button
            {...this.props.button}
            onClick={() => {
              if (isInvalid === false) {
                this.onSubmit();
              } else {
                alert("Please Fill all the feilds");
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
        <p id="recaptcha-container" style={{ textAlign: "center" }} />
      </Box>
    );
  }
}

const HomeSearch = withFirebase(withRouter(HomeSearchBase));

export default HomeSearch;
