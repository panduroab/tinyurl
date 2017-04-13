import React, { Component } from 'react';
import { Table, TableHeader, TableRow, TableHeaderColumn, TableRowColumn, TableBody } from 'material-ui';
import UrlModel from '../../models/Url';
const urlService = new UrlModel();
const apiHost = process.env.REACT_APP_API_HOST || window.location.host;

class UrlCatalog extends Component {
    constructor() {
        super();
        this.state = {
            urls: []
        };
    }

    componentDidMount() {
        urlService.find({
            "filter": {
                "order": "numericId DESC"
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

    render() {
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
            </div>
        );
    }
}

export default UrlCatalog;