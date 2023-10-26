import Box, { BoxProps } from '@mui/material/Box';

export const formatBalance = (rawBalance: string) => {
    const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(4);
    return balance;
};

export const shortenHexString = (
    hexString: string,
    length: number = 8
): string => {
    if (hexString.startsWith("0x")) {
        hexString = hexString.slice(2);
    }

    if (hexString.length <= length) {
        return "0x" + hexString;
    }

    const prefix: string = hexString.slice(0, length);
    const suffix: string = hexString.slice(-length);
    const shortenedHex: string = `${prefix}...${suffix}`;

    return "0x" + shortenedHex;
};

export function Item(props: BoxProps) {
    const { sx, ...other } = props;
    return (
        <Box
            sx={{
                p: 1,
                m: 1,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
                color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
                border: '1px solid',
                borderColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                borderRadius: 2,
                fontSize: '0.875rem',
                fontWeight: '700',
                ...sx,
            }}
            {...other}
        />
    );
}