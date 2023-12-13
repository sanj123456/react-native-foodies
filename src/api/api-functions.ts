export const makeQueryString = (obj: {[key: string]: any}): string => {
  let queryString = '';
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      queryString +=
        encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]) + '&';
    }
  }
  return queryString.slice(0, -1);
};

export const makeBearerToken = (token: string) => {
  return `Bearer ${token}`;
};
