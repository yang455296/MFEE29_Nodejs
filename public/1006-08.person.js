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

// 同03.person 只改附檔名 .mjs -> .js