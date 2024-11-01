import React from 'react'
import Image from 'next/image'
import Logo from './Logo'
import { Package, ScanSearch, Speech } from "lucide-react";
import NavLinks from './NavLinks';

export default function Hero() {
  return (
    <div className="flex flex-col items-center gap-12 tracking-tight  lg:text-[24px] lg:leading-8">
      <div className="flex h-full w-full max-w-[500px] flex-col items-center lg:max-w-none">
        <h1 className="mb-6 whitespace-nowrap text-center text-[clamp(32px,11vw,64px)] font-bold leading-[0.9] tracking-[-0.035em] lg:text-[88px] lg:tracking-[-0.04em] xl:mb-10 xl:text-[120px] xl:leading-[104px]">
          Business Toolkit
          <br />
          for Open Source
        </h1>
        <p className="mb-6 max-w-[45ch] text-center text-[#8C8C88] xl:mb-8">
          One place to{" "}
          <span className="text-[#6e7d47]">
            <Package
              size={32}
              className="inline-block h-5 w-auto lg:h-7 self-center"
            />{" "}
            Sell
          </span>{" "}
          services,{" "}
          <span className="text-[#9b7f43]">
            <ScanSearch
              size={32}
              className="inline-block h-5 w-auto lg:h-7"
            />{" "}
            Find
          </span>{" "}
          customers and{" "}
          <span className="text-[#696b94]">
            <Speech
              size={32}
              className="inline-block h-5 w-auto lg:h-7"
            />{" "}
            Market
          </span>{" "}
          everywhere — purpose-built for Open Source.
        </p>
        <button className="flex w-fit items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-[#BBC4A2] px-8 py-3 text-[18px] font-bold lg:gap-4  lg:text-[20px] lg:leading-6 lg:tracking-[-0.02em]">
          <Image
            src="/github.svg"
            alt="github logo"
            height={24}
            width={24}
            className="h-[22px] w-auto lg:h-7"
          />
          Sign up with Github
        </button>
        {/* <NavLinks /> */}
        {/* <div className="flex gap-4">
          <p className="text-[#8C8C88]">Why we exist</p>
          <p className="text-[#8C8C88]">Changelog</p>
        </div> */}
      </div>
      {/* <div className="drop-shadow-sm lg:-mr-[100vw] xl:-mr-64"> */}
      <div className="drop-shadow-sm">
        <Image
          src="/home.png"
          alt="gitwallet logo"
          height={1600}
          width={2400}
          className="h-full w-full max-w-[1100px] lg:max-h-[540px] xl:max-h-none"
        />
      </div>
      {/* <div className="overflow-visible">
        <div className="relative mt-96 aspect-[3/2] w-[calc(100%+8rem)] overflow-visible lg:w-[calc(100%+8rem)] 2xl:w-full">
          <Image
            src="/home.png"
            alt="gitwallet logo"
            fill
            style={{
              objectFit: "contain",
              objectPosition: "left center",
            }}
          />
        </div>
      </div> */}
    </div>
  );
}
