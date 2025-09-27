// src/calc/pricelist.ts
import raw from "../data/paint-pricelist.json";
import type { Pricelist } from "./types";

const pricelist: Pricelist = raw as Pricelist;

export default pricelist;

