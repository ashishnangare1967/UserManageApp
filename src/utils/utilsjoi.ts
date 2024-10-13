// Helper functions for Joi
import Joi, { Schema } from 'joi';
import loggerE from './loggerE';

/**
 * @param {Schema} joiSchema
 * @param {*} validationObj
 */
export async function joiValidation(joiSchema: Schema, validationObj: any) {
  const { value, error } = joiSchema.validate(validationObj)
  if (error) {
    loggerE.error(`JoiValidationError: info: { errDetail: ${error} }`)
    throw new Error(`JoiValidationError: info: { errDetail: ${error} }`)
  }
  return value;
}