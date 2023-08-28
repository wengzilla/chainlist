import { useEffect, useRef, useState } from "react";

import { Native, NativeMediaContent, NativeLink } from "hypelab-react";
import { HYPELAB_NATIVE_PLACEMENT_SLUG } from "../../constants/hypelab";

export const AdBanner = () => {
  return (
    <Native placement={HYPELAB_NATIVE_PLACEMENT_SLUG}>
      {function (ad) {
        if (ad.icon !== "") {
          return <NativeWrapper ad={ad} />;
        }
      }}
    </Native>
  );
};

const NativeWrapper = ({ ad }) => {
  const imageRef = useRef(null);
  const [isSquare, setIsSquare] = useState(false);
  const [hideNativeTextContent, setHideNativeTextContent] = useState(true);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setIsSquare(entry.contentRect.width == entry.contentRect.height);
          setHideNativeTextContent(entry.contentRect.height > 220);
        }
      }
    });

    const container = imageRef.current;

    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, [imageRef]);

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <div
        className={`flex flex-col w-fit max-w-full bg-white dark:bg-[#0D0D0D] rounded-[10px] shadow overflow-hidden ${
          isSquare ? "max-w-[260px] lg:max-w-[290px]" : ""
        }`}
      >
        <div className="flex">
          <NativeLink>
            <div id="mediaContent" ref={imageRef}>
              <NativeMediaContent />
            </div>
          </NativeLink>
        </div>
        {isSquare || hideNativeTextContent ? "" : <NativeTextContent ad={ad} />}
      </div>
    </div>
  );
};

const NativeTextContent = ({ ad }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    const container = containerRef.current;

    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, [containerRef]);

  return (
    <div className="flex items-center justify-center px-3 py-3 w-full h-full" id="ctaContainer" ref={containerRef}>
      <AdvertiserIcon ad={ad} small={width < 300} />
      <div className="grow flex items-center justify-between overflow-hidden">
        <div class="grow truncate">
          <AdvertiserName ad={ad} small={width < 300} />
        </div>
        <div class="flex-none ml-4">
          <AdvertiserCta ad={ad} small={width < 300} />
        </div>
      </div>
    </div>
  );
};

const AdvertiserIcon = ({ ad, small = false }) => {
  return (
    <div class="flex-none mr-2">
      <NativeLink>
        <img className={`${small ? "w-8" : "w-10"} rounded-full`} alt={ad.icon} src={ad.icon} />
      </NativeLink>
    </div>
  );
};

const AdvertiserName = ({ ad, small = false }) => {
  return (
    <div
      className={`${
        small ? "text-sm" : ""
      } font-semibold overflow-hidden text-ellipsis relative top-[1px] dark:text-[#B3B3B3]`}
    >
      <NativeLink>{ad.advertiser}</NativeLink>
    </div>
  );
};

const AdvertiserCta = ({ ad, small = false }) => {
  return (
    <div className="flex-none">
      <NativeLink>
        <div
          data-cy="ctaText"
          className={`${
            small ? "text-sm px-2 py-1" : "px-4 py-2"
          } border dark:border-[#171717] border-[#EAEAEA] text-center rounded-[50px] dark:text-[#2F80ED] text-[#2F80ED] dark:hover:text-black hover:text-white dark:hover:bg-[#2F80ED] hover:bg-[#2F80ED] truncate`}
        >
          {ad.ctaText}
        </div>
      </NativeLink>
    </div>
  );
};
