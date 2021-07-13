
export default class Common {

  static sort<T extends { [key: string]: any }>(items: T[], criteria: Array<keyof T>) {
    items.sort((a, b) => {
      return criteria.reduce((sum, currentCriteria) => {
        const propertyA = a[currentCriteria];
        const propertyB = b[currentCriteria];
        const newSum = typeof (propertyA) == "string" ?
          propertyA.toLowerCase().localeCompare(propertyB.toLowerCase()) :
          typeof (propertyA) == "number" ?
            propertyA - propertyB : 0;
        return sum ? sum : newSum;
      }, 0);
    })
    return items;
  }
}





//https://qastack.mx/programming/9960908/permutations-in-javascript


// permutator(inputArr) {
//   let result = [];

//   const permute = (arr, m = []) => {
//     if (arr.length === 0) {
//       result.push(m)
//     } else {
//       for (let i = 0; i < arr.length; i++) {
//         let curr = arr.slice();
//         let next = curr.splice(i, 1);
//         permute(curr.slice(), m.concat(next))
//       }
//     }
//   }

//   permute(inputArr)

//   return result;
// }



// permute1(permutation) {
//   var length = permutation.length,
//     result = [permutation.slice()],
//     c = new Array(length).fill(0),
//     i = 1, k, p;

//   while (i < length) {
//     if (c[i] < i) {
//       k = i % 2 && c[i];
//       p = permutation[i];
//       permutation[i] = permutation[k];
//       permutation[k] = p;
//       ++c[i];
//       i = 1;
//       result.push(permutation.slice());
//     } else {
//       c[i] = 0;
//       ++i;
//     }
//   }
//   return result;
// }
