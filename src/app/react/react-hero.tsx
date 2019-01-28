import * as React from 'react';

class ReactHero extends React.Component<any, any> {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <span>
        <span>react-hero works!</span><br/>
        <span>Don't have any data</span>
      </span>
    );
  }
}

export default ReactHero;
