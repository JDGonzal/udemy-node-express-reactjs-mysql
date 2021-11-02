import React, { Component } from 'react';
import { variables } from './variables.js';

export class Token extends Component {

  constructor(props) {
    super(props);

    this.state = {
      token: "",
      message: localStorage.getItem("message"),
    }
    this.Token = "";
    this.site = "token";
  }

  updateUser() {
    console.log(variables.API_URL + this.site + '/activate')
    console.log('x-auth-token', this.Token, 'token', this.state.Token);
    fetch(variables.API_URL + this.site + '/activate', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': this.Token
      },
      body: JSON.stringify({
        token: this.state.Token
      })
    })
      .then(res => res.json())
      .then((result) => {
        if (!result.message) {
          console.log(result.error);
          alert(result.error)
        } else {
          localStorage.setItem("message", result.message);
          this.setState({ message: result.message });
          setTimeout(console.log('href', window.location.href), 2000);
          let spl = window.location.href.split('?');
          window.location.replace(spl[0]);
        }
      }, (error) => {
        alert('Failed', error);
      });
  }

  getParams() {
    let params = {};
    window.location.search.slice(1).split('&').forEach(elm => {
      if (elm === '') return;
      let spl = elm.split('=');
      const d = decodeURIComponent;
      params[d(spl[0])] = (spl.length >= 2 ? d(spl[1]) : true);
    });
    if (!params.value || !params.Token) {
      localStorage.removeItem("message");
    } else {
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state.Token = params.value;
      this.Token = params.Token;
      //Call the: post(), put(), delete(), options(), trace(), copy(), lock(), mkcol(), 
      //move(), purge(), propfind(), proppatch(), unlock(), report(), mkactivity(), checkout(), 
      //merge(), m-search() , notify(), subscribe(), unsubscribe(), patch(), search(), and connect().
      this.updateUser()
    }
  }

  componentDidMount() {
    this.getParams();
  }

  render() {
    const {
      message
    } = this.state;
    return (
      <div>
        <h3 className="d-flex justify-content-center m-3">
          {message}
        </h3>
      </div>
    )
  }
}