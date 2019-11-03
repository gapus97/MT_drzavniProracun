import React from 'react';


class Header extends React.Component {

    componentDidMount() {
        
    }

    render() {
        return (
            <header className="App-header">
                <ul>
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/about">About</a>
                    </li>
                
                </ul>
            </header>
        );
    }
}

export default Header;