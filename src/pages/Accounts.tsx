import {FC, useEffect, useState} from "react";
import {
    Button,
    LinearProgress,
    Stack,
    Typography,
    IconButton, Container, Grid, useTheme, Box
} from "@mui/material";
import * as copy from "copy-to-clipboard";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SettingsIcon from "@mui/icons-material/Settings";
import {useNavigate} from "react-router-dom";
import useAccount from "../hooks/useAccount.ts";
import EditIcon from '@mui/icons-material/Edit';
import GitHubIcon from '@mui/icons-material/GitHub';
import AccountSelectButton from "../components/AccountSelectButton.tsx";
import NewAccountButton from "../components/NewAccountButton.tsx";

const Accounts: FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    // TODO: add storage and encryption
    const {code, period} = useAccount("otpauth://totp/TeleOTP?secret=JBSWY3DPEHPK3PXP&algorithm=SHA1&digits=6&period=30");

    const accounts = [1, 2, 3, 4, 5];
    const [account, setAccount] = useState(accounts[0]);

    const [time, setTime] = useState(0);
    useEffect(() => {
        const timer = setInterval(()=>{
            setTime((Date.now() / 1000) % 30);
        }, 300);

        return () => {
            clearInterval(timer);
        };
    });

    return <Stack spacing={2}>
        <Container sx={{bgcolor: "background.paper", borderRadius: "6px", paddingY: theme.spacing(2)}}>
            <Stack spacing={1} direction="row" justifyContent="center" alignItems="center">
                <Typography variant="body2">
                    Github (LowderPlay)
                </Typography>
                <IconButton onClick={() => { navigate('/edit'); }}>
                    <EditIcon/>
                </IconButton>
            </Stack>

            <Stack spacing={1} direction="row" justifyContent="center" alignItems="center">
                <Typography variant="h3">
                    {code.match(/.{1,3}/g)?.join(" ")}
                </Typography>
                <IconButton color="primary" onClick={() => {
                    copy(code);
                }}>
                    <ContentCopyIcon fontSize="large"/>
                </IconButton>
            </Stack>
            <LinearProgress sx={{marginY: theme.spacing(1), borderRadius: 100, height: 6}} variant="determinate" value={time/period*100} />
            {/*<CardActions>*/}
            {/*    <Button color="error" onClick={() => {*/}
            {/*        window.Telegram.WebApp.showPopup({*/}
            {/*            message: "Are you sure you want to remove your Github account forever? You might get locked out of this account!",*/}
            {/*            buttons: [*/}
            {/*                {type: "destructive", text: "Yes", id: "remove"},*/}
            {/*                {type: "cancel", id: "cancel"},*/}
            {/*            ]*/}
            {/*        }, (id) => {*/}
            {/*            console.log("delete", id);*/}
            {/*        });*/}
            {/*    }}>Delete account</Button>*/}
            {/*</CardActions>*/}
        </Container>

        <Container disableGutters>
            <Grid container spacing={1}>
                {accounts.map((value) => (
                    <Grid key={value} item xs={3}>
                        <AccountSelectButton
                            icon={GitHubIcon}
                            label={"bebrabebra@gmail"}
                            issuer={"Discord"}
                            selected={value===account}
                            onClick={() => { setAccount(value); }}/>
                    </Grid>
                ))}
                <Grid item xs={3}>
                    <NewAccountButton/>
                </Grid>
            </Grid>
        </Container>

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