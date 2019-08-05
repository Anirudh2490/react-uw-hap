import React, {useState} from "react"
import PropTypes from "prop-types"
import Box from "../../../../../elements/Box"
import Text from "../../../../../elements/Text"
import Heading from "../../../../../elements/Heading"
import Container from "../../../components/UI/Container"
// import ParticlesComponent from "../../Hosting/Particle";
import HomeSearch from '../../../../../component/Home_Search'
import BannerWrapper, {
  DiscountWrapper,
  DiscountLabel,
} from "./banner.style"
import { search } from "react-icons-kit/feather/search"
import { DOMAIN_NAMES, DOMAIN_PRICE } from "../../../data/Hosting/data"

const BannerSection = ({
  row,
  title,
  description,
  button,
  textArea,
  data,
  searchArea,
  discountAmount,
  discountText,
}) => {
  // console.log(data);
  return (
    <BannerWrapper id="banner_section">
      {/* <ParticlesComponent /> */}
      <Container className="banner_container">
        <Box {...row}>
          <Box {...textArea}>
            <DiscountWrapper>
              {/* <DiscountLabel> */}
                {/* <Text {...discountAmount} content={data.fields.boldColorText} /> */}
                {/* <Text {...discountText} content="on every confirmed booking" /> */}
              {/* </DiscountLabel> */}
            </DiscountWrapper>
            <Heading
              {...title}
              content={data.fields.h1text}
            />
            <Text
              {...description}
              content={data.fields.paragraph}/>
        {/* <Text
              {...description}
              content="Start your Vet booking from here"/> */}
          </Box>
          <HomeSearch
            searchArea={searchArea}
            search={search}
            DOMAIN_NAMES={DOMAIN_NAMES}
            button={button}
            
            DOMAIN_PRICE={DOMAIN_PRICE}
          />
          
        </Box>

      </Container>
    </BannerWrapper>
  )
}

BannerSection.propTypes = {
  row: PropTypes.object,
  col: PropTypes.object,
  title: PropTypes.object,
  description: PropTypes.object,
  button: PropTypes.object,
  searchArea: PropTypes.object,
  discountAmount: PropTypes.object,
  discountText: PropTypes.object,
}

BannerSection.defaultProps = {
  row: {
    flexBox: true,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  textArea: {
    width: ["100%", "100%", "90%", "100%", "55%"],
  },
  title: {
    fontSize: ["26px", "32px", "42px", "46px", "55px"],
    fontWeight: "400",
    color: "#FFFFFF",
    letterSpacing: "-0.025em",
    mb: ["20px", "25px", "25px", "25px", "25px"],
    lineHeight: "1.31",
    textAlign: "center",
  },
  description: {
    fontSize: ["15px", "16px", "16px", "16px", "16px"],
    color: "#FFFFFF",
    lineHeight: "1.75",
    mb: "0",
    textAlign: "center",
  },
  button: {
    title: "Start Booking",
    type: "button",
    fontSize: "12px",
    fontWeight: "500",
    color: "#fff",
    pl: "22px",
    pr: "22px",
    colors: "#34888C",
    iconPosition: "left",
  },
  searchArea: {
    className: "search_area",
    width: ["100%", "100%", "80%", "100%", "70%"],
    mt: ["45px", "50px", "60px", "60px", "60px"],
  },
  discountAmount: {
    fontSize: ["13px", "14px", "14px", "14px", "14px"],
    fontWeight: "600",
    color: "#34888C",
    mb: 0,
    as: "span",
    mr: "0.4em",
  },
  discountText: {
    fontSize: ["13px", "14px", "14px", "14px", "14px"],
    fontWeight: "400",
    color: "#34888C",
    mb: 0,
    as: "span",
  },
}

export default BannerSection