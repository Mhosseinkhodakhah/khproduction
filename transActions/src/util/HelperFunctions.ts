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
    console.log('its here for validation >>>> ' , weight)
    let seperator = weight.toString().split('')
    let mainWeight = ''
    if (seperator.length == 5) {
        mainWeight = `${seperator[0]}${seperator[1]}${seperator[2]}${seperator[3]}${seperator[4]}`
    }else if (seperator.length == 4) {
        mainWeight = `${seperator[0]}${seperator[1]}${seperator[2]}${seperator[3]}0`
    } else if (seperator.length == 3) {
        mainWeight = `${seperator[0]}${seperator[1]}${seperator[2]}00`
    } else if (seperator.length == 2) {
        mainWeight = `${seperator[0]}${seperator[1]}000`
    } else if (seperator.length == 1) {
        mainWeight = `${seperator[0]}.000`
    }else if(seperator.length >= 5){
        mainWeight = `${seperator[0]}${seperator[1]}${seperator[2]}${seperator[3]}${seperator[4]}`
    }
    let newGoldWeight = `${mainWeight[0]}${mainWeight[1]}${mainWeight[2]}${mainWeight[3]}${mainWeight[4]}`
    console.log( 'after validation' , +newGoldWeight )
    return +newGoldWeight
    // return parseFloat((Math.round(weight * 100) / 100).toFixed(3));
}
