import Joi from 'joi';

import { ERROR_CODE, STATUS_CODES } from '../constants/index.js';
import {pick} from "../utils/pick.js";


export function validate(schema) {
    return (req, res, next) => {
        const validationSchema = pick(schema, ['params', 'query', 'body']);
        const object = pick(req, Object.keys(validationSchema));
        const {value, error} = Joi.compile(validationSchema)
            .validate(object);

        if (error) {
            const errorMessage = error.details
                .map((details) => details.message)
                .join(', ');

            return res
                .status(STATUS_CODES.BAD_REQUEST)
                .json({code: ERROR_CODE.INVALID_FORM, message: errorMessage});
        }

        Object.assign(req, value);
        return next();
    }
}
