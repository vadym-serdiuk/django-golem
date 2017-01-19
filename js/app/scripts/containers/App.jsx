import React from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const theme = getMuiTheme({
  appBar: {
    height: 40,
    textColor: 'white'
  },
});

class App extends React.Component {

  render = () => {
    return (
    <MuiThemeProvider muiTheme={theme} >
      { this.props.children }
    </MuiThemeProvider>
    )
  }
}

App.propTypes = {
  children: React.PropTypes.object.isRequired,
};

export default App;
