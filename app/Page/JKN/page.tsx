"use client";
import { useState, useEffect } from "react";
import { getJKNBedInformation } from "@/app/api/api";
import Display from "@/app/Page/Tabs/display_pageJKN";
import { JKN } from "@/app/api/interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  const [getData, setGetData] = useState<JKN[]>([]);
  const [room_vvip, setRoom_vvip] = useState<JKN[]>([]);
  const [room_vip, setRoom_vip] = useState<JKN[]>([]);
  const [room_class1, setRoom_class1] = useState<JKN[]>([]);
  const [room_class2, setRoom_class2] = useState<JKN[]>([]);
  const [room_class3, setRoom_class3] = useState<JKN[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("VVIP");
  const [tabSwitchProgress, setTabSwitchProgress] = useState(0);

  // Define tabs with their durations
  const tabs = [
    { value: "VVIP", label: "VVIP", duration: 6000 }, // 6 seconds
    { value: "VIP", label: "VIP", duration: 10000 }, // 10 seconds
    { value: "KELAS1", label: "KELAS1", duration: 25000 }, // 25 seconds
    { value: "KELAS2", label: "KELAS2", duration: 25000 }, // 25 seconds
    { value: "KELAS3", label: "KELAS3", duration: 10000 }, // 10 seconds
  ];

  const imageURL = {
    VVIP: "/images/Executive.jpg",
    VIP: "/images/Vip.jpg",
    KELAS1: "/images/Kelas1.jpg",
    KELAS2: "/images/Kelas2.jpg",
    KELAS3: "/images/Kelas3.jpg",
  };

  const defaultDuration = 5000;
  const fetchInterval = 76000; //total all time
  useEffect(() => {
    fetchData();

    // Set up periodic data fetching
    const intervalId = setInterval(fetchData, fetchInterval);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    set_dataVVIP();
    set_dataVIP();
    set_dataClass1();
    set_dataClass2();
    set_dataClass3();
  }, [getData]);

  // Auto-switch tabs
  useEffect(() => {
    const switchTabs = () => {
      const currentIndex = tabs.findIndex((tab) => tab.value === activeTab);
      const nextIndex = (currentIndex + 1) % tabs.length;
      setActiveTab(tabs[nextIndex].value);
    };

    const currentTabDuration =
      tabs.find((tab) => tab.value === activeTab)?.duration ?? defaultDuration;

    const timer = setTimeout(switchTabs, currentTabDuration);

    // Reset tab switch progress bar every time the tab switches
    setTabSwitchProgress(0);

    return () => clearTimeout(timer);
  }, [activeTab]);

  // Progress bar animation
  useEffect(() => {
    const currentTabDuration =
      tabs.find((tab) => tab.value === activeTab)?.duration ?? defaultDuration;

    const interval = setInterval(() => {
      setTabSwitchProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 100 / (currentTabDuration / 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const result2 = await getJKNBedInformation();
      if (result2?.length) {
        setGetData(result2);
      }
      console.log("Result2:", result2);
    } catch (error) {
      console.log("error");
    } finally {
      setLoading(false);
    }
  };

  const set_dataVVIP = () => {
    const result = getData.filter((data) => data.AplicaresClassCode === "VVP");
    setRoom_vvip(result);
  };

  const set_dataVIP = () => {
    const result = getData.filter((data) => data.AplicaresClassCode === "VIP");
    setRoom_vip(result);
  };

  const set_dataClass1 = () => {
    const result = getData.filter((data) => data.AplicaresClassCode === "KL1");
    setRoom_class1(result);
  };

  const set_dataClass2 = () => {
    const result = getData.filter((data) => data.AplicaresClassCode === "KL2");
    setRoom_class2(result);
  };

  const set_dataClass3 = () => {
    const result = getData.filter((data) => data.AplicaresClassCode === "KL3");
    setRoom_class3(result);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-100">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col gap-0"
      >
        <TabsList className="relative mb-0">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}

          {/* Progress bar */}
        </TabsList>

        <TabsContent value="VVIP">
          <Display data={room_vvip} imgUrl={imageURL.VVIP} />
        </TabsContent>
        <TabsContent value="VIP">
          <Display data={room_vip} imgUrl={imageURL.VIP} />
        </TabsContent>
        <TabsContent value="KELAS1">
          <Display data={room_class1} imgUrl={imageURL.KELAS1} />
        </TabsContent>
        <TabsContent value="KELAS2">
          <Display data={room_class2} imgUrl={imageURL.KELAS2} />
        </TabsContent>
        <TabsContent value="KELAS3">
          <Display data={room_class3} imgUrl={imageURL.KELAS3} />
        </TabsContent>
      </Tabs>
      <div
        className="absolute h-1 bg-blue-500 transition-all duration-100 ease-linear"
        style={{ width: `${tabSwitchProgress}%` }}
      />
    </div>
  );
}
