import * as Fathom from "fathom-client";
import { useEffect, useRef, useState } from "react";

import { FATHOM_ADS_ID } from "../../hooks/useAnalytics";
import { Native, NativeMediaContent, NativeLink } from "hypelab-react";

export const AdBanner = () => {
  const trackGoal = (ad) => {
    Fathom.trackGoal(FATHOM_ADS_ID[ad.advertiser.toLowerCase()], 0);
  };

  return (
    <Native placement="134be8540e" className="h-full">
      {function (ad) {
        if (ad.icon !== "") {
          return (
            <div
              className="flex flex-col h-full shadow dark:bg-[#0D0D0D] bg-white rounded-[10px] flex flex-col overflow-hidden h-full"
              onClick={() => trackGoal(ad)}
            >
              <div className="flex">
                <NativeLink>
                  <div data-cy="mediaContent" className="mediaContent">
                    <NativeMediaContent />
                  </div>
                </NativeLink>
              </div>
              <NativeTextContent ad={ad} />
            </div>
          );
        }
      }}
    </Native>
  );
};

const NativeTextContent = ({ ad }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth(); // Initial width
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mx-3 my-3 h-full" id="ctaContainer" ref={containerRef}>
      <div className="flex flex-col items-center justify-center w-full gap-2">
        {width < 370 ? (
          <>
            <AdvertiserInfo ad={ad} />
            <CtaButton ad={ad} />
          </>
        ) : (
          <div className="flex justify-between w-full">
            <AdvertiserInfo ad={ad} />
            <CtaButton ad={ad} />
          </div>
        )}
      </div>
    </div>
  );
};

const AdvertiserInfo = ({ ad }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full flex-shrink-0 flex relative">
        <NativeLink>
          <img src={ad.icon} className="w-10" alt={ad.icon} />
        </NativeLink>
      </div>
      <span className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis relative top-[1px] dark:text-[#B3B3B3]">
        <NativeLink>{ad.advertiser}</NativeLink>
      </span>
    </div>
  );
};

const CtaButton = ({ ad }) => {
  return (
    <NativeLink>
      <div
        data-cy="ctaText"
        className="border dark:border-[#171717] border-[#EAEAEA] text-center px-4 py-2 rounded-[50px] dark:text-[#2F80ED] text-[#2F80ED] dark:hover:text-black hover:text-white dark:hover:bg-[#2F80ED] hover:bg-[#2F80ED] truncate"
      >
        {ad.ctaText}
      </div>
    </NativeLink>
  );
};
