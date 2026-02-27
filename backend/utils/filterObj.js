const filterObj = (obj, ...allowedFields) => {
  const result = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) result[key] = obj[key];
  });
  return result;
};

module.exports = filterObj;
