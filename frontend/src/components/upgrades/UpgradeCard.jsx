import { CircleDollarSign } from 'lucide-react'
import * as Icons from 'lucide-react';
import colors from '../../utility/colors'
import { formatNum } from '../../utility/formatNum'
import { buyUpgrade, getUserIncome } from '../../api/requests'
import { styledToast } from '../styledToast';

const getColor = (count) => {
    if (count < 10) {
        return ["#22262f", colors.textGray]
    } else if (10 <= count < 50) {
        return [colors.textPurple, "#3d0b97"]
    } else if (count >= 50) {
        return ["#006875", "#cce9ee"]
    }
}

export default function UpgradeCard({ user, setUser, upgrade, user_upgrade }) {
    let upgrade_bonus = user_upgrade?.bonus
    if (upgrade?.type === "passive") {
        upgrade_bonus *= 3600
    }

    async function onclick() {
        const data = await buyUpgrade(user?.tg_id, upgrade?.id)
        if (!data) {
            styledToast("error", "Not enough coins.")
        }

        const income = await getUserIncome(user?.tg_id)

        if (data && income) {
            setUser((prev) => ({ 
                ...prev, coins: data.coins, 
                click_income: income.click_income,
                passive_income: income.passive_income,
                upgrades: prev.upgrades.map((u) => {
                    if (u.id == upgrade.id) {
                        return { ...u, count: data.upgrade_count, cost: data.cost, bonus: data.bonus }
                    }
                    return u
                })
            }))
        }
    }

    const Icon = Icons[upgrade?.icon_name]
    
    if (user?.lvl < upgrade?.unlock_lvl) {
        return (
        <div className={`w-full aspect-square rounded-4xl border-2 shadow-2xl flex flex-col p-4 font-jakarta h-full opacity-30`} style={{ borderColor: "#22262f" }}> 
            <div className="w-full flex justify-between">
                <Icon color={colors.textGray} size={50} className='p-2 rounded-full' style={{ background: "#161a21"}}/>
                <span className='text-xs font-light p-2 pl-3 pr-3 h-fit rounded-2xl' style={{ background: "#22262f", color: colors.textGray }}>LOCKED</span>
            </div>
            <span className='text-lg font-semibol mt-1 text-left' style={{ color: colors.textGray }}>{upgrade?.name}</span>
            <span className='text-left'>
                <span className='text-sm font-medium' style={{ color: colors.textGray }}>Profit: </span>
                <span className='text-sm font-bold pl-2' style={{ color: colors.textGray }}>???</span>
            </span>
            <div className='mt-3 h-0.5' style={{ background: "#1a1b29" }} />
            <span className='mt-3 flex items-center justify-center'>
                <span className='text-sm font-medium' style={{ color: colors.textGray }}>UNLOCK AT LVL {upgrade?.unlock_lvl}</span>
            </span>
        </div>
        )
    }

    return (
        <button onClick={onclick} className={`w-full aspect-square rounded-4xl border-2 shadow-2xl flex flex-col p-4 font-jakarta active:opacity-30 transition-all ease-in-out duration-150 ${!user_upgrade?.count && "opacity-60"}`} style={{ borderColor: "#017e8c", background: "radial-gradient(circle,rgba(17, 25, 43, 1) 0%, rgba(11, 14, 20, 1) 100%)" }}> 
            <div className="w-full flex justify-between">
                <Icon color={colors.primaryBlue} size={50} className='p-2 rounded-full' style={{ background: "#161a21"}}/>
                <span className='text-xs font-bold p-2 pl-3 pr-3 h-fit rounded-2xl' style={{ background: getColor(user_upgrade?.count)[0], color: getColor(user_upgrade?.count)[1] }}>LVL {user_upgrade?.count}</span>
            </div>
            <span className='text-lg font-semibold text-white mt-1 text-left'>{upgrade?.name}</span>
            <span className='text-left'>
                <span className='text-sm font-medium' style={{ color: colors.textGray }}>Profit: </span>
                <span className='text-xs font-bold pl-2' style={{ color: colors.primaryYellow }}>+{formatNum(upgrade_bonus, true)}/{upgrade?.type === "click" ? "click" : "hr"}</span>
            </span>
            <div className='mt-3 h-0.5' style={{ background: "#1a1b29" }} />
            <span className='mt-3 flex items-center'>
                <CircleDollarSign color={colors.primaryYellow}/>
                <span className='ml-2 text-lg font-bold text-white'>{formatNum(user_upgrade?.cost, true)}</span>
            </span>
        </button>
    )
}