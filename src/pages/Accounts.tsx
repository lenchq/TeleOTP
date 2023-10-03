import {FC, useContext, useState} from "react";
import {
    Button,
    LinearProgress,
    Stack,
    Typography,
    IconButton, Container, Grid, useTheme, Box
} from "@mui/material";
import copy from 'copy-text-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SettingsIcon from "@mui/icons-material/Settings";
import {useNavigate} from "react-router-dom";
import useAccount from "../hooks/useAccount.ts";
import EditIcon from '@mui/icons-material/Edit';
import AccountSelectButton from "../components/AccountSelectButton.tsx";
import NewAccountButton from "../components/NewAccountButton.tsx";
import {StorageManagerContext} from "../managers/storage.tsx";
import {icons} from "../globals.ts";
import NewAccount from "./NewAccount.tsx";

const Accounts: FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const storageManager = useContext(StorageManagerContext);

    const [
        selectedAccountId,
        setSelectedAccountId
    ] = useState<string | null>(storageManager ? Object.keys(storageManager.accounts)[0] : null);
    const selectedAccount = selectedAccountId && storageManager ? storageManager.accounts[selectedAccountId] : null;

    const {code, progress} = useAccount(selectedAccount?.uri);

    if (storageManager === null || Object.keys(storageManager.accounts).length < 1) {
        return <NewAccount/>;
    }

    return <Stack justifyContent="space-between" sx={{height: '100%'}} spacing={2}>
        <Stack spacing={2}>
            <Container sx={{bgcolor: "background.paper", borderRadius: "6px", paddingY: theme.spacing(2)}}>
                <Stack spacing={1} direction="row" justifyContent="center" alignItems="center">
                    <Typography variant="body2">
                        {selectedAccount?.issuer ?
                            `${selectedAccount.issuer} (${selectedAccount.label})` :
                            selectedAccount?.label}
                    </Typography>
                    <IconButton onClick={() => { navigate('/edit'); }}>
                        <EditIcon/>
                    </IconButton>
                </Stack>

                <Stack spacing={1} direction="row" justifyContent="center" alignItems="center">
                    <Typography variant="h3">
                        {code.match(/.{1,3}/g)?.join(" ")}
                    </Typography>
                    <IconButton color={selectedAccount?.color} onClick={() => {
                        copy(code);
                    }}>
                        <ContentCopyIcon fontSize="large"/>
                    </IconButton>
                </Stack>
                <LinearProgress
                    sx={{marginY: theme.spacing(1), borderRadius: 100, height: 6}}
                    variant="determinate"
                    value={progress*100}
                    color={selectedAccount?.color}
                />
            </Container>

            <Container disableGutters>
                <Grid container spacing={1}>
                    {Object.values(storageManager.accounts).map((account) => (
                        <Grid key={account.id} item xs={3}>
                            <AccountSelectButton
                                icon={icons[account.icon]}
                                label={account.label}
                                issuer={account.issuer}
                                selected={account.id === selectedAccountId}
                                onClick={() => { setSelectedAccountId(account.id); }}
                                color={account.color}/>
                        </Grid>
                    ))}
                    <Grid item xs={3}>
                        <NewAccountButton/>
                    </Grid>
                </Grid>
            </Container>
        </Stack>

        <Box sx={{bgcolor: "background.paper", borderRadius: "6px"}}>
            <Button
                fullWidth
                startIcon={<SettingsIcon />}
                variant="text"
                sx={{textTransform: 'none', paddingY: theme.spacing(1.5)}}
                onClick={() => { navigate("/settings"); }}
            >
                <Typography fontWeight="bold" color="text" fontSize="small">Open settings</Typography>
            </Button>
        </Box>

    </Stack>;
}

export default Accounts;