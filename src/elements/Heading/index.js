import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  fontFamily,
  fontWeight,
  textAlign,
  lineHeight,
  letterSpacing
} from 'styled-system';
import { base, themed } from '../base';

const HeadingWrapper = styled('p')(
  base,
  fontFamily,
  fontWeight,
  textAlign,
  lineHeight,
  letterSpacing,
  themed('Heading')
);

export const DescriptionSection = ({ description }) => {
  const [isWrap, setWrap] = useState(description.props.content.length > 150);

  const minimizedDescription = {
    ...description,
    props: {
      ...description.props,
      content: description.props.content.substring(0, 150)
    }
  };

  const handleClick = () => {
    setWrap(!isWrap);
  };
  return (
    <>
      {isWrap ? (
        <div>
          {minimizedDescription}
          <span onClick={handleClick}>...</span>
        </div>
      ) : (
        description
      )}
    </>
  );
};

const Heading = ({ content, charsLimit, ...props }) => {
  const [isWrap, setWrap] = useState(content.length > charsLimit);

  const minimizedContent = content.substring(0, charsLimit);

  const handleClick = () => {
    setWrap(!isWrap);
  };
  console.log(content);
  return (
    <HeadingWrapper {...props}>
      {charsLimit && isWrap ? (
        <div>
          {minimizedContent}
          <span onClick={handleClick}>...</span>
        </div>
      ) : (
        content
      )}
    </HeadingWrapper>
  );
};

export default Heading;

Heading.propTypes = {
  content: PropTypes.string,
  charsLimit: PropTypes.number,
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  mt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  ]),
  mb: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  ]),
  fontFamily: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  ]),
  fontWeight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  ]),
  textAlign: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  ]),
  lineHeight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  ]),
  letterSpacing: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  ]),
  ...base.propTypes
};

Heading.defaultProps = {
  as: 'h2',
  mt: 0,
  mb: '1rem',
  fontWeight: 'bold'
};