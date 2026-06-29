import Energy from "./Energy"
import AdditionalButton from "./AdditionalButton"
import upgrades from "../../assets/upgrades.svg"
import locations from "../../assets/locations.svg"

export default function OverNavbar() {
    return (
        <div className="w-full p-5 pt-0 flex flex-col">
            <Energy />
            <div className="flex gap-3 h-full p-2 mt-7">
                <AdditionalButton img={upgrades} text="UPGRADES"/>
                <AdditionalButton img={locations} text="LOCATIONS"/>
            </div>
        </div>
    )
}