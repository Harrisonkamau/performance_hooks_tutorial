let helpers = {
  jsonParser(str) {
    try {
      const obj = JSON.parse(str);
      return obj;
    } catch (e) {
      return {};
    }
  }
};

module.exports = helpers;
