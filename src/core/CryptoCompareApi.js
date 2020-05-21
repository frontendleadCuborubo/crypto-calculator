import { HttpClient } from "./HttpClient";

const apiUrl = 'https://min-api.cryptocompare.com/data/pricemulti'

export const CryptoCompareApi = {
    convertPriceMulti: (fsyms, tsyms) => {
        return HttpClient.get(`${apiUrl}?fsyms=${fsyms}&tsyms=${tsyms}`)
    }
}