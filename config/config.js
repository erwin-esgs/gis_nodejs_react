module.exports = {
  "development": {
    "username": "root",
    "password": null,
    "database": "bundar_dev",
    "host": "127.0.0.1",
    "dialect": "mysql",
	  "dialectOptions": {
      "timezone": "+07:00", //for reading from database
      "dateStrings": true,
      "typeCast": function (field, next) { // for reading from database
        if (field.type === 'DATETIME') {
          return field.string()
        }
          return next()
        },
    }
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "bundar_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "bundar",
    "host": "127.0.0.1",
    "dialect": "mysql",
	  "dialectOptions": {
      "timezone": "+07:00", //for reading from database
      "dateStrings": true,
      "typeCast": function (field, next) { // for reading from database 
        if (field.type === 'DATETIME') {
          return field.string()
        }
          return next()
        },
    }
  }
}
