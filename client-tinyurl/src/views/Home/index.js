import React, { Component } from 'react';
import { TextField, RaisedButton, Snackbar } from 'material-ui';
import UrlModel from '../../models/Url';
const urlService = new UrlModel();

class Home extends Component {
    constructor() {
        super();
        this.state = {
            openError: false,
            errorMessage: '',
            url: {}
        };
    };

    isValidURL(url) {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
    };

    handleChange(key) {
        return function (e) {
            let url = {};
            url[key] = e.target.value;
            this.setState({
                url
            });
        }.bind(this);
    };

    handleTinyRequest = () => {
        //Validate the URL
        if (!this.state.url.original || !this.isValidURL(this.state.url.original)) {
            this.setState({
                openError: true,
                errorMessage: "Try again with a valid URL."
            });
            return false;
        }
        //Encode the original URL
        urlService.encode(this.state.url)
            .then((encodedUrl) => {
                this.setState({
                    openError: false,
                    errorMessage: '',
                    url: encodedUrl
                });
            }, (err) => {
                console.log("err", err);
            });
    };

    handleCloseError = () => {
        this.setState({
            openError: false,
        });
    };

    render() {
        /*let API_HOST = process.env.API_HOST;
        let encodedUrl = (this.state.url.short) ?
            <div>
                <a href={API_HOST + '/' + this.state.url.short} target="_blank">{API_HOST + '/' + this.state.url.short}</a>
            </div>
            : null;*/
        let encodedUrl = null;
        return (
            <div>
                <div>
                    <Snackbar
                        open={this.state.openError}
                        message={this.state.errorMessage}
                        autoHideDuration={4000}
                        onRequestClose={this.handleCloseError}
                        bodyStyle={{ backgroundColor: "#D32F2F" }}
                    />
                    <TextField
                        id="original"
                        floatingLabelText="Long URL"
                        hintText="http://my-really-long-url.com"
                        floatingLabelFixed={true}
                        fullWidth={true}
                        onChange={this.handleChange("original")}
                    />
                    <RaisedButton
                        label="Make it Tiny"
                        labelPosition="before"
                        containerElement="label"
                        onClick={this.handleTinyRequest}
                    >
                    </RaisedButton>
                </div>
                {encodedUrl}
            </div>
        );
    }
}

export default Home;