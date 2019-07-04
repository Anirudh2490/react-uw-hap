import React from 'react';
import PropTypes from 'prop-types';
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';
import Box from '../../../../../elements/Box';
import Text from '../../../../../elements/Text';
import Heading from '../../../../../elements/Heading';
import Image from '../../../../../elements/Image';
import Container from '../../../components/UI/Container';

import GuaranteeImage from '../../../assets/image/hosting/badge.png';

const AboutTeam = ({
  sectionWrapper,
  row,
  title,
  data,
  description,
  textArea,
  imageArea,
  ImageOne,
}) => {
  return (
    <Box {...sectionWrapper}>
      <Container>
        <Box {...row}>
          <Box {...textArea}>
            <Fade bottom cascade>
              <Heading {...title} content={data.fields.mainTitle} />
              <Text
                {...description}
                content={data.fields.para}
              />
            </Fade>
          </Box>
        </Box>
        <Box {...row}>
          <Box {...imageArea}>
            <Zoom>
              <Image {...ImageOne} src={data.fields.teampic.fields.file.url} alt="Guarantee" />
            </Zoom>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

AboutTeam.propTypes = {
  sectionWrapper: PropTypes.object,
  row: PropTypes.object,
  title: PropTypes.object,
  description: PropTypes.object,
  button: PropTypes.object,
  imageArea: PropTypes.object,
  ImageOne: PropTypes.object,
};

AboutTeam.defaultProps = {
  sectionWrapper: {
    as: 'section',
    pt: ['0px', '0px', '0px', '80px'],
    pb: ['0px', '0px', '0px', '25px'],
  },
  row: {
    flexBox: true,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  textArea: {
    width: [1, 1, '65%', 1 / 2],
    mb: ['40px', '50px', '60px', '80px'],
  },
  imageArea: {
    width: [1, 1, '40%', 1, 1 / 2],
  },
  title: {
    fontSize: ['28px', '30px', '32px', '36px', '36px'],
    fontWeight: '300',
    color: 'headingColor',
    letterSpacing: '-0.025em',
    mb: '20px',
    textAlign: 'center',
  },
  description: {
    fontSize: ['15px', '15px', '16px', '16px', '16px'],
    color: 'textColor',
    lineHeight: '1.75',
    mb: '0',
    textAlign: 'center',
  },
  ImageOne: {
    ml: 'auto',
    mr: 'auto',
  },
};

export default AboutTeam;
