import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppBar } from 'material-ui';
import Home from './Home';

class App extends Component {
    render() {
        const { content } = this.props;
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar title="TinyURL" />
                    <div style={{
                        width: '80%',
                        margin: '0 auto',
                    }}>
                    {content || <Home />}
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;