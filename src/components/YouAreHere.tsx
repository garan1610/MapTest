import { useEffect, useState } from "react";
import { Hanoi } from "../lib/api";
import { Popup, useMap } from "@vis.gl/react-maplibre";
import { getLocation } from "../lib/api";

export default function YouAreHere() {
    const [popupLocation, setPopupLocation] = useState<[number, number]>(Hanoi);
    const { current: map } = useMap();

    useEffect(() => {
        if (!map) return;
        (async () => {
            const location = await getLocation();
            if (location !== Hanoi) {
                setPopupLocation(location);
                map.flyTo({ center: location, zoom: 8 });
            }
        })();
    }, [map]);

    if (!map) return null;

    return (
        <Popup
            longitude={popupLocation[0]}
            latitude={popupLocation[1]}
            focusAfterOpen={false}
            className="text-black">

            <h3 className="text-black">You are approximately here!</h3>
        </Popup>
    );
}