'use strict';

var async = require('async');
var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

module.exports = function (Url) {

    Url.isValidURL = function (url) {
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

    Url.encodeId = function (numericId) {
        var hash = [];
        var base = characters.length;
        if (numericId === 0) {
            return characters[0];
        }
        while (numericId > 0) {
            hash.push(characters[numericId % base]);
            numericId = parseInt(numericId / base, 10);
        }
        return hash.reverse().join("");
    };

    Url.decodeHash = function (hash) {
        var numericId = 0;
        var base = characters.length;
        hash.split("").forEach(function (item) {
            numericId = numericId * base + characters.indexOf(item);
        });
        return numericId;
    };

    Url.encodeService = function (filter, next) {
        async.waterfall([
            function getUrl(next) {
                if (filter.unique || filter.short) {
                    Url.create(filter, function (err, url) {
                        if (err) {
                            return next(err);
                        }
                        next(null, url, true);
                    });
                } else {
                    Url.findOrCreate({ "where": filter }, filter, function (err, url, created) {
                        if (err) {
                            return next(err);
                        }
                        next(null, url, created);
                    });
                }
            },
            function encodeUrl(url, created, next) {
                if (!url) {
                    return next(new Error("Unexpected error."));
                }

                if (!created || filter.customShort) {
                    return next(null, url);
                }

                Url.count(function (err, count) {
                    if (err) {
                        return next(err);
                    }
                    url.numericId = count;
                    url.short = Url.encodeId(count);
                    url.save(function (err, result) {
                        if (err) {
                            return next(err);
                        }
                        return next(null, result);
                    });
                });
            }
        ], next);
    };

    Url.encode = function (body, next) {
        if (!body.original) {
            return next(new Error("The attribute 'original' is required."));
        }

        if (!Url.isValidURL(body.original)) {
            return next(new Error("Invalid url."));
        }

        var filter = {
            "original": body.original,
            "unique": body.unique || false,
            "customShort": body.customShort || null
        };

        if (body.customShort) {
            filter['short'] = body.customShort;
        }

        Url.encodeService(filter, next);
    };

    Url.remoteMethod('encode', {
        accepts: [{
            arg: 'body',
            type: 'any',
            required: true,
            http: {
                source: 'body'
            }
        }],
        http: {
            path: '/encode',
            verb: 'post'
        },
        returns: {
            arg: 'result',
            root: true,
            type: 'any'
        }
    });

};
