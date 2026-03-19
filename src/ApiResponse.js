class ApiResponse {
  constructor(data, message = "Success", statusCode = 200) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}


module.exports = ApiResponse