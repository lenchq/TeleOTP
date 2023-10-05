import { Payload } from "./proto/generated/migration.js";
import {Account} from "../managers/storage.tsx";
import {Secret, TOTP} from "otpauth";
import {nanoid} from "nanoid";

export default function decodeGoogleAuthenticator(uri: string): Account[] | null  {
    if (!uri.startsWith("otpauth-migration://offline")) return null;

    const url = new URL(uri);
    const dataParam = url.searchParams.get("data");
    if (!dataParam) return null;

    const buffer = Uint8Array.from(atob(dataParam), (c) => c.charCodeAt(0));

    let payload;
    try {
        payload = Payload.decode(buffer);
    } catch (e) {
        return null;
    }

    const accounts: Account[] = [];

    for (const otp of payload.otpParameters) {
        if (otp.type !== Payload.OtpParameters.OtpType.OTP_TYPE_TOTP) continue;
        if (!otp.secret || !otp.name) continue;

        const totp = new TOTP({
            issuer: otp.issuer ?? undefined,
            label: otp.name ? otp.name.split(":").pop() : undefined,
            secret: new Secret({buffer: otp.secret}),
            digits: otp.digits === Payload.OtpParameters.DigitCount.DIGIT_COUNT_EIGHT ? 8 : 6,
            algorithm: otp.algorithm ? ({
                [Payload.OtpParameters.Algorithm.ALGORITHM_SHA1]: "SHA1",
                [Payload.OtpParameters.Algorithm.ALGORITHM_SHA256]: "SHA256",
                [Payload.OtpParameters.Algorithm.ALGORITHM_SHA512]: "SHA512",
                [Payload.OtpParameters.Algorithm.ALGORITHM_MD5]: "MD5",
                [Payload.OtpParameters.Algorithm.ALGORITHM_UNSPECIFIED]: undefined,
            })[otp.algorithm] : undefined,
        });
        accounts.push({
            id: nanoid(),
            label: totp.label,
            issuer: otp.issuer ?? undefined,
            color: "primary",
            icon: "key",
            uri: totp.toString(),
        });
    }

    return accounts;
}