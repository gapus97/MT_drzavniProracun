import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import Main from './sites/Main';
import About from './sites/About';
import Header from './components/Header';
import Footer from './components/Footer';

// TODO; add more paths, refactor this router --> add header and footer
export default function Paths() {
    return (    
        <Router>
            <div className="main-content">
                <Header />
                
                {/*
                A <Switch> looks through all its children <Route>
                elements and renders the first one whose path
                matches the current URL. Use a <Switch> any time
                you have multiple routes, but you want only one
                of them to render at a time
                */}
                
                <Switch>
                    <Route exact path="/">
                        <Main />
                    </Route>
                    <Route path="/about">
                        <About />
                    </Route>
                </Switch>
                
                <Footer />
            </div>
        </Router>
    );
}