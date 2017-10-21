var S3 = require('aws-sdk/clients/s3')

var Abstract = require('abstract-random-access')
var inherits = require('inherits')

var Store = function (filename, options) {
  if (!(this instanceof Store)) return new Store(filename, options)
  Abstract.call(this)
  this.s3 = options.s3 || new S3()
  this.key = filename
  this.bucket = options.bucket
  inherits(Store, Abstract)
}

Store.prototype._read = function (offset, length, callback) {
  var params = {
    Bucket: this.bucket,
    Key: this.key,
    Range: `bytes=${offset}-${offset + length}`
  }
  this.s3.getObject(params, (err, data) => {
    if (err) return callback(err)
    callback(null, data.Body)
  })
}

module.exports = Store
