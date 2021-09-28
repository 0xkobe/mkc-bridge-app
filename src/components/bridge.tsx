import { useState, useEffect } from 'react';
import { CgArrowsExchange } from 'react-icons/cg';

import './bridge.css';
import {
  NetworkType,
  getMKCInWallet,
  convertBigNumbersToReadableUnits,
  connectWallet,
  getWalletInfos,
  getApprovedHuskies,
  approveHuskies,
  getBridgeFees,
  sendToBridge,
  getTokenByNetwork,
  switchToNetwork,
} from '../utils/utils';

const win = window as any;

const Bridge = () => {
  const [connected, setConnected] = useState(false);
  // const [walletAddress, setWalletAddress] = useState('0x');
  // const [walletBalance, setWalletBalance] = useState(0);
  const [network, setNetwork] = useState<NetworkType>('AVAX');
  const [mkcBalance, setMKCBalance] = useState(0);

  const [approved, setApproved] = useState(0);
  const [toSend, setToSend] = useState(0);
  const [bridgeFees, setBridgeFees] = useState(0);

  const updateInfos = async () => {
    const infos = await getWalletInfos();
    console.log('wallet infos:', infos);
    // setWalletAddress(infos.address);
    // setWalletBalance(infos.balance);
    setNetwork(infos.network);
    const mkcs = await getMKCInWallet(infos.network);
    setMKCBalance(mkcs);
    const approved = await getApprovedHuskies(infos.network);
    setApproved(approved);
    const fees = await getBridgeFees(infos.network);
    setBridgeFees(fees);
  };

  useEffect(() => {
    async function start() {
      const conn = await connectWallet();
      setConnected(conn);
    }
    start();
    if (win.ethereum) {
      win.ethereum.on('networkChanged', (networkId: any) => {
        console.log('new network : ', networkId);
        updateInfos();
      });
      win.ethereum.on('chainCHanged', (chainId: any) => {
        console.log('new chain : ', chainId);
      });
      win.ethereum.on('accountsChanged', (accounts: any) => {
        console.log('accountsChanges', accounts);
        updateInfos();
      });
    }
  }, []);

  useEffect(() => {
    if (connected === true) {
      console.log('web 3 connected. getting wallet infos');
      updateInfos();
    }
  }, [connected]);

  const requestApprove = async () => {
    const resp = await approveHuskies(network);
    if (resp === true) {
      const approved = await getApprovedHuskies(network);
      setApproved(approved);
    } else {
      console.log('Couldnt approve contract');
    }
  };

  const switchNetwork = () => {
    if (network === 'AVAX') switchToNetwork('BSC');
    else if (network === 'BSC') switchToNetwork('AVAX');
  };

  const NetworkTypeToFullName = {
    BSC: 'Binance Smart Chain',
    AVAX: 'Avalanche',
    Unsupported: 'Unsupported',
  };

  return connected ? (
    <>
      <div className="wallet-top">
        <span className="app-tag">FROM</span>
        <p className="app-network-name">{NetworkTypeToFullName[network]}</p>
        {/* <p>address: {walletAddress}</p> */}
        {/* <p>
            balance: {walletBalance} {getTokenByNetwork(network)}
          </p> */}
        <div className="app-input">
          <input
            value={toSend}
            type="number"
            placeholder="0"
            onChange={(event) => setToSend(event.target.value ? parseInt(event.target.value) : 0)}
          />
          {toSend !== mkcBalance && (
            <button className="app-input-max-btn" onClick={() => setToSend(mkcBalance)}>
              MAX
            </button>
          )}
          <span className="app-mkc-tag">MKC</span>
        </div>
        <div className="app-balance">
          <div>
            <p>Approved: {convertBigNumbersToReadableUnits(approved, 'MKC')}</p>
          </div>
          <div>
            <p>Available Balance:</p>
            <p>{convertBigNumbersToReadableUnits(mkcBalance, 'MKC')}</p>
          </div>
        </div>
        <p>
          Fees : {bridgeFees} {getTokenByNetwork(network)}
        </p>
        <button className="app-btn-switch">
          <CgArrowsExchange onClick={switchNetwork} size={40} />
        </button>
      </div>
      <div className="wallet-bottom">
        <span className="app-tag-to">TO</span>
        <p className="app-network-name">
          {network === 'AVAX'
            ? 'Binance Smart Chain'
            : network === 'BSC'
              ? 'Avalanche'
              : NetworkTypeToFullName[network]}
        </p>
      </div>
      {toSend < approved ? (
        <button
          className="app-btn"
          disabled={toSend <= 0 || toSend > mkcBalance}
          onClick={() => sendToBridge(network, toSend, bridgeFees)}
        >
          {toSend <= 0
            ? 'Enter a valid amount'
            : toSend > mkcBalance
              ? 'Insufficient MKC balance'
              : 'Send to bridge'}
        </button>
      ) : (
        <button className="app-btn ml-sm" onClick={requestApprove}>
          Approve
        </button>
      )}
    </>
  ) : (
    <div className="unconnected-container">
      <p>Please connect to metamask</p>
    </div>
  );
};
export default Bridge;
