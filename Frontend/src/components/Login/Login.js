import React, { Component } from 'react';
import './Login.css';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';


class Login extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            username: "",
            password: "",
            authFlag: false,
            formErrors: { email: '', password: '' },
            emailValid: false,
            passwordValid: false,
            formValid: false
        }
        //Bind the handlers to this class
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }
    //username change handler to update state variable with the text entered by the user
    usernameChangeHandler = (e) => {
        this.setState({
            username: e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            username: this.state.username,
            password: this.state.password
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/login', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        authFlag: true
                    })
                } else {
                    this.setState({
                        authFlag: false
                    })
                }
            });
    }

    render() {
        //redirect based on successful login
        let redirectVar = null;
        if (cookie.load('cookie')) {
            redirectVar = <Redirect to="/home" />
        }
        return (
            <div>
                {redirectVar}


                <div className="row">
                    <div className="col-md-4 left-info">
                        <h3> Left Info</h3>
                    </div>
                    <div className="col-md-8">
                        <h3> Right</h3>
                        <div className="container">
                            <div className="panel panel-default">
                                {/* <FormErrors formErrors={this.state.formErrors} /> */}
                            </div>

                            <div className="login-form">
                                <div className="main-div">
                                    <div className="panel">
                                        <h2>Admin Login</h2>
                                        <p>Please enter your username and password</p>
                                    </div>

                                    <div className="form-group">
                                        <input onChange={this.usernameChangeHandler} type="text" className="form-control" name="username" placeholder="Username" required />
                                    </div>
                                    <div className="form-group">
                                        <input onChange={this.passwordChangeHandler} type="password" className="form-control" name="password" placeholder="Password" required />
                                    </div>
                                    <button onClick={this.submitLogin} className="btn btn-primary">Login</button>
                                </div>
                            </div>
                        </div>
                        <div className="container">
                            <h2>Stacked form</h2>
                            <form onSubmit={e => this.submit(e)}>
                                <div className="form-group">
                                    <label for="email">Email:</label>
                                    <input type="text" className="form-control" id="email" placeholder="Enter email" onChange={e => this.change(e)}  value={this.state.email} name="email"></input>
                                </div>
                                <div className="form-group">
                                    <label for="pwd">Password:</label>
                                    <input type="password" className="form-control" id="pwd" placeholder="Enter password" onChange={e => this.change(e)} value={this.state.password} name="password"></input>
                                </div>
                                <div className="form-group form-check">
                                    <label className="form-check-label">
                                    <input className="form-check-input" type="checkbox" name="remember"></input>
                                </label>
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                    </div>
                </div>



        )
    }
}
//export Login Component
export default Login;
