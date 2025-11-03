declare global {
    interface Window {
        __NEXT_DATA__: {
            props: {
                pageProps: {
                    [key: string]: any;
                };
            };
        };
    }
}
