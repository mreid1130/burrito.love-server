module.exports = function(app) {
  require('./base')(app);
  require('./stats')(app);
  require('./auth')(app);
};
