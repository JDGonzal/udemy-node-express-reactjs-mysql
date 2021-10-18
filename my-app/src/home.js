import React, { Component } from 'react';
import { variables } from './variables.js';

export class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      auth: [],
      email: "",
      password: "",
      ok: ""
    }
    this.site = "auth"
    this.Token = "";
  }

  onChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  }

  onChangePassword = (e) => {
    this.setState({ password: e.target.value });
  }

  authClick() {
    fetch(variables.API_URL + this.site, {
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
        localStorage.setItem("Token", this.state.auth.token);
        alert('Login Successfully \nYou can access the other sites'); 
      }, (error) => {
        alert('Failed');
      })
  }

  render() {
    const {
      email,
      password,
    } = this.state;
    return (
      <div>
       <div className="d-flex flex-row-center bd-highlight mb-3">
          <div className="p-2 w-50 bd-highlight container-fluid h-custom"> 
            <div className="container-fluid h-custom">
              <form className="row d-flex justify-content-center align-items-center h-100" id="account">
                <div className="form-group float-center container">
                  <div className="input-group mb-3">
                    <input type="text" className="form-control float-center" placeholder="Email" id="username"
                      value={email} onChange={this.onChangeEmail} />
                  </div>
                  <div className="input-group mb-3">
                    <input type="password" className="form-control float-center" placeholder="Password" id="password"
                      value={password} onChange={this.onChangePassword} />
                  </div>
                </div>
                <div>
                  <button type="button" className="btn btn-primary float-center"id ="login" onClick={() => this.authClick()}>Singn In</button>
                </div>
              </form>
            </div>
          </div>
        </div> 
      </div>
    )
  }
}
