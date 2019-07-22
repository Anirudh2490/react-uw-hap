import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Fade from 'react-reveal/Fade';
import Box from '../../../../../elements/Box';
import Text from '../../../../../elements/Text';
import Heading from '../../../../../elements/Heading';
import Button from '../../../../../elements/Button';
import Image from '../../../../../elements/Image';
import Container from '../../../components/UI/Container';

import Domains from '../../../assets/image/hosting/circle.png';

const VetsSection = ({
  sectionWrapper,
  row,
  col,
  title,
  data,
  description,
  button,
  textArea,
  imageArea,
}) => { 
  return (
    <Box {...sectionWrapper}>
      <Container>
        <Box {...row}>
          <Box {...col} {...imageArea}>
            <Image src={Domains} alt="Domain Image" />
          </Box>
          <Box {...col} {...textArea}>
            <Fade bottom cascade>
              <Heading
                {...title}
                content={data.fields.h1title1}
              />
              <Text
                {...description}
                content={data.fields.h3title1}
                />
              <Box>
                <Link href="#">
                  <a>
                    <Button {...button} title="EXPLORE MORE" />
                  </a>
                </Link>
              </Box>
            </Fade>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

VetsSection.propTypes = {
  sectionWrapper: PropTypes.object,
  row: PropTypes.object,
  col: PropTypes.object,
  title: PropTypes.object,
  description: PropTypes.object,
  button: PropTypes.object,
  textArea: PropTypes.object,
  imageArea: PropTypes.object,
};

VetsSection.defaultProps = {
  sectionWrapper: {
    id: "vet-section",
    as: 'section',
    pt: ['0', '0', '40px', '80px'],
    pb: ['40px', '40px', '80px', '80px'],
  },
  row: {
    flexBox: true,
    flexWrap: 'wrap',
    ml: '-15px',
    mr: '-15px',
    alignItems: 'center',
  },
  imageAreaRow: {
    flexDirection: 'row-reverse',
  },
  col: {
    pr: '15px',
    pl: '15px',
  },
  textArea: {
    width: ['100%', '100%', '55%', '50%', '42%'],
  },
  imageArea: {
    width: ['100%', '100%', '45%', '50%', '58%'],
    mb: ['40px', '40px', '0', '0', '0'],
  },
  title: {
    fontSize: ['26px', '38px', '38px', '48px', '48px'],
    fontWeight: '300',
    color: '#0f2137',
    letterSpacing: '-0.025em',
    mb: '20px',
  },
  description: {
    fontSize: '16px',
    color: '#343d48cc',
    lineHeight: '1.75',
    mb: '33px',
  },
  button: {
    type: 'button',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    borderRadius: '4px',
    pl: '22px',
    pr: '22px',
    colors: 'primaryWithBg',
  },
};

export default VetsSection;
