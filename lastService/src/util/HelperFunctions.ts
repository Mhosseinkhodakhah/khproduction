/**
 * this module is for helpers that uses in the whole project
 * 
 *//////////////////////////////////////////////////////////





/**
 * this function is for helping for creating the right format for gold weight
 * @param weight 
 * @returns 
 */
export function formatGoldWeight(weight) {
    let seperator = weight.split('')
    console.log(  'after validation' , +(`${seperator[0]}${seperator[1]}${seperator[2]}${seperator[3]}${seperator[4]}`))
    return parseFloat((Math.round(weight * 100) / 100).toFixed(3));
}

