import React, { Component } from 'react';
import {
    Table,
    TableHeader,
    TableRow,
    TableHeaderColumn,
    TableRowColumn,
    TableBody,
    RaisedButton
} from 'material-ui';
import UrlModel from '../../models/Url';
const urlService = new UrlModel();
const apiHost = process.env.REACT_APP_API_HOST || window.location.host;

class UrlCatalog extends Component {
    constructor() {
        super();
        this.state = {
            skip: 0,
            limit: 10,
            urls: []
        };
    }

    fetchUrls() {
        urlService.find({
            "filter": {
                "order": "numericId DESC",
                "limit": this.state.limit,
                "skip": this.state.skip
            }
        })
            .then((urls) => {
                this.setState({
                    urls: urls
                });
            }, (err) => {
                this.setState({
                    openError: true,
                    errorMessage: err.message
                });
            });
    }

    handleNextRequest = () => {
        this.setState((prevState) => {
            return {
                skip: prevState.skip + prevState.limit
            };
        }, () => {
            this.fetchUrls();
        });
    }

    handlePrevRequest = () => {
        this.setState((prevState) => {
            return {
                skip: prevState.skip - prevState.limit
            };
        }, () => {
            this.fetchUrls();
        });
    }

    componentDidMount() {
        this.fetchUrls();
    }

    render() {
        let prevButton = (this.state.skip > 0) ?
            <RaisedButton
                style={{
                    marginRight: '10px'
                }}
                label="Previous"
                labelPosition="before"
                containerElement="label"
                onClick={this.handlePrevRequest}
            >
            </RaisedButton>
            : null;
        return (
            <div>
                <Table>
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>Short</TableHeaderColumn>
                            <TableHeaderColumn>Original</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}>
                        {
                            this.state.urls.map((url, idkey) => {
                                return (<TableRow key={idkey}>
                                    <TableRowColumn>
                                        <a href={apiHost + '/' + url.short} target="_blank">
                                            {apiHost + '/' + url.short}
                                        </a>
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        <a href={url.original} target="_blank">
                                            {url.original}
                                        </a>
                                    </TableRowColumn>
                                </TableRow>);
                            })
                        }
                    </TableBody>
                </Table>
                <div style={{
                    textAlign: "right"
                }}>
                    {prevButton}
                    <RaisedButton
                        label="Next"
                        labelPosition="before"
                        containerElement="label"
                        onClick={this.handleNextRequest}
                    >
                    </RaisedButton>
                </div>
            </div>
        );
    }
}

export default UrlCatalog;