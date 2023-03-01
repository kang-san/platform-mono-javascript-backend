export const ERROR_CODE = {
  NO_ERROR: 0,
  INVALID_FORM: -1,

  UNSUPPORTED_TOKEN_TYPE: -101,
  INVALID_TOKEN: -102,
  EXPIRED_DEVICE_SIGNATURE: -103,
  EXPIRED_SIGNATURE: -104,

  INVALID_PRODUCT_CODE: -201,
  UNREGISTERED_DEVICE: -202,
  INACTIVE_DEVICE: -203,
  NO_MODEL: -204,
  REGISTERED_DEVICE: -205,

  LOGIN_FAIL: -301,
  UNREGISTERED_USER: -302,
  USER_ID_EXISTS: -303,
  INSUFFICIENT_PERMISSION: -304,

  NO_HABILIMENT: -401,
  NO_ASSIGNED_HABILIMENT: -402,

  WORKER_LOGIN_FAIL: -501,
  UNREGISTERED_WORKER: -502,
  WORKER_ID_EXISTS: -503,
  MISMATCH_IN_OUT: -504,
  AGREEMENT_TEMPLATE_NOT_FOUND: -505,

  INTERNAL_SERVER_ERROR: -999,
};
