const Joi = require("@hapi/joi");

const userRegistrationValidation = data => {
    const schema = Joi.object({
        fullName: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        birthdayDate: Joi.date().required(),
    });
    return schema.validate(data)
}
const userLoginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data)
}

const userLocationValidation = data => {
    const schema = Joi.object({
        latitude: Joi.number().required(),
        longtitude: Joi.number().required(),
    });
    return schema.validate(data)
}

module.exports.userRegistrationValidation = userRegistrationValidation;
module.exports.userLoginValidation = userLoginValidation;
module.exports.userLocationValidation = userLocationValidation;