var gist = require('./lib/gist')
var repo = require('./lib/repo')

module.exports = {
  gist: gist.gist,
  gistSha: gist.gistSha,

  repo: repo.repo,
  repoSha: repo.repoSha
}
