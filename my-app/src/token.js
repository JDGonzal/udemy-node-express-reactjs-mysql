import React, { Component } from 'react';

export class Token extends Component {

  constructor(props) {
    super(props);

    this.state = {
      Tokens: [],
      //Add Modal by each Token 
      modalTitle: "",
      TokenName: "",
      TokenId: 0,

      TokenIdFilter: "",
      TokenNameFilter: "",
      TokensWithoutFilter: [],
      Token: localStorage.getItem("Token")
    }
    this.site = "token";
    this.alertMessage = 'Please Login before to acces this site';
  }
  render() {
    const {
      Tokens,
      modalTitle,
      TokenName,
      TokenId
    } = this.state;
    return (
      <div>
        <h3 className="d-flex justify-content-center m-3">
          Token
        </h3>
      </div>
    )
  }
}