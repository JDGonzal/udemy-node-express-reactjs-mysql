const bcrypt = require('bcrypt');

const encrpted = async function(password){
  const salt = await bcrypt.genSalt(15);
  return await bcrypt.hash(password,salt);
  //that was the answer after use the ".then" : $2b$15$Igd1g/6ky4XAlm41urkPPuDq/.LKTvWIDT5mxW1U6CJKIIgCsCCUq
  //check into "database.js" where this function was called
};


module.exports = encrpted;