import React from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { shouldComponentUpdate } from 'utils/helpers';

import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { login } from 'actions';

export class Login extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };
  }

  shouldComponentUpdate = shouldComponentUpdate;

  @autobind
  onClickLogin(e) {
    e.preventDefault();

    this.props.dispatch(login(this.state));
  }

  @autobind
  onTextChange(property) {
  	return (event) => { this.setState({ [property]: event.target.value }); };
  }

  render() {
    return (
      <div key="Login" className="app__login app__route">
        <Form className="app__login__form">
            <h1>Login:</h1>
            <FormGroup>
              <Label for="id_username">Username:</Label>
              <Input type="username" name="username" id="id_username" placeholder="Username" onChange={this.onTextChange('username')} />
            </FormGroup>
            <FormGroup>
              <Label for="id_password">Password:</Label>
              <Input type="password" name="password" id="id_password" placeholder="Password" onChange={this.onTextChange('password')} />
            </FormGroup>
            <Button
              onClick={this.onClickLogin}
              className="btn btn-lg btn-primary btn-icon">
              Login
            </Button>
        </Form>
      </div>
    );
  }
}

export default connect()(Login);
