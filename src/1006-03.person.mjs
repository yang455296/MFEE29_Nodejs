export default class Person {
    gender = 'female';
    constructor(name = 'noname', age = 0) {
        this.name = name;
        this.age = age;
    }
    toJSON() {
        const { name, age, gender } = this;
        return { name, age, gender };
    }
    toString() {
        return JSON.stringify(this);
    }
}

export const a = 10;

const f = n => n * n;
export { f };
// 這裡專門做匯出,不做執行
// const p1 = new Person('Davide', 25);

// console.log(p1 + '');

//  terminal: node .\src\1006-03.person.mjs