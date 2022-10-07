const f1 = a => a * a;
const f2 = (j) => {
    let sum = 0;
    for (let i = 1; i <= j; i++) {
        sum += i;
    }
    return sum;
}
console.log(f1(6));
console.log(f2(11));

//  terminal:  node .\src\1006-02.func01.js