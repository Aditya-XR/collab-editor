class ApiResponse {
  constructor(message = "Success", data = {}) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.errors = [];
  }
}

export default ApiResponse;
