"use server";
import dns from "node:dns";
import { dnsRecordTypes } from "../constant";

export async function dnsLookup<T>(
  hostname: string,
  type: (typeof dnsRecordTypes)[number],
): Promise<T> {
  const data = await new Promise<T>((resolve, reject) => {
    dns.resolve(hostname, type, (err, addresses) => {
      if (err) reject(err);
      else resolve(addresses as T);
    });
  });
  return data;
}
