'use strict';

var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

module.exports = function (Url) {

    Url.isValidURL = function (url) {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
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

    Url.encode = function (body, next) {
        if (!body.original) {
            return next(new Error("The attribute 'original' is required."));
        }

        if (!Url.isValidURL(body.original)) {
            return next(new Error("Invalid url."));
        }

        var filter = {
            "original": body.original
        };

        Url.findOrCreate({
            "where": filter
        }, filter, function (err, url, created) {
            if (err) {
                return next(err);
            }

            if (!url) {
                return next(new Error("Unexpected error."));
            }

            if (!created) {
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
        });
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
