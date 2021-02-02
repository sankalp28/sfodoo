/**
 * Summary: Helper
 * Description: common methods added at Helper utility
 * @author Pawan Gupta
 */

const Helper = (function() {
  /**
   * Description: Add itme at array
   * @param {Array}  _items
   * @param {Object} _item
   * @return none
   */
  const addItem = (_items, _item) => {
    _items.push(_item);
    //console.log(_items);
  };

  const removeNode = (dataArray, key, value) => {
    return dataArray.filter(function(emp) {
      if (emp[key] == value) {
        return false;
      }
      return true;
    });
  };

  /**
   * Description: get Object By Single Key from Object Array
   * @param {Array} _arrayObj
   * @param {string} key
   * @param {string || numeric} id
   * @param {Boolean} compareNumber
   * @return {Object}
   */
  const getObjectByKeySearch = (_arrayObj, keys, value) => {
    const data = _arrayObj.filter((item) => {
      return item[keys].toUpperCase().includes(value.toUpperCase());
    });
    if (data.length > 0) {
      return data[0];
    } else {
      return false;
    }
  };


  /**
   * Description: get Object By Single Key from Object Array
   * @param {Array} _arrayObj
   * @param {string} key
   * @param {string || numeric} id
   * @param {Boolean} compareNumber
   * @return {Object}
   */
  const getObjectByKeyExactSearch = (_arrayObj, keys, value) => {
    //console.log(_arrayObj);
    //console.log(keys);
    //console.log(value);

    const data = _arrayObj.filter((item) => {
      return (item[keys] + "").toUpperCase().trim() == (value + "").toUpperCase().trim()
    });
    if (data.length > 0) {
      return data[0];
    } else {
      return false;
    }
  };

  // /**
  //  * Description: get Object By Single Key from Object Array
  //  * @param {Array} _arrayObj
  //  * @param {string} key
  //  * @param {string || numeric} id
  //  * @param {Boolean} compareNumber
  //  * @return {Object}
  //  */
  // const getObjectByKeyExactSearch1 = (_arrayObj, keys, value) => {
  //   const data = _arrayObj.find((data) => {
  //     //console.log(data[keys].toUpperCase() , "===",  value.toUpperCase())
  //     return data[keys].toUpperCase() === value.toUpperCase();
  //   });

  //   if (data) {
  //     return data;
  //   } else {
  //     return false;
  //   }
  // };

  return {
    addItem: addItem,
    removeNode: removeNode,
    getObjectByKeySearch: getObjectByKeySearch,
    getObjectByKeyExactSearch: getObjectByKeyExactSearch,
  };
})();

export default Helper;
