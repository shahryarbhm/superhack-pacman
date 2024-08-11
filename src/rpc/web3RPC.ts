import type { IProvider } from "@web3auth/base";
import Web3 from "web3";
import contractABI from "../abi/pacman.json";

const contractAddress = "0x95fd2C7f1cfD23641116C16f08be621EC3dA1a20"

const getChainId = async (provider: IProvider): Promise<string> => {
    try {
        const web3 = new Web3(provider);

        // Get the connected Chain's ID
        const chainId = await web3.eth.getChainId();

        return chainId.toString();
    } catch (error) {
        return error as string;
    }
}

const getAccounts = async (provider: IProvider): Promise<any> => {
    try {
        const web3 = new Web3(provider as any);

        // Get user's Ethereum public address
        const address = (await web3.eth.getAccounts());

        return address;
    } catch (error) {
        return error;
    }
}

const getBalance = async (provider: IProvider): Promise<string> => {
    try {
        const web3 = new Web3(provider as any);

        // Get user's Ethereum public address
        const address = (await web3.eth.getAccounts())[0];

        // Get user's balance in ether
        const balance = web3.utils.fromWei(
            await web3.eth.getBalance(address), // Balance is in wei
            "ether"
        );

        return balance;
    } catch (error) {
        return error as string;
    }
}

const signMessage = async (provider: IProvider): Promise<string> => {
    try {
        const web3 = new Web3(provider as any);

        // Get user's Ethereum public address
        const fromAddress = (await web3.eth.getAccounts())[0];

        const originalMessage = "YOUR_MESSAGE";

        // Sign the message
        const signedMessage = await web3.eth.personal.sign(
            originalMessage,
            fromAddress,
            "test password!" // configure your own password here.
        );

        return signedMessage;
    } catch (error) {
        return error as string;
    }
}

const sendTransaction = async (provider: IProvider): Promise<any> => {
    try {
        const web3 = new Web3(provider as any);

        // Get user's Ethereum public address
        const fromAddress = (await web3.eth.getAccounts())[0];

        const destination = fromAddress;

        const amount = web3.utils.toWei("0.001", "ether"); // Convert 1 ether to wei
        let transaction = {
            from: fromAddress,
            to: destination,
            data: "0x",
            value: amount,
        }

        // calculate gas transaction before sending
        transaction = { ...transaction, gas: await web3.eth.estimateGas(transaction) } as any;

        // Submit transaction to the blockchain and wait for it to be mined
        const receipt = await web3.eth.sendTransaction(transaction);

        return JSON.stringify(receipt, (key, value) =>
            typeof value === 'bigint'
                ? value.toString()
                : value // return everything else unchanged
        );
    } catch (error) {
        return error as string;
    }
}

const createGame = async (provider: IProvider): Promise<any> => {
    try {
        const web3 = new Web3(provider as any);
        const myContract = new web3.eth.Contract(JSON.parse(JSON.stringify(contractABI)), contractAddress);
        const receipt = await myContract.methods.createGame().send({
            from: `${(await web3.eth.getAccounts())[0]}`,
        });
        return receipt;
    }
    catch (error) {
        return error as string
    }
}

const updateScore = async (provider: IProvider, score: Number): Promise<any> => {
    try {
        const web3 = new Web3(provider as any);
        const myContract = new web3.eth.Contract(JSON.parse(JSON.stringify(contractABI)), contractAddress);
        const receipt = await myContract.methods.updateScore(score).send({
            from: `${(await web3.eth.getAccounts())[0]}`,
        });
        return receipt;
    }
    catch (error) {
        return error as string
    }

}

export default { getChainId, getAccounts, getBalance, sendTransaction, signMessage, createGame, updateScore };