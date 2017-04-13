import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppBar } from 'material-ui'; 
import { hashHistory } from 'react-router';
import Home from './Home'; import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class App extends Component {
    constructor(props) {
        super();
    }

    handleTouchTap = () => {
        hashHistory.push('/');
    }

    render() {
        const { content } = this.props;
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar title={<span style={{
                        cursor: 'pointer',
                    }}>TinyURL</span>}
                        showMenuIconButton={false}
                        onTitleTouchTap={this.handleTouchTap} />
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