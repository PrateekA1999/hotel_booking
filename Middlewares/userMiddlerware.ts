import joi from "joi";

const createUserSchema = joi
  .object({
    first_name: joi.string().trim().required().label("First Name"),
    last_name: joi.string().trim().required().label("Last name"),
    email: joi.string().trim().email().required().label("Email"),
    password: joi.string().trim().required().label("Password"),
    phone_number: joi.string().trim().min(10).required().label("Phone number"),
  })
  .and("first_name", "last_name", "email", "password", "phone_number");

const updateUserSchema = joi
  .object({
    phone_number: joi.string().trim().min(10).label("Phone number"),
  })
  .or("first_name", "last_name", "phone_number");

const passwordSchema = joi
  .object({
    password: joi.string().trim().required().label("Password"),
  })
  .and("password");

export const userActiveStatusSchema = joi
  .object({
    active: joi.boolean().required().label("Active status"),
  })
  .and("active");

export const validatePassword = (req: any, res: any, next: any) => {
  const { error } = passwordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateUserCreation = (req: any, res: any, next: any) => {
  const { error } = createUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateUserUpdate = (req: any, res: any, next: any) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateUserActiveStatus = (req: any, res: any, next: any) => {
  const { error } = userActiveStatusSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
