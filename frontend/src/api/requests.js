export const getData = async (url) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/${url}`);
    
    if (!response.ok) {
        throw new Error("Server error");
    }

    const data = await response.json();
    return data;
}


export const getUserIncome = async (tg_id) => {
    try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/users/${tg_id}/income`);
        
        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error with requst:", error);
    }
}


export const processClick = async (tg_id, click_amount) => {
    try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/users/${tg_id}/process_click`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tg_id: tg_id, clicks: click_amount }),
        });
        
        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error with requst:", error);
    }
    
}

export const buyUpgrade = async (tg_id, upgrade_id) => {
    try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/users/${tg_id}/buy_upgrade/${upgrade_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tg_id: tg_id, upgrade_id: upgrade_id }),
        });
        
        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error with requst:", error);
    }
    
}

export const buyLocation = async (tg_id, location_id) => {
    try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/users/${tg_id}/buy_location/${location_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tg_id: tg_id, location_id : location_id }),
        });
        
        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error with requst:", error);
    }
    
}

export const setLocation = async (tg_id, location_id) => {
    try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/users/${tg_id}/set_location/${location_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tg_id: tg_id, location_id : location_id }),
        });
        
        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error with requst:", error);
    }
    
}

export const claimPendingRefBonus = async (referrer_tg_id, referred_tg_id) => {
    try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/referrals/get-ref-bonus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ referrer_tg_id: referrer_tg_id, referred_tg_id : referred_tg_id }),
        });
        
        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error with requst:", error);
    }
    
}

export const getLeadmagnetBonus = async (tg_id, leadmagnet_id) => {
    try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/leadmagnets/get-bonus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tg_id: tg_id, leadmagnet_id: leadmagnet_id }),
        });
        
        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error with requst:", error);
    }
    
}

export const spinSlots = async (tg_id, stake) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/minigames/slots/spin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ tg_id: tg_id, stake: stake }),
    });
    
    if (!response.ok) {
        throw new Error("Server error");
    }

    const data = await response.json();
    return data
}