"use client";
//external
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider'
//internal
import { vote, getVotes } from "@/api/api";
import { formatBalance, shortenHexString, Item } from '@/utils';
//styling
import styles from './page.module.css';
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';

export const theme = createTheme({
    palette: {
        primary: {
            main: "#fcba03",
        },
        action: {
            disabledBackground: '#cac5fc',
            disabled: '#720775'
        },
    },
});

const buttonTheme = createTheme({
    palette: {
        action: {
            disabledBackground: '#cac5fc',
            disabled: '#720775'
        },
    },
});

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
    // const [provider, setProvider] = useState<ethers.BrowserProvider>();
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
            if (wallet.accounts.length > 0) {
                const bProvider = new ethers.BrowserProvider(window.ethereum);
                const bSigner = await bProvider.getSigner();
                setSigner(bSigner)
                // setProvider(bProvider);
            }
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
            const ethProvider = await detectEthereumProvider({ silent: true })
            setHasProvider(Boolean(ethProvider))

            if (ethProvider) {
                const accounts = await window.ethereum.request(
                    { method: 'eth_accounts' }
                )
                refreshAccounts(accounts)
                window.ethereum.on('accountsChanged', refreshAccounts)
            }
        }

        getProvider();

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

    const handleFruitNameVoteChange = (e: SelectChangeEvent) => {
        setSelectedFruitToVote(e.target.value as string);
    }

    const onClickVote = async (e: React.MouseEvent<HTMLElement>) => {
        // const signer = await provider!.getSigner();
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
        <div className={styles.container}>

            <Box sx={{ height: '5 %', flexGrow: 0, marginBottom: '100px' }}>
                <AppBar>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Fruit Voting
                        </Typography>
                        <Box>
                            {
                                !hasProvider ?
                                    <Button variant="outlined" color="error">
                                        Injected Provider Does Not Exist
                                    </Button> : ''
                            }
                            {
                                wallet.accounts.length < 1 &&
                                <Button variant="contained" color="success" onClick={handleConnect}>
                                    Connect MetaMask
                                </Button>
                            }
                            {
                                wallet.accounts.length > 0 &&
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        p: 1,
                                        m: 1,
                                        bgcolor: 'background.paper',
                                        borderRadius: 1,
                                    }}
                                >
                                    <Item>{shortenHexString(wallet.accounts[0])}</Item>
                                    <Item>{wallet.balance} eth</Item>
                                </Box>

                            }
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>

            <Box sx={{ minWidth: 500, flexGrow: 1 }}>

                <Box marginBottom="15px">
                    {voting && <Button variant="contained" disabled>Voting...</Button>}
                    {txHash &&
                        <Button>
                            <Link href={"https://sepolia.etherscan.io/tx/" + txHash} target="_blank" underline="none">
                                See Sepolia Transaction
                            </Link>
                        </Button>
                    }
                </Box>

                <Grid container spacing={2} alignItems="center" marginBottom="50px" >
                    <Grid item xs={8}>
                        <FormControl fullWidth>
                            <InputLabel id="fruit-label">Select a Fruit</InputLabel>
                            <Select
                                labelId="fruit-label"
                                id="fruit-select"
                                value={selectedFruitToVote}
                                label="Fruit To Vote"
                                onChange={handleFruitNameVoteChange}
                            >
                                {
                                    options.map(option => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                            disabled={option.disabled}
                                        >
                                            {option.text}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4} alignItems="center" container spacing={0} direction="column">
                        <Button disabled={signer === undefined} variant="contained" endIcon={<SendIcon />} onClick={onClickVote}>
                            Vote
                        </Button>
                    </Grid>
                </Grid>

                <Box sx={{ border: 1, borderRadius: '10px', bgcolor: 'primary.light' }}>
                    <List dense={true}>
                        {options.map(option => (
                            !option.disabled &&
                            <ListItem key={option.value}>
                                <ListItemText
                                    primary={option.text}
                                />
                                {
                                    (votes?.fruit == option.value) ?
                                        <ThemeProvider theme={buttonTheme}>
                                            <Button variant="contained" disabled>
                                                {votes?.votes}
                                            </Button>
                                        </ThemeProvider> : ""
                                }


                                <Button color="secondary" disabled={signer === undefined} onClick={() => onClickGetVotes(option.value)}>
                                    Check Votes
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>
        </div >
    )
}
