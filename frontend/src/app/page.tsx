"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider'

import { vote, getVotes } from "@/api/api";
import { formatBalance } from '@/utils';
import styles from './page.module.css';

interface GetVotesResponse {
    fruit: string;
    votes: number;
}

const initialState = { accounts: [], balance: "" };

export default function Home() {
    const [voting, setVoting] = useState(false);
    const [votes, setVotes] = useState<GetVotesResponse>();
    const [txHash, setTxHash] = useState<string>();

    const [hasProvider, setHasProvider] = useState<boolean | null>(null);
    const [signer, setSigner] = useState<ethers.JsonRpcSigner>();
    const [wallet, setWallet] = useState(initialState);

    const options = [
        { value: '', text: '--Choose an option--', disabled: true },
        { value: 'apple', text: 'Apple 🍏' },
        { value: 'banana', text: 'Banana 🍌' },
        { value: 'kiwi', text: 'Kiwi 🥝' },
        { value: 'grape', text: 'Grape 🍇' },
        { value: 'coconut', text: 'Coconut 🥥' },
        { value: 'lemon', text: 'Lemon 🍋' },
        { value: 'strawberry', text: 'Strawberry 🍓' },
    ];
    const [selectedFruitToVote, setSelectedFruitToVote] = useState(options[0].value);

    useEffect(() => {
        const browseProvider = async () => {
            const bProvider = new ethers.BrowserProvider(window.ethereum);
            const bSigner = await bProvider.getSigner();
            setSigner(bSigner)
        };
        browseProvider();
    }, [wallet]);

    useEffect(() => {
        const refreshAccounts = (accounts: any) => {
            if (accounts.length > 0) {
                updateWallet(accounts)
            } else {
                setWallet(initialState)
            }
        }

        const getProvider = async () => {
            const provider = await detectEthereumProvider({ silent: true })
            setHasProvider(Boolean(provider))

            if (provider) {
                const accounts = await window.ethereum.request(
                    { method: 'eth_accounts' }
                )
                refreshAccounts(accounts)
                window.ethereum.on('accountsChanged', refreshAccounts)
            }
        }

        getProvider()

        return () => {
            window.ethereum?.removeListener('accountsChanged', refreshAccounts)
        }
    }, []);

    const updateWallet = async (accounts: any) => {
        const balance = formatBalance(await window.ethereum!.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"],
        }))
        setWallet({ accounts, balance })
    }

    const handleConnect = async () => {
        let accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        updateWallet(accounts)
    }

    const handleFruitNameVoteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFruitToVote(e.target.value);
    }

    const onClickVote = async (e: React.MouseEvent<HTMLElement>) => {
        if (signer === undefined) {
            console.error("no signer defined!");
        }
        setVoting(true);

        const unsignedTx = await vote(selectedFruitToVote);
        const receipt = await signer?.sendTransaction(unsignedTx);

        setTxHash(receipt?.hash);
        setVoting(false);
    }

    const onClickGetVotes = async (fruitName: string) => {
        const tx: GetVotesResponse = await getVotes(fruitName);
        setVotes(tx);
    }

    return (
        <main className={styles.main}>
            <div className={styles.description}>
                <p>
                    Fruit Voting &nbsp;
                    <code className={styles.code}>ethers.ts</code>
                </p>

                <div>
                    {!hasProvider ? <p><code>Injected Provider Does Not Exist</code></p> : ''}

                    {window.ethereum?.isMetaMask && wallet.accounts.length < 1 &&
                        <button onClick={handleConnect}>Connect MetaMask</button>
                    }

                    {wallet.accounts.length > 0 &&
                        <>
                            <p>
                                Account: <code>{wallet.accounts[0]}</code>
                            </p>
                            <p>
                                Balance: <code>{wallet.balance}</code>
                            </p>
                        </>
                    }
                </div>
            </div>

            <div className={styles.center}>
                <div>
                    <label htmlFor="fruit">Select a Fruit:&nbsp;</label>

                    <select
                        value={selectedFruitToVote}
                        onChange={handleFruitNameVoteChange}>
                        {options.map(option => (
                            <option key={option.value} value={option.value} disabled={option.disabled}>
                                {option.text}
                            </option>
                        ))}
                    </select>

                    <button onClick={onClickVote}>Vote</button>
                    {voting && <span>Voting...</span>}
                    {txHash &&
                        <a href={"https://sepolia.etherscan.io/tx/" + txHash} target="_blank">
                            See Sepolia Transaction
                        </a>
                    }
                </div>
                <div>
                    <ul>
                        {options.map(option => (
                            !option.disabled &&
                            <span key={option.value}>
                                <li className={styles.liStyle}>
                                    <div>
                                        {option.text} &nbsp; &nbsp;
                                    </div>
                                    <div>
                                        <button onClick={() => onClickGetVotes(option.value)}>
                                            Check
                                        </button>
                                    </div>
                                    <div>
                                        {(votes?.fruit == option.value) ? <span>votes: {votes?.votes}</span> : ""}
                                    </div>
                                </li>
                            </span>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={styles.grid}>

            </div>
        </main>
    )
}
