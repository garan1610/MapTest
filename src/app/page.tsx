'use client';
import * as React from 'react';
import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Map, NavigationControl, Marker } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css'; // See notes below
import { Hanoi } from '@/lib/api';
import YouAreHere from '@/components/YouAreHere';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Popup, useMap } from "@vis.gl/react-maplibre";
import maplibregl from 'maplibre-gl';
import { text } from 'stream/consumers';

export default function Home() {
  const [location, setLocation] = useState<[number, number]>(Hanoi); // Long and Lat
  const [address, setAddress] = useState<string>("");

  const handleGetAddress = async () => {
    setAddress("Fetching address...");
    const addr = await fetchAddress(location[0], location[1]);
    setAddress(addr);
    togglePopup();
  }

  const fetchAddress = async (lng: number, lat: number) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.display_name || "Address not found";
  };

  // Create a ref for the marker to access it later
  const markerRef = useRef<maplibregl.Marker>(null);

  const popup = useMemo(() => {
    const popup = new maplibregl.Popup().setOffset(50);
    return popup
  }, [])

  const togglePopup = useCallback(() => {
    markerRef.current?.togglePopup();
  }, []);

  useEffect(() => {
    if (markerRef.current && markerRef.current._popup.isOpen()) {
      markerRef.current._popup.setText(address)._update();
    }
  }, [address]);



  return (
    <div className='relative h-screen w-screen'>

      <Map
        initialViewState={{
          longitude: Hanoi[0],
          latitude: Hanoi[1],
          zoom: 7,
        }}
        dragRotate={true}
        style={{ width: "100%", height: "100vh", position: 'absolute' }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
      >
        <YouAreHere />
        <NavigationControl position="top-right" />
        <div>
          <Marker
            longitude={location[0]}
            latitude={location[1]}
            anchor="bottom" color="red"
            draggable={true}
            onDragEnd={e => setLocation([e.lngLat.lng, e.lngLat.lat])}
            onDragStart={() => {
              setAddress("");
              if (popup.isOpen()) {
                togglePopup()
              }
            }}
            popup={popup}
            ref={markerRef} />
        </div>
      </Map>

      <div className='absolute top-0 left-0 p-4 z-10'>
        <Card className='w-75'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>Vị trí hiện tại</CardTitle>
            <CardDescription className='flex items-center gap-2'>
              <span>Kéo ghim để thay đổi vị trí của bạn</span>
            </CardDescription>
          </CardHeader>

          <CardContent className='flex flex-col gap-2'>
            <p>Kinh độ: {location[0].toFixed(5)}</p>
            <p>Vĩ độ: {location[1].toFixed(5)}</p>
            <p>Địa chỉ: {address}</p>
            <Button onClick={() => {
              handleGetAddress();
            }}
              variant={'outline'}>Lấy địa chỉ</Button>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
