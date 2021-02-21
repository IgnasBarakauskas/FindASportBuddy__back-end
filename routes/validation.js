const Joi = require("@hapi/joi");

const userValidation = data => {
    const schema = Joi.object({
        fullName: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        birthdayDate: Joi.date().required(),
    });
    return schema.validate(data)
}
module.exports.userValidation =userValidation;