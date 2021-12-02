import { v4 as uuidv4 } from 'uuid';

/**
 * Product type
 */
interface Product {
    __id: string;
    title: string;
    descritpion: string;
    inStock: boolean;
    channel: string;
    price: {
        currency: string;
        value: number;
    },
    ageGroup: string;
};

/**
 * Business service providing various products
 */
export default class Products {

    products: Array<Product> = [
        { __id: uuidv4(), title: 'Cat', descritpion: 'Home animal', inStock: true, channel: 'online', price: { currency: 'EUR', value: 23.00}, ageGroup: '>18' },
        { __id: uuidv4(), title: 'Lion', descritpion: 'Wild animal', inStock: false, channel: 'branch', price: { currency: 'USD', value: 45.00}, ageGroup: '>4' },
        { __id: uuidv4(), title: 'Tiger', descritpion: 'Also wild animal', inStock: true, channel: 'online', price: { currency: 'EUR', value: 10.00}, ageGroup: '>0' },
    ];

    public get = async(): Promise<Array<Product>> => { return this.products };
    public find = async(id: string): Promise<Product | undefined> => { return this.products.find(p => id === p.__id) };
    public add(product: Product): void { product.__id = uuidv4(); this.products.push(product) };
    public delete(product: Product): void { this.products = this.products.filter(p => product.__id !== p.__id) };
}