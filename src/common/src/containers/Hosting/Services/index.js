import React from 'react';
import PropTypes from 'prop-types';
import Fade from 'react-reveal/Fade';
import Box from '../../../../../elements/Box';
import Text from '../../../../../elements/Text';
import Heading from '../../../../../elements/Heading';
import Image from '../../../../../elements/Image';
import Container from '../../../components/UI/Container';
import FeatureBlock from '../../../components/FeatureBlock';

import { SERVICES_DATA } from '../../../data/Hosting/data';

const ServicesSection = ({
  sectionWrapper,
  row,
  col,
  secTitleWrapper,
  secHeading,
  secText,
  featureItemHeading,
  featureItemDes,
  featureBlockStyle,
  iconStyle,
  contentStyle,
}) => {
  return (
    <Box {...sectionWrapper}>
      <Container>
        <>
          <Box {...secTitleWrapper}>
            <Fade bottom cascade>
              <Text {...secText} content="Unser Leistungsumfang" />
              <Heading
                {...secHeading}
                content="Folgende Leistungen bieten Ihnen unsere Tierärzte im Hausbesuch"
              />
            </Fade>
          </Box>
          <Box {...row}>
            {SERVICES_DATA? SERVICES_DATA.map((featureItem, index) => (
              <Box {...col} key={`service-${index}`}>
                <FeatureBlock
                  wrapperStyle={featureBlockStyle}
                  iconStyle={iconStyle}
                  contentStyle={contentStyle}
                  title={
                    <Heading
                      {...featureItemHeading}
                      content={featureItem.title}
                    />
                  }
                  description={
                    <Text
                      {...featureItemDes}
                      content={featureItem.description}
                    />
                  }
                  icon={<Image src={featureItem.icon} alt={`icon-${index}`} />}
                />
              </Box>
            )): <p></p>}
          </Box>
        </>
      </Container>
    </Box>
  );
};

ServicesSection.propTypes = {
  sectionWrapper: PropTypes.object,
  secTitleWrapper: PropTypes.object,
  row: PropTypes.object,
  col: PropTypes.object,
  secHeading: PropTypes.object,
  secText: PropTypes.object,
  featureItemHeading: PropTypes.object,
  featureItemDes: PropTypes.object,
  featureBlockStyle: PropTypes.object,
  iconStyle: PropTypes.object,
  contentStyle: PropTypes.object,
};

ServicesSection.defaultProps = {
  sectionWrapper: {
    // id: 'service_section',
    as: 'section',
    pt: ['40px', '60px', '60px', '60px'],
    pb: ['40px', '60px', '60px', '80px'],
    className: 'service_section',
    id: 'service_section',
  },
  secTitleWrapper: {
    mb: ['50px', '60px', '60px', '75px'],
  },
  secText: {
    as: 'span',
    display: 'block',
    textAlign: 'center',
    fontSize: '14px',
    letterSpacing: '0.15em',
    fontWeight: '700',
    color: '#34888C',
    mb: '10px',
  },
  secHeading: {
    textAlign: 'center',
    fontSize: ['20px', '24px'],
    fontWeight: '400',
    color: '#0f2137',
    letterSpacing: '-0.025em',
    mb: '0',
  },
  row: {
    flexBox: true,
    flexWrap: 'wrap',
  },
  col: {
    width: [1, 1 / 2, 1 / 2, 1 / 3],
    className: 'service_col',
    bg: '#fff',
  },
  featureBlockStyle: {
    p: '45px 55px',
    className: 'service_item',
  },
  iconStyle: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    mb: '15px',
  },
  contentStyle: {
    textAlign: 'center',
  },
  featureItemHeading: {
    fontSize: ['18px', '20px'],
    textAlign: 'center',
    fontWeight: '400',
    color: '#34888C',
    lineHeight: '1.5',
    mb: '8px',
    letterSpacing: '-0.020em',
  },
  featureItemDes: {
    fontSize: '15px',
    // lineHeight: '1.84',
    color: '#343d48cc',
    mb: '0',
  },
};

export default ServicesSection;