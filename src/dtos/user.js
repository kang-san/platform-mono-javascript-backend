import Joi from 'joi';

export const create = {
    body: Joi.object().keys({
        firstName: Joi.string().min(2).max(20).required(),
        lastName: Joi.string().min(2).max(20).required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
};

export const authUser = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
};

export const findOne = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
}

export const remove = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
}

export const updatePassword = {
    body: Joi.object().keys({
        password: Joi.string().min(3).required(),
    }),
}

export const resetPassword = {
    body: Joi.object().keys({
        password: Joi.string().min(3).required(),
        resetPasswordToken: Joi.string().required(),
        resetPasswordExpires: Joi.date().required(),
        passwordChangedAt: Joi.date().required(),
    }),
}