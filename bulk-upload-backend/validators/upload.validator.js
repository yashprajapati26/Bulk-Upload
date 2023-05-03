const Joi = require("joi");


uploadValidator = Joi.object().keys({
    file: Joi.binary().required(),
});


module.exports = uploadValidator;