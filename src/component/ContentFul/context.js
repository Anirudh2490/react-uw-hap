import React from 'react';

const ContentFulContext = React.createContext(null);

const withContentFul = (Component) => props => {
    return (
        <ContentFulContext.Consumer>
            {
                contentful => <Component {...props} contentful={contentful} />
            }
        </ContentFulContext.Consumer>
    )
}

export {ContentFulContext, withContentFul};