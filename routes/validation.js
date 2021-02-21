const Joi = require("@hapi/joi");

const userValidation = data => {
    const schema = Joi.object({
        fullname: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        birthdayDate: Joi.date().required(),
        height: Joi.number(),
        weight: Joi.number(),
        latitude: Joi.number(),
        longtitude: Joi.number(),
    });
    return schema.validate(data)
}
module.exports.userValidation =userValidation;