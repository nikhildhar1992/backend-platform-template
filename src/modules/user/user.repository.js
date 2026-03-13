/*
 Repository layer
 Responsible for database queries
*/

class UserRepository {
   data = [
    { id: 1, name: "Nik", email: "nik@example.com" },
    { id: 2, name: "Nikhil", email: "nikhil@example.com" }
  ];
    async getAllUsers() {
  
      /*
       Later we will fetch from MySQL
      */
  
      return this.data;
    }

    async createUser(data) {

        return {
          id: Date.now(),
          ...data
        };
      
      }

      async findByEmail(email) {
        const user = this.data.find(user => user.email === email);
        if (!user) {
          return null;
        }
        return user;
      }
  
  }
  
  module.exports = new UserRepository();