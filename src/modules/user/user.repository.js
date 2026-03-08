/*
 Repository layer
 Responsible for database queries
*/

class UserRepository {

    async getAllUsers() {
  
      /*
       Later we will fetch from MySQL
      */
  
      return [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" }
      ];
    }
  
  }
  
  module.exports = new UserRepository();