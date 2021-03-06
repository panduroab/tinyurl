import React, { Component } from 'react';
import { TextField, RaisedButton, Snackbar, Card, CardText, Checkbox } from 'material-ui';
import { Link } from 'react-router';
import UrlModel from '../../models/Url';
const urlService = new UrlModel();
const apiHost = process.env.REACT_APP_API_HOST || window.location.host;

class Home extends Component {
    constructor() {
        super();
        this.state = {
            openError: false,
            customUrl: false,
            errorMessage: '',
            url: {}
        };
    };

    isValidURL(url) {
        var reUrl = new RegExp(
            "^" +
            // protocol identifier
            "(?:(?:https?|ftp)://)" +
            // user:pass authentication
            "(?:\\S+(?::\\S*)?@)?" +
            "(?:" +
            // IP address dotted notation octets
            "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
            "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
            "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
            "|" +
            // host name
            "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
            // domain name
            "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
            // TLD identifier
            "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
            // TLD may end with dot
            "\\.?" +
            ")" +
            // port number
            "(?::\\d{2,5})?" +
            // resource path
            "(?:[/?#]\\S*)?" +
            "$", "i"
        );
        return reUrl.test(url);
    };

    handleChange(key) {
        return function (e, val) {
            this.setState((prevState) => {
                let url = prevState.url;
                url[key] = val;
                return {
                    url
                }
            });
        }.bind(this);
    };

    handleCustomUrl = (e, val) => {
        this.setState({
            customUrl: val
        });
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
        urlService.encode({
            "body": { ...this.state.url }
        })
            .then((encodedUrl) => {
                this.setState({
                    openError: false,
                    errorMessage: '',
                    url: encodedUrl
                });
            }, (err) => {
                this.setState({
                    openError: true,
                    errorMessage: err.message
                });
            });
    };

    handleCloseError = () => {
        this.setState({
            openError: false,
        });
    };

    render() {
        let encodedUrl = (this.state.url.short) ?
            <Card>
                <CardText style={{
                    textAlign: "center"
                }}>
                    <p>TinyURL:</p>
                    <a href={apiHost + '/' + this.state.url.short} target="_blank">
                        {apiHost + '/' + this.state.url.short}
                    </a>
                </CardText>
            </Card>
            : null;
        let customUrl = (this.state.customUrl) ?
            <TextField
                id="customShort"
                floatingLabelText="Custom hash"
                hintText="wzln"
                floatingLabelFixed={true}
                fullWidth={true}
                onChange={this.handleChange("customShort")}
            />
            : null;
        return (
            <div style={{
                marginTop: '10px'
            }}>
                <div style={{
                    textAlign: "right"
                }}>
                    <Link to="/catalog">Go to Catalog</Link>
                </div>
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
                {
                    customUrl
                }
                <Checkbox
                    id="unique"
                    label="Give me a unique short URL"
                    onCheck={this.handleChange("unique")} />
                <Checkbox
                    id="custom"
                    label="Create your custom URL"
                    onCheck={this.handleCustomUrl} />
                <div style={{
                    textAlign: "right"
                }}>
                    <RaisedButton
                        style={{
                            textAlign: "right"
                        }}
                        label="Make it Tiny"
                        labelPosition="before"
                        containerElement="label"
                        onClick={this.handleTinyRequest}
                    />
                </div>
                <div style={{
                    marginTop: "20px"
                }}>
                    {encodedUrl}
                </div>
            </div>
        );
    }
}

export default Home;