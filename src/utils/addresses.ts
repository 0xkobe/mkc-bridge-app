export const TEST = true

export const AVALANCHE_URL = TEST ? 'https://api.avax-test.network/ext/bc/C/rpc' : 'https://api.avax.network/ext/bc/C/rpc'
export const BSC_URL = TEST ? "https://data-seed-prebsc-1-s1.binance.org:8545" : 'https://bsc-dataseed.binance.org/'

export const BRIDGE_AVAX_ADDRESS = TEST ? "0xFdD7C285838c3DD8584BFcC7bEB1259ac658d17e" : "0xde2AFcf0b176f68100f3F4bc6A9d0E7D788cafDb"
export const MKC_AVAX_ADDRESS = TEST ? "0xE82c4ce37F381242E9082c28c84936778dFCc1D3" : "0x65378b697853568dA9ff8EaB60C13E1Ee9f4a654"
export const AVAX_CHAINID = TEST ? "0xA869" : "0xA86A"
// export const AVAX_CHAINID = TEST ? 43113 : 43114

export const BRIDGE_BSC_ADDRESS = TEST ? "0xDc7bE980b7b4D3A1aBB8237B6D795f84154C05B4" : "0x2ba832506284AF58abF5c677345e34d90A52875B"
export const MKC_BSC_ADDRESS = TEST ? "0xE82c4ce37F381242E9082c28c84936778dFCc1D3" : "0x52D88a9a2a20A840d7A336D21e427E9aD093dEEA"
// export const BSC_CHAINID = TEST ? 97 : 56
export const BSC_CHAINID = TEST ? "0x61" : "0x38"
