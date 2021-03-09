const Joi = require("@hapi/joi");

const courtAddValidation = data => {
    const schema = Joi.object({
        type: Joi.string().min(3).required(),
        ammountOfCourts: Joi.number().required(),
        price: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
        });
    return schema.validate(data)
}
module.exports.courtAddValidation = courtAddValidation;