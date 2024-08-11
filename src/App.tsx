/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */

"use client";

import RPC from "./rpc/web3RPC";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { useEffect, useState } from "react";
import PacmanCanvas from "./components/PacmanCanvas";

const clientId = "BN3u3FzkI9l5RGOrLrUCC08gegAQaSf819hQYrlkgwsVtv9p9DJhEdckQ6dtqHLHP8AjZk4XJkBgIAX7JcJHMlc"; // get from https://dashboard.web3auth.io

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x66eee",
    rpcTarget: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public ",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Arbitrum Sepolia Test",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
});

const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
});

function App() {
    const [provider, setProvider] = useState<IProvider | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [userAddress, setUserAddress] = useState('');
    useEffect(() => {
        const init = async () => {
            try {
                await web3auth.initModal();
                setProvider(web3auth.provider);
                if (web3auth.connected) {
                    setLoggedIn(true);
                    try {
                        const userAddress = await RPC.getAccounts(provider as IProvider)
                        setUserAddress(userAddress)
                    }
                    catch (error) {
                        console.log(error)
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);

    const login = async () => {
        const web3authProvider = await web3auth.connect();
        setProvider(web3authProvider);
        if (web3auth.connected) {
            setLoggedIn(true);
        }
    };
    const logout = async () => {
        await web3auth.logout();
        setProvider(null);
        setLoggedIn(false);
    };
    const createGame = async () => {
        await RPC.createGame(provider as IProvider);
        if (!gameStarted) {
            setGameStarted(true);
        }
    }
    const updateScore = async (score: Number) => {
        await RPC.updateScore(provider as IProvider, score);
        setGameStarted(false);
    }
    const loggedInView = (
        <>
            <div className="flex-container">
                <div>
                    <span>User: {userAddress}</span>
                </div>
                <div>

                    {
                        gameStarted ? <PacmanCanvas updateScore={updateScore} /> :
                            <button onClick={createGame} className="card">
                                Start Game
                            </button>
                    }
                </div>
                <div>
                    <button onClick={logout} className="card">
                        Log Out
                    </button>

                </div>

            </div>
        </>
    );

    const unloggedInView = (
        <button onClick={login} className="card">
            Login
        </button>
    );

    return (
        <div className="container">
            <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
            <div id="console" style={{ whiteSpace: "pre-line" }}>
                <p style={{ whiteSpace: "pre-line" }}></p>
            </div>
        </div>
    );
}

export default App;