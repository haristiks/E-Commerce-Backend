const trycatchmiddleware = (trycatchhandler) => {
  return async (req, res, next) => {
    try {
      await trycatchhandler(req, res, next);
    } catch (error) {
      next(error);
      //
      //  TODO add error handling middleware
      //
    }
  };
};
module.exports = trycatchmiddleware;
