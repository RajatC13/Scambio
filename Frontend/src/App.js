import React, { Component } from 'react';
import './App.css';
import Main from './components/Main';
import {BrowserRouter} from 'react-router-dom';
import HttpSerice from './services/http-service';


const http = new HttpSerice();
//App Component
class App extends Component {

    constructor(props) {
        super(props);

        //Bind functions
        this.loadData = this.loadData.bind(this);
        this.loadData();
    }

    loadData = () => {
        http.getJunks().then(junks => {
            console.log(junks);
        }, err => {
        });
    }

    render() {
        return (
            //Use Browser Router to route to different pages
            <BrowserRouter>
            <div>
                {/* App Component Has a Child Component called Main*/}
                <Main/>
            </div>
            </BrowserRouter>
        );
    }
}
//Export the App component so that it can be used in index.js
export default App;
