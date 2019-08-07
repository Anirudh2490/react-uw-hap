import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LazyLoadComponent } from "react-lazy-load-image-component";
import { base, themed } from '../base';

const ImageWrapper = styled('img')(
  {
    display: 'block',
    maxWidth: '100%',
    height: 'auto'
  },
  base,
  themed('Image')
);

const Image = ({ src, alt, ...props }) => (
  <LazyLoadComponent>
    <ImageWrapper src={src} alt={alt} {...props} />
  </LazyLoadComponent>
);

export default Image;

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired
};

Image.defaultProps = {
  m: 0
};
