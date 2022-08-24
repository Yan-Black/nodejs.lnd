import HTTP404Error from '../errorHandler/HTTP404Error';

export const handleWildCard = () => {
  throw new HTTP404Error('requested resource not found');
};
