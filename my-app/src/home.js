import React, { Component } from 'react';
import { variables } from './variables.js';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./login.css";

export class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      auth: [],
      modalTitle: "",
      email: "",
      password: "",
      passwordAgain: "",
      firstName: "",
      lastName: "",
      ok: "",
      strengthBadge: "Weak",
      backgroundColor: 'input-group-text m-1 alert alert-danger', //'input-group-text m-1 text-centred bg_weak' 
      RolesArray: [false, false, false],
      disabledArray: [false, false, false],
      Viewer: false,
      Editor: false,
      Admin: false,
      Token:localStorage.getItem("Token"),
    }
    this.site = "auth"
    this.strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
    this.mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))');
    this.isFound = true;
  }

  submitClick() {
    this.setState({
      modalTitle: "Register",
      email: "",
      password: "",
      passwordAgain: "",
      firstName: "",
      lastName: "",
      strengthBadge: "Weak",
      RolesArray: [true, false, false],
      disabledArray: [false, false, false],
      Viewer: false,
      Editor: false,
      Admin: false,
    })
  }

  loginClick() {
    this.setState({
      modalTitle: "Login",
      email: "",
      password: "",
      passwordAgain: "",
      firstName: "",
      lastName: "",
      RolesArray: [false, false, false],
    })
  }

  onChangeEmail = async(e) => {
    await this.setState({ email: e.target.value });
  }

  onChangePassword = async(e) => {
    await this.setState({ password: e.target.value });
    await this.StrengthChecker(this.state.password);
  }

  onChangePasswordAgain = async(e) => {
    await this.setState({ passwordAgain: e.target.value });
  }

  onChangeFirstName = async(e) => {
    await this.setState({ firstName: e.target.value });
  }

  onChangeLastName = async(e) => {
    await this.setState({ lastName: e.target.value });
  }

  onChangeViewer = (e) => {
    this.setState({ Viewer: e.target.checked });
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.RolesArray[0] = e.target.checked;
  }

  onChangeEditor = (e) => {
    this.setState({ Editor: e.target.checked });
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.RolesArray[1] = e.target.checked;
  }

  onChangeAdmin = (e) => {
    this.setState({ Admin: e.target.checked });
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.RolesArray[2] = e.target.checked;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('this.handleSubmit');
    this.authClick();
  }

  StrengthChecker(PasswordParameter) {
    const bg_base = 'input-group-text m-1 alert ';
    if (this.strongPassword.test(PasswordParameter)) {
      this.setState({ backgroundColor: bg_base + 'alert-success' });
      this.setState({ strengthBadge: 'Strong' });
    } else if (this.mediumPassword.test(PasswordParameter)) {
      this.setState({ backgroundColor: bg_base + 'alert-warning' });
      this.setState({ strengthBadge: 'Medium' });
    } else {
      this.setState({ backgroundColor: bg_base + 'alert-danger' });
      this.setState({ strengthBadge: 'Weak' });
    }
  }
  validateForm() {
    const lim = 5
    return (this.state.modalTitle === 'Login' ?
      (this.state.email.length > lim && this.state.password.length > lim) :
      (this.state.email.length > lim && this.state.password.length > lim &&
        this.state.firstName.length > 1 && this.state.lastName.length > 1 &&
        this.state.password === this.state.passwordAgain &&
        this.state.strengthBadge !== 'Weak' &&
        (this.state.Viewer || this.state.Editor || this.state.Admin)));
  }

  authClick() {
    console.log(this.state.modalTitle);
    console.log(this.state.Viewer, this.state.Editor, this.state.Admin);
    if ( this.state.modalTitle === 'Login') {
      fetch(variables.API_URL + this.site + '/signin', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password
        })
      })
        .then(res => res.json())
        .then((data) => {
          this.setState({ auth: data })
          console.log(data);
          if (!this.state.auth.token) {
            !this.state.auth.message
              ?(!this.state.auth.error?alert('Failed'):alert(this.state.auth.error))
              :alert(this.state.auth.message);
          } else {
            localStorage.setItem("Token", this.state.auth.token);
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.Token=this.state.auth.token;
            alert('Login Successfully \nYou can access the other sites');
          }
        }, (error) => {
          alert('Failed');
        });
    } else {
       fetch(variables.API_URL + this.site + '/signup/' + this.state.email, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then((data) => {
          this.setState({ auth: data })
          console.log(data, 'found:',this.state.auth.found);
          if (!data) {
            alert('Failed');
          } else {
            this.isFound = this.state.auth.found > 0;
            console.log(this.state.auth.found,this.isFound);
            if (this.isFound) {
              alert('The email exists');
            };
            if(!this.isFound || this.state.email === 'im.user@no.matter.com') {
               fetch(variables.API_URL + this.site + '/signup', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  email: this.state.email,
                  password: this.state.password,
                  firstName: this.state.firstName,
                  lastName: this.state.lastName,
                  Roles: this.state.RolesArray,
                  TokenExternal: this.state.Token,
                })
              })
                .then(res => res.json())
                .then((result) => {
                  alert(result.message);
                  console.log(result);
      
                }, (error) => {
                  alert('Failed');
                });
            }
          }
        }, (error) => {
          alert('Failed');
          console.log(error);
        });
    }
  }

  render() {
    const {
      email,
      password,
      passwordAgain,
      firstName,
      lastName,
      modalTitle,
      strengthBadge,
      backgroundColor,
      Viewer,
      Editor,
      Admin,
      disabledArray
    } = this.state;
    return (
      <div>
        <button type="submit" className="btn btn-primary m-2 float-end" data-bs-toggle="modal" data-bs-target="#exampleModal"
          onClick={() => this.submitClick()}>
          Submit
        </button>
        <button type="submit" className="btn btn-primary m-2 float-end" data-bs-toggle="modal" data-bs-target="#exampleModal"
          onClick={() => this.loginClick()}>
          Login
        </button>

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centred">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{(modalTitle)}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="Login">
                  <Form onSubmit={this.handleSubmit}>
                    <div>
                      <Form.Group size="lg" controlId="email">
                        <Form.Label>EMail</Form.Label>
                        <Form.Control autoFocus type="email" value={email} onChange={this.onChangeEmail} placeholder="Email" />
                      </Form.Group>
                      {modalTitle === 'Register' ?
                        <div>
                          <Form.Label>User Name</Form.Label>
                          <div className="input-group mb-3">
                            <Form.Control type="name" className="form-control" value={firstName} onChange={this.onChangeFirstName} placeholder="First Name" />
                            <Form.Control type="name" className="form-control" value={lastName} onChange={this.onChangeLastName} placeholder="Last Name" />
                          </div>
                        </div>
                        : null}
                      <Form.Group size="lg" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} onChange={this.onChangePassword} placeholder="Password"
                        name="password" aria-labelledby="password-uid4-label password-uid4-helper password-uid4-valid password-uid4-error" 
                        autocomplete="current-password" spellcheck="false"/>
                      </Form.Group>
                      {modalTitle === 'Register' ?
                        <Form.Group size="lg" controlId="passwordAgain">
                          <span id="StrengthDisp" className={backgroundColor} >{strengthBadge}</span>
                          <Form.Label>Confirm password</Form.Label>
                          <Form.Control type="password" value={passwordAgain} onChange={this.onChangePasswordAgain} placeholder="Confirm Password" />
                          <div className="ml-3">
                            <Form.Label>Role</Form.Label>
                            {['checkbox'].map((type) => (
                              <div key={`inline-${type}`} className="mr-3">
                                {disabledArray[0] ?
                                  <Form.Check inline label="Viewer" name="group1" type={type} id={`inline-${type}-1`} disabled /> :
                                  <Form.Check inline label="Viewer" name="group1" type={type} id={`inline-${type}-1`}
                                    onChange={this.onChangeViewer} checked={Viewer}/>}
                                {disabledArray[1] ?
                                  <Form.Check inline label="Editor" name="group1" type={type} id={`inline-${type}-2`} disabled /> :
                                  <Form.Check inline label="Editor" name="group1" type={type} id={`inline-${type}-2`}
                                    onChange={this.onChangeEditor} checked={Editor}/>}
                                {disabledArray[2] ?
                                  <Form.Check inline label="Admin " name="group1" type={type} id={`inline-${type}-3`} disabled /> :
                                  <Form.Check inline label="Admin " name="group1" type={type} id={`inline-${type}-3`}
                                    onChange={this.onChangeAdmin} checked={Admin}/>}
                              </div>
                            ))}

                          </div>
                        </Form.Group>
                        : null}
                    </div>
                    <div>
                      <pre> </pre>
                      {modalTitle === 'Register' ?
                        <Button block size="lg" type="submit" disabled={!this.validateForm()} >Sign Up</Button> : null
                      }
                      {modalTitle === 'Login' ?
                        <Button block size="lg" type="submit" disabled={!this.validateForm()} >Sign In</Button> : null
                      }
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
