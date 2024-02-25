/**
 * 
 * @description returns a custom error object
 * @param {Number} code 
 * @param {String} message 
 * @returns error Object
 */
module.exports.errorHandler = (code, message) => {
    const err = new Error(message);
    err.statusCode = code;
    return err ;
}