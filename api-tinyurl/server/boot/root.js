'use strict';

module.exports = function (server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());

  router.get('/:hash', function (req, res) {
    var urlService = server.models.Url;
    var clickService = server.models.Click;
    var filter = {
      "where": {
        "short": req.params.hash
      }
    };
    urlService.findOne(filter, function (err, url) {
      if (err) {
        console.log("error:", err);
        return res.status(404).end();
      }

      if (!url) {
        console.log("URL not found");
        return res.status(404).send("Page not found.");
      }

      clickService.create({
        "createdAt": new Date(),
        "urlId": url.id
      });

      res.redirect(url.original);
    });
  });

  server.use(router);
};
