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
    let seperator = weight.toString().split('')
    let newGoldWeight = `${seperator[0]}${seperator[1]}${seperator[2]}${seperator[3]}${seperator[4]}`
    console.log( 'after validation' , +newGoldWeight )
    return +newGoldWeight
    // return parseFloat((Math.round(weight * 100) / 100).toFixed(3));
}

