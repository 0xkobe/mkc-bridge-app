import Web3 from 'web3';
import * as ERC20 from '../abis/ERC20.json';
import * as BridgeAVAX from '../abis/MKCBridgeAvax.json';
import * as BridgeBSC from '../abis/MKCBridgeBsc.json';
import { AVAX_CHAINID, AVALANCHE_URL, BSC_CHAINID, BSC_URL } from './addresses';
import {
  MKC_AVAX_ADDRESS,
  MKC_BSC_ADDRESS,
  BRIDGE_AVAX_ADDRESS,
  BRIDGE_BSC_ADDRESS,
} from './addresses';

const win = window as any;

export const convertFromWei = (value: string): number => {
  return parseFloat(Web3.utils.fromWei(value))
}

export const convertToWei = (value: number): string => {
  return Web3.utils.toWei(value.toString())
}


export const connectWallet = async (): Promise<boolean> => {
  console.log("connecting wallet")
  if (win.ethereum) {

    win.web3 = new Web3(win.ethereum)
    try {
      const res = await win.ethereum.enable()
      console.log("res: ", res)
      return true
    }
    catch {
      return false
    }
  }
  else {
    console.log("no web3 wallet")
    return false
  }
}

export const switchToNetwork = async (network: NetworkType) => {
  if (win.ethereum) {
    if (network === 'AVAX') {
      const data = [
        {
          chainId: AVAX_CHAINID,
          chainName: 'Avalanche Network',
          nativeCurrency: {
            name: 'AVAX',
            symbol: 'AVAX',
            decimals: 18,
          },
          rpcUrls: [AVALANCHE_URL],
        },
      ];
      await win.ethereum.request({ method: 'wallet_addEthereumChain', params: data });
    } else if (network === 'BSC') {
      const data = [
        {
          chainId: BSC_CHAINID,
          chainName: 'Binance Smart Chain',
          nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18,
          },
          rpcUrls: [BSC_URL],
        },
      ];
      await win.ethereum.request({ method: 'wallet_addEthereumChain', params: data });
    }
  }
};
export interface WalletInfos {
  address: string;
  balance: number;
  network: NetworkType;
}
export const initialWalletState = { address: '0x0', balance: 0, network: 'Unsupported' } as WalletInfos;

export const getWalletInfos = async (): Promise<WalletInfos> => {
  try {
    if (win.web3 !== undefined) {
      const address = await win.web3.eth.getAccounts()
      const balance = await win.web3.eth.getBalance(address[0])
      const net = await win.web3.eth.getChainId()
      return { address: address[0], balance: convertFromWei(balance), network: getNetworkTypeFromChainId(net) }

    }
    else {
      console.log("win.web3 undefined")
      return initialWalletState
    }

  }
  catch (error) {
    console.log(error)
    return initialWalletState

  }
}

export type NetworkType = 'BSC' | 'AVAX' | 'Unsupported'
export const getTokenByNetwork = (network: NetworkType): string => {
  if (network === 'AVAX') return "AVAX"
  if (network === 'BSC') return "BNB"
  else return ""
}
export const convertBigNumbersToReadableUnits = (value: number, symbol: string): string => {
  if (value > 1000000000000) {
    return (value / 1000000000000).toFixed(3) + "t " + symbol
  }
  else if (value > 1000000000) {
    return (value / 1000000000).toFixed(2) + 'bil ' + symbol
  }
  else if (value > 1000000) {
    return (value / 1000000).toFixed(1) + 'mil ' + symbol
  }
  else if (value > 1000) {
    return (value / 1000).toFixed(1) + 'k ' + symbol
  }
  else return value.toFixed(3) + ' ' + symbol
}
export const getAccount = async (web3: Web3): Promise<string> => {

  let account = await web3.eth.getAccounts()
  return account[0]
}

export const getNetworkTypeFromChainId = (id: number): NetworkType => {
  console.log('Network chain id:', id, parseInt(AVAX_CHAINID).toString());
  if (id === parseInt(AVAX_CHAINID)) return 'AVAX';
  else if (id === parseInt(BSC_CHAINID)) return 'BSC';
  else return 'Unsupported';
};

export const getMKCContract = (web3: Web3, network: NetworkType) => {
  return new web3.eth.Contract(ERC20.abi as any, network === 'AVAX' ? MKC_AVAX_ADDRESS : MKC_BSC_ADDRESS);
};
export const getBridgeContract = (web3: Web3, network: NetworkType) => {
  return new web3.eth.Contract(
    network === 'AVAX' ? (BridgeAVAX.abi as any) : (BridgeBSC.abi as any),
    network === 'AVAX' ? BRIDGE_AVAX_ADDRESS : BRIDGE_BSC_ADDRESS,
  );
};
export const getMKCInWallet = async (network: NetworkType): Promise<number> => {

  if (network === 'Unsupported') return 0
  if (win.web3 === undefined) return 0
  const mkcContract = getMKCContract(win.web3, network)
  const account = await getAccount(win.web3)
  try {
    const ret = await mkcContract.methods.balanceOf(account).call()
    return convertFromWei(ret)
  }
  catch (error) {

    console.log(error)
    return 0
  }
}

export const getApprovedHuskies = async (network: NetworkType): Promise<number> => {
  if (network === 'Unsupported') return 0;
  if (win.web3 === undefined) return 0;
  const mkcContract = getMKCContract(win.web3, network);
  const account = await getAccount(win.web3);
  const bridgeAddress = network === 'AVAX' ? BRIDGE_AVAX_ADDRESS : BRIDGE_BSC_ADDRESS;
  try {
    const ret = await mkcContract.methods.allowance(account, bridgeAddress).call();
    return convertFromWei(ret);
  } catch (error) {
    console.log('Error getting approved huskies');
    console.log(error);
    return 0;
  }
};

export const approveHuskies = async (network: NetworkType): Promise<boolean> => {
  if (network === 'Unsupported') return false;
  if (win.web3 === undefined) return false;
  const mkcContract = getMKCContract(win.web3, network);
  const account = await getAccount(win.web3);
  const bridgeAddress = network === 'AVAX' ? BRIDGE_AVAX_ADDRESS : BRIDGE_BSC_ADDRESS;

  try {
    await mkcContract.methods
      .approve(bridgeAddress, win.web3.utils.toWei('1000000000000000000'))
      .send({ from: account });

    return true;
  } catch (error) {
    console.log('Error approving huskies');
    console.log(error);
    return false;
  }
};

export const getBridgeFees = async (network: NetworkType): Promise<number> => {
  if (network === 'Unsupported') return 0
  if (win.web3 === undefined) return 0
  const bridgeContract = getBridgeContract(win.web3, network)

  try {
    const fees = await bridgeContract.methods.fees().call()
    console.log("Bridge fees: ", fees)
    return convertFromWei(fees)

  }
  catch (error) {
    console.log("Couldn't get bridge fees")
    console.log(error)
    return 0
  }
}

export const sendToBridge = async (network: NetworkType, amount: number, fees: number): Promise<boolean> => {
  if (network === 'Unsupported') return false
  if (win.web3 === undefined) return false
  const bridgeContract = getBridgeContract(win.web3, network)
  const account = await getAccount(win.web3)

  try {
    if (network === 'AVAX')
      await bridgeContract.methods.burn(convertToWei(amount)).send({ from: account, value: convertToWei(fees) })
    else if (network === 'BSC') {
      await bridgeContract.methods.burn(account, convertToWei(amount)).send({ from: account, value: convertToWei(fees) })
    }
    return true

  }
  catch (error) {
    console.log("Couldn't get bridge fees")
    console.log(error)
    return false
  }

}
