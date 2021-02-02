//Import axios
import axios from "axios";

//Public method
/**
 * Description: handle post method for url with header and body
 * @param {string} url
 * @param {object} header
 * @param {object} body
 * @return {null}
 */
const post = (url = "", body = {}, header = {}) =>
  axios
    .post(url, body, header)
    .then(handlePostResponse)
    .catch(error);

//Public method
/**
 * Description: handle put method for url with header and body
 * @param {string} url
 * @param {object} header
 * @param {object} body
 * @return {null}
 */
const put = (url = "", body = {}, header = {}) =>
  axios
    .put(url, body, header)
    .then(handlePostResponse)
    .catch(error);

//Public method
/**
 * Description: handle Delete method for url with header and body
 * @param {string} url
 * @param {object} header
 * @param {object} body
 * @return {null}
 */
const trash = (url = "", body = {}, header = {}) =>
axios
  .delete(url, body, header)
  .then(handlePostResponse)
  .catch(error);

//Public method
/**
 * Description: handle get method for url with header and body
 * @param {string} url
 * @param {object} header
 * @param {object} body
 * @return {response}
 */
const get = (url = "", body = "", header = {}) =>
  axios
    .get(url, body, header)
    .then(handleGetResponse)
    .catch(apierror => {
      return {
        status: -1,
        statusText: apierror.message
      };
    });

//Private Methods
/**
 * Description: Handle callback for success response
 * @param {object} _response
 * @return {object}
 */
const handlePostResponse = _response => {
  return _response;
};
//Private Methods
/**
 * Description: Handle callback for success response
 * @param {object} _response
 * @return {object}
 */
const handleGetResponse = _response => {
  return _response;
};

/**
 * Description: Handle callback for error
 * @param {object} _error
 * @return {object}
 */
const error = _error => {
  return _error;
};

//export APIService
export const APIService = { post, get, put, trash };
