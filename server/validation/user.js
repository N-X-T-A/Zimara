const Joi = require("joi");

const phoneNumberRegex = /^[+]?[0-9]{10,15}$/;

const userValidation = Joi.object({
  username: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Tên người dùng không được để trống",
    "any.required": "Tên người dùng là bắt buộc",
    "string.min": "Tên người dùng phải có ít nhất {#limit} ký tự",
    "string.max": "Tên người dùng không được vượt quá {#limit} ký tự",
  }),
  email: Joi.string().required().email().messages({
    "string.empty": "Email không được để trống",
    "any.required": "Email là bắt buộc",
    "string.email": "Email không đúng định dạng",
  }),
  password: Joi.string().required().min(5).max(255).messages({
    "string.empty": "Mật khẩu không được để trống",
    "any.required": "Mật khẩu là bắt buộc",
    "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
    "string.max": "Mật khẩu không được vượt quá {#limit} ký tự",
  }),
  phonenumber: Joi.string().required().pattern(phoneNumberRegex).messages({
    "string.empty": "Số điện thoại không được để trống",
    "any.required": "Số điện thoại là bắt buộc",
    "string.pattern.base": "Số điện thoại không đúng định dạng",
  }),
  default_address: Joi.string().allow(null, "").max(300).messages({
    "string.max": "Địa chỉ mặc định không được vượt quá {#limit} ký tự",
  }),
});

module.exports = userValidation;
