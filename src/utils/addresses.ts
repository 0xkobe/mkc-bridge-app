export const TEST = false

export const AVALANCHE_URL = TEST ? 'https://api.avax-test.network/ext/bc/C/rpc' : 'https://api.avax.network/ext/bc/C/rpc'
export const BSC_URL = TEST ? "https://data-seed-prebsc-1-s1.binance.org:8545" : 'https://bsc-dataseed.binance.org/'

export const BRIDGE_AVAX_ADDRESS = TEST ? "0xFdD7C285838c3DD8584BFcC7bEB1259ac658d17e" : "0xf572a9Bc621b23969D7232f1717eA2E63fE0A5DE"
export const MKC_AVAX_ADDRESS = TEST ? "0xE82c4ce37F381242E9082c28c84936778dFCc1D3" : "0xCA490D74e3e7044481a61A76f8f9995994e8DdFD"
export const AVAX_CHAINID = TEST ? "0xA869" : "0xA86A"
// export const AVAX_CHAINID = TEST ? 43113 : 43114

export const BRIDGE_BSC_ADDRESS = TEST ? "0xDc7bE980b7b4D3A1aBB8237B6D795f84154C05B4" : "0x815Fa6B5E6FeD310914138a55130734cE5ac3D69"
export const MKC_BSC_ADDRESS = TEST ? "0xE82c4ce37F381242E9082c28c84936778dFCc1D3" : "0xb413A28a743A886901Ebc3383Fb7f055f86DD8f8"
// export const BSC_CHAINID = TEST ? 97 : 56
export const BSC_CHAINID = TEST ? "0x61" : "0x38"
