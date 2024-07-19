import React from 'react';

import './MainHeader.css';

const MainHeader = props => {

  // NAVIGATION LINKS ARE STORED IN HEADER TAG

  //PROPS.CHILDREN WILL FETCH HTML TAGS FROM WHERE MAINHEADER TAG WILL BE USED
  
  return <header className="main-header">{props.children}</header>;
};

export default MainHeader;
