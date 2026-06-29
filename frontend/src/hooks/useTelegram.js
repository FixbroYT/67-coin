import { useEffect, useState } from 'react';

export function useTelegram() {
    const [tg, setTg] = useState(null);

    useEffect(() => {
        const checkTg = () => {
            if (window.Telegram?.WebApp) {
                const webapp = window.Telegram.WebApp;
                webapp.ready();
                setTg(webapp);
            } else {
                setTimeout(checkTg, 100);
            }
        };

        checkTg();
    }, []);

    return tg;
}
