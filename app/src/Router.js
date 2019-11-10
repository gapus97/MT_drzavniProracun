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
import StateBudget from './sites/StateBudget';

class Routes extends React.Component {
    render() {
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
                        <Route exact path="/" component={Main} />
                        <Route path="/about" component={About} />
                        <Route path="/stateBudget" component={StateBudget} />                           
                    </Switch>
                    
                    <Footer />
                </div>
            </Router>
        );
    }
}

export default Routes;