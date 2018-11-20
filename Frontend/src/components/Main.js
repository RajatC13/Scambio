import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Login from './Login/Login';
import Home from './Home/Home';
import Delete from './Delete/Delete';
import Create from './Create/Create';
import Navbar from './LandingPage/Navbar';
//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Switch>
                <Route exact path="/login"/>
                <Route path="/" component={Navbar}/>
                </Switch>
                <Route path="/login" component={Login}/>
                <Route path="/home" component={Home}/>
                <Route path="/delete" component={Delete}/>
                <Route path="/create" component={Create}/>
            </div>
        )
    }
}
//Export The Main Component
export default Main;
