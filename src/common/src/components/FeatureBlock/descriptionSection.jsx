import React, {useState} from "react";

export const DescriptionSection = ({description}) => {
  const [isWrap, setWrap] = useState(
    description.props.content.length > 150
	);

	const minimizedDescription = {
    ...description,
    props: {
      ...description.props,
      content: description.props.content.substring(0, 150)
    }
	};

	const handleClick = () => {
		setWrap(!isWrap);
	}
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
  );}; 
  