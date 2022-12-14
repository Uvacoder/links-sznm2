/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { PRIMARY_HOST_NAME } from "lib/constants/env";

export const middleware = async (req: NextRequest, event: NextFetchEvent) => {
  const slug = req.nextUrl.pathname.split("/")[1];

  if (!slug) {
    return NextResponse.redirect(PRIMARY_HOST_NAME);
  }

  const entry = await fetch(
    `${req.nextUrl.origin}/api/notion/shortener/get-url?slug=${slug}`
  ).then((res) => res.json());

  if (entry.url) {
    event.waitUntil(
      fetch(`${req.nextUrl.origin}/api/notion/shortener/add-click`, {
        method: "POST",
        body: JSON.stringify({ slug }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
    return NextResponse.redirect(entry.url);
  }
};
