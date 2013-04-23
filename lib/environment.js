// general configuration


/**
 * implemented as a global function, so we can prgamatically default and group
 * values as needed
 *
 * @param string varname
 * @return mixed value or null
 */
getSetting = function(varname) {

  if (varname == 'googleAnalyticsId') {
    return 'UA-2011466-8';
  }
  // nothing matched... return null
  return null;

};
