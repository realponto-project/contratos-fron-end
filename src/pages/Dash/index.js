import React, { Component } from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Logout } from "../Login/LoginRedux/action";

// import { Container } from './styles';

class DashPage extends Component {
  render() {
    return (
      <>
        <Button onClick={this.props.Logout}>logout</Button>
        <h1>welcome to the hell</h1>
      </>
    );
  }
}

function mapDispacthToProps(dispach) {
  return bindActionCreators({ Logout }, dispach);
}

function mapStateToProps(state) {
  return {
    state: state
  };
}

export default connect(mapStateToProps, mapDispacthToProps)(DashPage);
