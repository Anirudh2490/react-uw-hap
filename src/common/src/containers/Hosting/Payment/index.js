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

const BlogSection = ({
  sectionWrapper,
  row,
  col,
  title,
  description,
  button,
  textArea,
  imageArea,
  imageOne,
  data,
  imageTwo,
}) => {
  return (
    <Box {...sectionWrapper}>
      <Container>
        <Box {...row}>
          <Box {...col} {...textArea}>
            <Fade bottom cascade>
              <Heading
                {...title}
                content={data.fields.headline}
              />
              <Text
                {...description}
                content={data.fields.headline2}
              />
              <Box>
                <Link href="#">
                  <a>
                    <Button {...button} title="LEARN MORE" />
                  </a>
                </Link>
              </Box>
            </Fade>
          </Box>
          <Box {...col} {...imageArea}>
            <Fade right>
              <Image {...imageOne} src={data.fields.images[0].fields.file.url} alt="Card Image" />
            </Fade>
            <Fade bottom>
              <Image {...imageTwo} src={data.fields.images[1].fields.file.url} alt="Payment logos" />
            </Fade>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

BlogSection.propTypes = {
  sectionWrapper: PropTypes.object,
  row: PropTypes.object,
  col: PropTypes.object,
  title: PropTypes.object,
  description: PropTypes.object,
  button: PropTypes.object,
  textArea: PropTypes.object,
  imageArea: PropTypes.object,
  imageOne: PropTypes.object,
  imageTwo: PropTypes.object,
};

BlogSection.defaultProps = {
  sectionWrapper: {
    id: 'blog_section',
    as: 'section',
    pt: ['60px', '80px', '80px', '80px'],
    pb: ['40px', '40px', '40px', '80px'],
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
    mb: ['40px', '40px', '0', '0', '0'],
  },
  imageArea: {
    width: ['100%', '100%', '45%', '50%', '58%'],
  },
  title: {
    fontSize: ['26px', '38px', '38px', '48px', '48px'],
    fontWeight: '300',
    color: 'headingColor',
    letterSpacing: '-0.025em',
    mb: '20px',
  },
  description: {
    fontSize: '16px',
    color: 'textColor',
    lineHeight: '1.75',
    mb: '33px',
  },
  button: {
    type: 'button',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    borderRadius: '4px',
    pl: '22px',
    pr: '22px',
    colors: 'primaryWithBg',
  },
  imageOne: {
    mb: '40px',
    ml: 'auto',
    mr: 'auto',
  },
  imageTwo: {
    ml: 'auto',
    mr: 'auto',
  },
};

export default BlogSection;
