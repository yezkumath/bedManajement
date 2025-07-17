"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
export const dynamic = "force-dynamic";
import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { RSSES } from "@/app/api/interface";

import Image from "next/image";

export default function Page({
  data,
  imgUrl,
}: {
  data: RSSES[];
  imgUrl: string;
}) {
  const groupedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const filteredData = data.filter((item) => item.IsAplicares !== false);

    const grouped = filteredData.reduce((acc, item) => {
      const serviceName = item.ServiceUnitName;

      if (acc[serviceName]) {
        // If service already exists, add to totals
        acc[serviceName].TotalBed += item.TotalBed;
        acc[serviceName].BedEmpty += item.BedEmpty;
      } else {
        // Create new entry for this service
        acc[serviceName] = {
          ServiceUnitName: serviceName,
          TotalBed: item.TotalBed,
          BedEmpty: item.BedEmpty,
        };
      }

      return acc;
    }, {} as Record<string, { ServiceUnitName: string; TotalBed: number; BedEmpty: number }>);

    // Convert object back to array
    return Object.values(grouped);
  }, [data]);

  let TotalBed = 0;
  let TotalAvalible = 0;
  let TotalBedEmpty = 0;

  if (groupedData && groupedData.length > 0) {
    groupedData.forEach((item) => {
      TotalBed += item.TotalBed;
      TotalBedEmpty += item.BedEmpty;
    });
    TotalAvalible = TotalBed - TotalBedEmpty;
  }

  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    if (data.length <= 5) return; // No auto-scroll if 5 or fewer items

    const totalWidth = sectionRef.current?.scrollWidth || 0;
    const viewportWidth = triggerRef.current?.clientWidth || 0;

    // Calculate the total scrollable distance
    const scrollDistance = totalWidth - viewportWidth;

    const startAnimation = () => {
      // Kill any existing timeline
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Create new timeline
      timelineRef.current = gsap.timeline({
        repeat: -1, // Repeat infinitely
        onRepeat: () => {
          // Reset position instantly when repeating
          gsap.set(sectionRef.current, { x: 0 });
        },
      });

      // Add the scrolling animation to timeline
      timelineRef.current
        .to(sectionRef.current, {
          x: -scrollDistance,
          duration: scrollDistance / 20, // Adjust speed by changing the divisor
          ease: "none",
        })
        .to({}, { duration: 4 }); // 2-second pause
    };

    // Start animation after 2 seconds
    const animationTimeout = setTimeout(() => {
      startAnimation();
    }, 4000);

    // Cleanup function
    return () => {
      clearTimeout(animationTimeout);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [data.length]);

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-3 lg:p-3">
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-3 max-w-full">
        {/* LEFT SIDEBAR */}
        <div className="flex flex-row lg:flex-col space-x-4 lg:space-x-0 lg:space-y-4 w-full lg:w-52 xl:w-52 overflow-x-auto lg:overflow-x-visible">
          {/* Total Kapasitas */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg h-40 sm:h-48 lg:h-52 min-w-[160px] sm:min-w-[180px] lg:min-w-0 flex-shrink-0">
            <div className="flex items-center justify-center bg-blue-500 h-14 sm:h-16 lg:h-20 rounded-2xl lg:rounded-3xl text-white text-center px-2">
              <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold">
                TOTAL KAPASITAS
              </h3>
            </div>
            <div className="flex items-center justify-center my-2 flex-1">
              <span className="text-4xl sm:text-5xl lg:text-6xl xl:text-8xl font-bold text-blue-500">
                {TotalBed}
              </span>
            </div>
          </div>

          {/* Terisi */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg h-40 sm:h-48 lg:h-52 min-w-[160px] sm:min-w-[180px] lg:min-w-0 flex-shrink-0">
            <div className="flex items-center justify-center bg-orange-500 h-14 sm:h-16 lg:h-20 rounded-2xl lg:rounded-3xl text-white text-center px-2">
              <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold">
                TERISI
              </h3>
            </div>
            <div className="flex items-center justify-center my-2 flex-1">
              <span className="text-4xl sm:text-5xl lg:text-6xl xl:text-8xl font-bold text-orange-500">
                {TotalAvalible}
              </span>
            </div>
          </div>

          {/* Kosong */}
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg h-40 sm:h-48 lg:h-52 min-w-[160px] sm:min-w-[180px] lg:min-w-0 flex-shrink-0">
            <div className="flex items-center justify-center bg-green-500 h-14 sm:h-16 lg:h-20 rounded-2xl lg:rounded-3xl text-white text-center px-2">
              <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold">
                KOSONG
              </h3>
            </div>
            <div className="flex items-center justify-center my-2 flex-1">
              <span className="text-4xl sm:text-5xl lg:text-6xl xl:text-8xl font-bold text-green-500">
                {TotalBedEmpty}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 space-y-4 lg:space-y-6 min-w-0">
          {/* VIP Room Card */}
          <div className="bg-blue-800 rounded-xl lg:rounded-2xl p-2 shadow-lg">
            <div className="flex items-center justify-center">
              <Image
                src={imgUrl}
                alt="VIP Room"
                width={800}
                height={300}
                className="rounded-lg lg:rounded-xl w-[75%] h-auto object-cover"
              />
            </div>
          </div>

          {/* Department Cards */}
          <ScrollArea className="w-full rounded-md" ref={triggerRef}>
            <div
              className="flex flex-row space-x-3 lg:space-x-4 mb-3 px-1 whitespace-nowrap"
              ref={sectionRef}
            >
              {groupedData.map((room, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden text-center w-32 sm:w-36 lg:w-40 flex-shrink-0"
                >
                  <div className="p-0.5 whitespace-nowrap">
                    <div className="text-blue-500 text-lg sm:text-xl lg:text-2xl font-bold">
                      KOSONG
                    </div>
                    <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-blue-500 my-0.5">
                      {room.BedEmpty === 0 ? (
                        <span className="text-red-500">
                          {" "}
                          {room.BedEmpty?.toString()}
                        </span>
                      ) : (
                        room.BedEmpty?.toString()
                      )}
                    </div>
                    <div className="text-xs sm:text-sm lg:text-sm mt-2 lg:mt-4 px-1">
                      DARI TOTAL{" "}
                      <span className="font-bold text-blue-500">
                        {room.TotalBed?.toString()} KAMAR
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-500 text-white font-bold py-1.5 sm:py-2 text-sm sm:text-base lg:text-base h-12 flex items-center justify-center text-center px-2 whitespace-normal break-words leading-tight">
                    {room.ServiceUnitName}
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
