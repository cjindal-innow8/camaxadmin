import React from 'react';
import ReadMoreReact from 'read-more-react'
function ReadMore(props) {
  const {text} = props
  return (
    
       <ReadMoreReact text={text}
                min={10}
                // ideal={idealLength}
                // max={maxLength}
                readMoreText="show more"/>

  );
}

export default ReadMore;