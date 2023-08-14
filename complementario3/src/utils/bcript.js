import bcrypt from 'bcrypt';

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)), null);
export const validatePassword = (password, hash) => bcrypt.compareSync(password, hash);
