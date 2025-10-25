import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Preload } from "@react-three/drei";

/* -------------------- CONFIG -------------------- */
const MODEL_PATH =
  "https://models.readyplayer.me/68e4a7761df78dfe0f87b10d.glb?morphTargets=Oculus%20Visemes";
const AUDIO_PATH = "/1-introduction-of-limits_7WTsRIBS.mp3";
const HEADROOM_DESKTOP = 0.12;
const HEADROOM_MOBILE = 0.16;

useGLTF.preload(MODEL_PATH);

/* -------------------- VISEMES / ALIASES -------------------- */
const VISEME_ALIASES = {
  oh: ["oh", "o", "OH", "O"],
  ou: ["ou", "u", "OU", "U", "oo", "OO"],
  aa: ["aa", "a", "AA", "A"],
  E: ["E", "e", "ih", "IH", "I"],
  DD: ["DD"], SS: ["SS"], FF: ["FF"], PP: ["PP"],
  sil: ["sil", "SIL"]
};
const CANONICALS_USED = ["E", "DD", "SS", "FF", "aa", "oh", "ou", "PP"];

/* -------------------- TIMELINE (unchanged) -------------------- */
const visemeData = [
  {
    "time": 0,
    "viseme": "sil"
  },
  {
    "time": 0.61,
    "viseme": "E"
  },
  {
    "time": 1.02,
    "viseme": "DD"
  },
  {
    "time": 1.09,
    "viseme": "E"
  },
  {
    "time": 1.3,
    "viseme": "SS"
  },
  {
    "time": 1.44,
    "viseme": "FF"
  },
  {
    "time": 1.62,
    "viseme": "SS"
  },
  {
    "time": 1.83,
    "viseme": "FF"
  },
  {
    "time": 1.9,
    "viseme": "E"
  },
  {
    "time": 2.04,
    "viseme": "ou"
  },
  {
    "time": 2.32,
    "viseme": "E"
  },
  {
    "time": 2.39,
    "viseme": "DD"
  },
  {
    "time": 2.46,
    "viseme": "E"
  },
  {
    "time": 2.53,
    "viseme": "FF"
  },
  {
    "time": 2.67,
    "viseme": "E"
  },
  {
    "time": 2.74,
    "viseme": "ou"
  },
  {
    "time": 2.81,
    "viseme": "oh"
  },
  {
    "time": 3.09,
    "viseme": "ou"
  },
  {
    "time": 3.16,
    "viseme": "E"
  },
  {
    "time": 3.23,
    "viseme": "aa"
  },
  {
    "time": 3.35,
    "viseme": "ou"
  },
  {
    "time": 3.46,
    "viseme": "DD"
  },
  {
    "time": 3.53,
    "viseme": "E"
  },
  {
    "time": 3.67,
    "viseme": "aa"
  },
  {
    "time": 3.75,
    "viseme": "E"
  },
  {
    "time": 4.02,
    "viseme": "sil"
  },
  {
    "time": 5.76,
    "viseme": "E"
  },
  {
    "time": 5.84,
    "viseme": "aa"
  },
  {
    "time": 5.91,
    "viseme": "ou"
  },
  {
    "time": 6.1,
    "viseme": "E"
  },
  {
    "time": 6.31,
    "viseme": "ou"
  },
  {
    "time": 6.52,
    "viseme": "DD"
  },
  {
    "time": 6.59,
    "viseme": "ou"
  },
  {
    "time": 6.66,
    "viseme": "E"
  },
  {
    "time": 6.87,
    "viseme": "ou"
  },
  {
    "time": 7.01,
    "viseme": "DD"
  },
  {
    "time": 7.15,
    "viseme": "E"
  },
  {
    "time": 7.22,
    "viseme": "aa"
  },
  {
    "time": 7.3,
    "viseme": "E"
  },
  {
    "time": 7.88,
    "viseme": "aa"
  },
  {
    "time": 7.96,
    "viseme": "SS"
  },
  {
    "time": 8.22,
    "viseme": "E"
  },
  {
    "time": 8.57,
    "viseme": "ou"
  },
  {
    "time": 8.64,
    "viseme": "E"
  },
  {
    "time": 8.78,
    "viseme": "DD"
  },
  {
    "time": 8.85,
    "viseme": "E"
  },
  {
    "time": 8.99,
    "viseme": "ou"
  },
  {
    "time": 9.06,
    "viseme": "E"
  },
  {
    "time": 9.48,
    "viseme": "sil"
  },
  {
    "time": 10.18,
    "viseme": "FF"
  },
  {
    "time": 10.24,
    "viseme": "E"
  },
  {
    "time": 10.57,
    "viseme": "aa"
  },
  {
    "time": 10.67,
    "viseme": "E"
  },
  {
    "time": 10.89,
    "viseme": "sil"
  },
  {
    "time": 11.47,
    "viseme": "aa"
  },
  {
    "time": 11.59,
    "viseme": "ou"
  },
  {
    "time": 11.65,
    "viseme": "E"
  },
  {
    "time": 12.26,
    "viseme": "aa"
  },
  {
    "time": 12.34,
    "viseme": "E"
  },
  {
    "time": 12.49,
    "viseme": "SS"
  },
  {
    "time": 12.7,
    "viseme": "PP"
  },
  {
    "time": 12.77,
    "viseme": "aa"
  },
  {
    "time": 12.85,
    "viseme": "ou"
  },
  {
    "time": 12.99,
    "viseme": "E"
  },
  {
    "time": 13.2,
    "viseme": "ou"
  },
  {
    "time": 13.48,
    "viseme": "E"
  },
  {
    "time": 13.76,
    "viseme": "SS"
  },
  {
    "time": 14.04,
    "viseme": "FF"
  },
  {
    "time": 14.25,
    "viseme": "ou"
  },
  {
    "time": 14.39,
    "viseme": "DD"
  },
  {
    "time": 14.46,
    "viseme": "ou"
  },
  {
    "time": 14.6,
    "viseme": "FF"
  },
  {
    "time": 14.88,
    "viseme": "E"
  },
  {
    "time": 14.95,
    "viseme": "ou"
  },
  {
    "time": 15.02,
    "viseme": "E"
  },
  {
    "time": 15.09,
    "viseme": "ou"
  },
  {
    "time": 15.23,
    "viseme": "E"
  },
  {
    "time": 15.37,
    "viseme": "PP"
  },
  {
    "time": 15.44,
    "viseme": "ou"
  },
  {
    "time": 15.58,
    "viseme": "E"
  },
  {
    "time": 16,
    "viseme": "sil"
  },
  {
    "time": 16.68,
    "viseme": "E"
  },
  {
    "time": 16.81,
    "viseme": "PP"
  },
  {
    "time": 16.88,
    "viseme": "ou"
  },
  {
    "time": 16.95,
    "viseme": "aa"
  },
  {
    "time": 17.03,
    "viseme": "E"
  },
  {
    "time": 17.45,
    "viseme": "SS"
  },
  {
    "time": 17.66,
    "viseme": "FF"
  },
  {
    "time": 17.73,
    "viseme": "E"
  },
  {
    "time": 17.87,
    "viseme": "SS"
  },
  {
    "time": 17.94,
    "viseme": "E"
  },
  {
    "time": 18.01,
    "viseme": "SS"
  },
  {
    "time": 18.22,
    "viseme": "FF"
  },
  {
    "time": 18.29,
    "viseme": "E"
  },
  {
    "time": 18.36,
    "viseme": "SS"
  },
  {
    "time": 18.43,
    "viseme": "FF"
  },
  {
    "time": 18.5,
    "viseme": "E"
  },
  {
    "time": 18.57,
    "viseme": "ou"
  },
  {
    "time": 18.64,
    "viseme": "E"
  },
  {
    "time": 18.71,
    "viseme": "ou"
  },
  {
    "time": 18.78,
    "viseme": "DD"
  },
  {
    "time": 18.85,
    "viseme": "SS"
  },
  {
    "time": 18.92,
    "viseme": "ou"
  },
  {
    "time": 18.99,
    "viseme": "FF"
  },
  {
    "time": 19.13,
    "viseme": "E"
  },
  {
    "time": 19.2,
    "viseme": "ou"
  },
  {
    "time": 19.34,
    "viseme": "E"
  },
  {
    "time": 19.76,
    "viseme": "sil"
  },
  {
    "time": 22.75,
    "viseme": "E"
  },
  {
    "time": 23.06,
    "viseme": "ou"
  },
  {
    "time": 23.27,
    "viseme": "E"
  },
  {
    "time": 23.69,
    "viseme": "ou"
  },
  {
    "time": 23.76,
    "viseme": "aa"
  },
  {
    "time": 23.84,
    "viseme": "E"
  },
  {
    "time": 24.04,
    "viseme": "ou"
  },
  {
    "time": 24.25,
    "viseme": "SS"
  },
  {
    "time": 24.32,
    "viseme": "E"
  },
  {
    "time": 24.74,
    "viseme": "SS"
  },
  {
    "time": 24.95,
    "viseme": "FF"
  },
  {
    "time": 25.02,
    "viseme": "E"
  },
  {
    "time": 25.16,
    "viseme": "FF"
  },
  {
    "time": 25.86,
    "viseme": "SS"
  },
  {
    "time": 25.93,
    "viseme": "E"
  },
  {
    "time": 26.14,
    "viseme": "ou"
  },
  {
    "time": 26.28,
    "viseme": "E"
  },
  {
    "time": 26.42,
    "viseme": "ou"
  },
  {
    "time": 26.63,
    "viseme": "E"
  },
  {
    "time": 26.77,
    "viseme": "ou"
  },
  {
    "time": 26.91,
    "viseme": "E"
  },
  {
    "time": 27.05,
    "viseme": "sil"
  },
  {
    "time": 27.62,
    "viseme": "ou"
  },
  {
    "time": 27.69,
    "viseme": "FF"
  },
  {
    "time": 28.04,
    "viseme": "oh"
  },
  {
    "time": 28.11,
    "viseme": "aa"
  },
  {
    "time": 28.23,
    "viseme": "E"
  },
  {
    "time": 28.47,
    "viseme": "DD"
  },
  {
    "time": 28.54,
    "viseme": "SS"
  },
  {
    "time": 28.61,
    "viseme": "aa"
  },
  {
    "time": 28.69,
    "viseme": "SS"
  },
  {
    "time": 28.91,
    "viseme": "E"
  },
  {
    "time": 29.05,
    "viseme": "ou"
  },
  {
    "time": 29.33,
    "viseme": "E"
  },
  {
    "time": 29.68,
    "viseme": "FF"
  },
  {
    "time": 29.75,
    "viseme": "aa"
  },
  {
    "time": 29.83,
    "viseme": "E"
  },
  {
    "time": 29.9,
    "viseme": "FF"
  },
  {
    "time": 30.25,
    "viseme": "E"
  },
  {
    "time": 30.32,
    "viseme": "ou"
  },
  {
    "time": 30.39,
    "viseme": "PP"
  },
  {
    "time": 30.53,
    "viseme": "ou"
  },
  {
    "time": 30.67,
    "viseme": "aa"
  },
  {
    "time": 30.75,
    "viseme": "SS"
  },
  {
    "time": 31,
    "viseme": "E"
  },
  {
    "time": 31.14,
    "viseme": "ou"
  },
  {
    "time": 31.21,
    "viseme": "E"
  },
  {
    "time": 31.35,
    "viseme": "ou"
  },
  {
    "time": 31.42,
    "viseme": "E"
  },
  {
    "time": 31.63,
    "viseme": "aa"
  },
  {
    "time": 31.78,
    "viseme": "SS"
  },
  {
    "time": 31.94,
    "viseme": "FF"
  },
  {
    "time": 32.15,
    "viseme": "sil"
  },
  {
    "time": 33.38,
    "viseme": "E"
  },
  {
    "time": 33.47,
    "viseme": "DD"
  },
  {
    "time": 33.54,
    "viseme": "FF"
  },
  {
    "time": 33.96,
    "viseme": "E"
  },
  {
    "time": 34.03,
    "viseme": "ou"
  },
  {
    "time": 34.1,
    "viseme": "PP"
  },
  {
    "time": 34.17,
    "viseme": "ou"
  },
  {
    "time": 34.24,
    "viseme": "E"
  },
  {
    "time": 34.31,
    "viseme": "ou"
  },
  {
    "time": 34.38,
    "viseme": "DD"
  },
  {
    "time": 34.45,
    "viseme": "FF"
  },
  {
    "time": 34.87,
    "viseme": "sil"
  },
  {
    "time": 35.17,
    "viseme": "E"
  },
  {
    "time": 35.24,
    "viseme": "SS"
  },
  {
    "time": 35.45,
    "viseme": "FF"
  },
  {
    "time": 35.52,
    "viseme": "E"
  },
  {
    "time": 35.59,
    "viseme": "ou"
  },
  {
    "time": 35.66,
    "viseme": "E"
  },
  {
    "time": 35.73,
    "viseme": "DD"
  },
  {
    "time": 35.87,
    "viseme": "ou"
  },
  {
    "time": 35.94,
    "viseme": "FF"
  },
  {
    "time": 36.22,
    "viseme": "E"
  },
  {
    "time": 36.29,
    "viseme": "FF"
  },
  {
    "time": 36.5,
    "viseme": "ou"
  },
  {
    "time": 36.64,
    "viseme": "sil"
  },
  {
    "time": 37.15,
    "viseme": "E"
  },
  {
    "time": 37.26,
    "viseme": "ou"
  },
  {
    "time": 37.33,
    "viseme": "FF"
  },
  {
    "time": 37.61,
    "viseme": "SS"
  },
  {
    "time": 37.82,
    "viseme": "FF"
  },
  {
    "time": 37.89,
    "viseme": "E"
  },
  {
    "time": 37.96,
    "viseme": "ou"
  },
  {
    "time": 38.03,
    "viseme": "FF"
  },
  {
    "time": 38.66,
    "viseme": "sil"
  },
  {
    "time": 38.85,
    "viseme": "E"
  },
  {
    "time": 38.96,
    "viseme": "FF"
  },
  {
    "time": 39.1,
    "viseme": "ou"
  },
  {
    "time": 39.17,
    "viseme": "aa"
  },
  {
    "time": 39.25,
    "viseme": "SS"
  },
  {
    "time": 39.41,
    "viseme": "E"
  },
  {
    "time": 39.55,
    "viseme": "DD"
  },
  {
    "time": 39.62,
    "viseme": "oh"
  },
  {
    "time": 39.76,
    "viseme": "E"
  },
  {
    "time": 39.83,
    "viseme": "DD"
  },
  {
    "time": 39.97,
    "viseme": "sil"
  },
  {
    "time": 40.75,
    "viseme": "E"
  },
  {
    "time": 41.21,
    "viseme": "DD"
  },
  {
    "time": 41.28,
    "viseme": "SS"
  },
  {
    "time": 41.56,
    "viseme": "E"
  },
  {
    "time": 42.05,
    "viseme": "FF"
  },
  {
    "time": 42.33,
    "viseme": "E"
  },
  {
    "time": 42.57,
    "viseme": "FF"
  },
  {
    "time": 42.64,
    "viseme": "ou"
  },
  {
    "time": 42.71,
    "viseme": "DD"
  },
  {
    "time": 42.85,
    "viseme": "ou"
  },
  {
    "time": 42.92,
    "viseme": "FF"
  },
  {
    "time": 43.13,
    "viseme": "E"
  },
  {
    "time": 43.2,
    "viseme": "PP"
  },
  {
    "time": 43.27,
    "viseme": "ou"
  },
  {
    "time": 43.34,
    "viseme": "E"
  },
  {
    "time": 43.41,
    "viseme": "FF"
  },
  {
    "time": 43.48,
    "viseme": "E"
  },
  {
    "time": 43.55,
    "viseme": "aa"
  },
  {
    "time": 43.63,
    "viseme": "SS"
  },
  {
    "time": 43.76,
    "viseme": "E"
  },
  {
    "time": 43.9,
    "viseme": "ou"
  },
  {
    "time": 43.97,
    "viseme": "oh"
  },
  {
    "time": 44.11,
    "viseme": "E"
  },
  {
    "time": 44.57,
    "viseme": "FF"
  },
  {
    "time": 44.65,
    "viseme": "E"
  },
  {
    "time": 44.72,
    "viseme": "aa"
  },
  {
    "time": 44.8,
    "viseme": "SS"
  },
  {
    "time": 44.93,
    "viseme": "E"
  },
  {
    "time": 45,
    "viseme": "ou"
  },
  {
    "time": 45.42,
    "viseme": "E"
  },
  {
    "time": 45.56,
    "viseme": "ou"
  },
  {
    "time": 45.63,
    "viseme": "oh"
  },
  {
    "time": 45.77,
    "viseme": "E"
  },
  {
    "time": 46.22,
    "viseme": "FF"
  },
  {
    "time": 46.3,
    "viseme": "E"
  },
  {
    "time": 46.37,
    "viseme": "aa"
  },
  {
    "time": 46.45,
    "viseme": "SS"
  },
  {
    "time": 46.6,
    "viseme": "E"
  },
  {
    "time": 46.74,
    "viseme": "ou"
  },
  {
    "time": 46.88,
    "viseme": "E"
  },
  {
    "time": 46.95,
    "viseme": "ou"
  },
  {
    "time": 47.44,
    "viseme": "E"
  },
  {
    "time": 47.58,
    "viseme": "ou"
  },
  {
    "time": 47.65,
    "viseme": "oh"
  },
  {
    "time": 47.79,
    "viseme": "E"
  },
  {
    "time": 47.93,
    "viseme": "sil"
  },
  {
    "time": 48.15,
    "viseme": "E"
  },
  {
    "time": 48.37,
    "viseme": "SS"
  },
  {
    "time": 48.44,
    "viseme": "FF"
  },
  {
    "time": 48.51,
    "viseme": "SS"
  },
  {
    "time": 48.65,
    "viseme": "ou"
  },
  {
    "time": 48.79,
    "viseme": "sil"
  },
  {
    "time": 49.84,
    "viseme": "E"
  },
  {
    "time": 49.97,
    "viseme": "FF"
  },
  {
    "time": 50.39,
    "viseme": "E"
  },
  {
    "time": 50.46,
    "viseme": "ou"
  },
  {
    "time": 50.53,
    "viseme": "E"
  },
  {
    "time": 50.74,
    "viseme": "DD"
  },
  {
    "time": 50.81,
    "viseme": "FF"
  },
  {
    "time": 51.3,
    "viseme": "E"
  },
  {
    "time": 51.37,
    "viseme": "DD"
  },
  {
    "time": 51.44,
    "viseme": "ou"
  },
  {
    "time": 51.51,
    "viseme": "E"
  },
  {
    "time": 51.72,
    "viseme": "ou"
  },
  {
    "time": 51.79,
    "viseme": "SS"
  },
  {
    "time": 52.07,
    "viseme": "FF"
  },
  {
    "time": 52.14,
    "viseme": "E"
  },
  {
    "time": 52.21,
    "viseme": "ou"
  },
  {
    "time": 52.28,
    "viseme": "E"
  },
  {
    "time": 52.35,
    "viseme": "DD"
  },
  {
    "time": 52.42,
    "viseme": "ou"
  },
  {
    "time": 52.49,
    "viseme": "FF"
  },
  {
    "time": 52.77,
    "viseme": "E"
  },
  {
    "time": 53.33,
    "viseme": "sil"
  },
  {
    "time": 54.44,
    "viseme": "E"
  },
  {
    "time": 54.58,
    "viseme": "DD"
  },
  {
    "time": 54.65,
    "viseme": "ou"
  },
  {
    "time": 54.79,
    "viseme": "FF"
  },
  {
    "time": 55,
    "viseme": "E"
  },
  {
    "time": 55.21,
    "viseme": "SS"
  },
  {
    "time": 55.49,
    "viseme": "FF"
  },
  {
    "time": 55.56,
    "viseme": "E"
  },
  {
    "time": 55.63,
    "viseme": "SS"
  },
  {
    "time": 55.7,
    "viseme": "E"
  },
  {
    "time": 56.05,
    "viseme": "FF"
  },
  {
    "time": 56.26,
    "viseme": "E"
  },
  {
    "time": 56.47,
    "viseme": "FF"
  },
  {
    "time": 56.68,
    "viseme": "aa"
  },
  {
    "time": 56.76,
    "viseme": "SS"
  },
  {
    "time": 56.95,
    "viseme": "E"
  },
  {
    "time": 57.09,
    "viseme": "DD"
  },
  {
    "time": 57.23,
    "viseme": "oh"
  },
  {
    "time": 57.37,
    "viseme": "E"
  },
  {
    "time": 57.65,
    "viseme": "sil"
  },
  {
    "time": 58.35,
    "viseme": "ou"
  },
  {
    "time": 58.48,
    "viseme": "E"
  },
  {
    "time": 58.55,
    "viseme": "FF"
  },
  {
    "time": 58.62,
    "viseme": "ou"
  },
  {
    "time": 58.83,
    "viseme": "E"
  },
  {
    "time": 59.04,
    "viseme": "FF"
  },
  {
    "time": 59.18,
    "viseme": "E"
  },
  {
    "time": 59.39,
    "viseme": "SS"
  },
  {
    "time": 59.67,
    "viseme": "E"
  },
  {
    "time": 59.74,
    "viseme": "SS"
  },
  {
    "time": 59.81,
    "viseme": "E"
  },
  {
    "time": 59.95,
    "viseme": "FF"
  },
  {
    "time": 60.44,
    "viseme": "sil"
  }
]

/* -------------------- UTIL -------------------- */
const lower = (s) => (s || "").toLowerCase();
const Pill = (p) => (
  <button
    {...p}
    style={{
      width: p.isShowHideStyle && "120px",
      padding: p.compact ? "10px 14px" : "12px 18px",
      borderRadius: 14,
      border: "1px solid #2d3748",
      background: p.background || "#111827",
      color: "#eaeef2",
      cursor: "pointer",
      fontSize: p.compact ? 14 : 16,
      lineHeight: 1.2,
      ...p.style,
    }}
  />
);
const Bar = ({ value, color = "#10b981" }) => {
  const w = Math.min(100, Math.max(0, value * 100));
  return (
    <div style={{ height: 8, width: "100%", background: "#1f2937", borderRadius: 6, overflow: "hidden" }}>
      <div style={{ height: 8, width: `${w.toFixed(0)}%`, background: color, transition: "width 80ms linear" }} />
    </div>
  );
};

/* -------------------- RESPONSIVE HOOK -------------------- */
function useViewport() {
  const [vw, setVw] = useState(window.innerWidth);
  const [vh, setVh] = useState(window.innerHeight);
  useEffect(() => {
    const onR = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  const isMobile = vw <= 640;
  const isTablet = vw > 640 && vw <= 1024;
  return { vw, vh, isMobile, isTablet };
}

/* -------------------- CAMERA FIT RIG -------------------- */
function FitRig({ targetRef, headroom, trigger = 0 }) {
  const { camera, controls, size } = useThree();

  const fit = React.useCallback(() => {
    const root = targetRef.current;
    if (!root) return;

    const box = new THREE.Box3().setFromObject(root);
    if (box.isEmpty()) return;

    const center = new THREE.Vector3();
    const sizeV = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(sizeV);

    const height = sizeV.y;
    const target = center.clone().add(new THREE.Vector3(0, height * headroom, 0));
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const dist = (height * (1 + headroom * 2)) / (2 * Math.tan(fov / 2));

    // Preserve current viewing direction
    const baseTarget = controls?.target ?? new THREE.Vector3(0, 1, 0);
    const dir = new THREE.Vector3().subVectors(camera.position, baseTarget).normalize();
    if (!isFinite(dir.x) || !isFinite(dir.y) || !isFinite(dir.z)) dir.set(0, 0, 1);

    camera.position.copy(target.clone().add(dir.multiplyScalar(dist)));
    controls?.target.copy(target);
    controls?.update();
  }, [camera, controls, headroom, targetRef]);

  React.useEffect(() => { window.__fitAvatar = fit; }, [fit]);
  React.useEffect(() => { fit(); }, [fit, size.width, size.height, trigger]);

  return null;
}

/* -------------------- MORPH HELPERS -------------------- */
function resolveMorphIndex(dict, canonical) {
  if (!dict) return { index: undefined, usedKey: null };
  const direct = `viseme_${canonical}`;
  if (direct in dict) return { index: dict[direct], usedKey: direct };
  const aliases = VISEME_ALIASES[canonical] || [];
  for (const a of aliases) {
    const v1 = `viseme_${a}`;
    const v2 = `viseme_${a.toLowerCase()}`;
    const v3 = `viseme_${a.toUpperCase()}`;
    if (v1 in dict) return { index: dict[v1], usedKey: v1 };
    if (v2 in dict) return { index: dict[v2], usedKey: v2 };
    if (v3 in dict) return { index: dict[v3], usedKey: v3 };
  }
  return { index: undefined, usedKey: null };
}
function canonicalFromRaw(raw) {
  const name = raw.replace(/^viseme_/, "");
  for (const [canonical, list] of Object.entries(VISEME_ALIASES)) {
    if (list.map(lower).includes(lower(name))) return canonical;
  }
  return name;
}

/* -------------------- AVATAR -------------------- */
function Avatar({ audio, isPlaying, onViseme, onMorphDebug, onModelReady, offsetMs, level, threshold, energyAmp }) {
  const { scene } = useGLTF(MODEL_PATH);
  const meshRef = useRef(null);
  const idxRef = useRef(0);
  const vRef = useRef("sil");

  useEffect(() => {
    let head = null, fallback = null;
    scene.traverse((c) => {
      const isMesh = c.isMesh || c.isSkinnedMesh;
      if (!isMesh) return;
      const dict = c.morphTargetDictionary;
      if (!dict) return;
      const hasVis = Object.keys(dict).some((k) => k.startsWith("viseme_"));
      if (c.name === "Wolf3D_Head" && hasVis) head = c;
      if (!fallback && hasVis) fallback = c;
    });
    meshRef.current = head || fallback || null;
    const keys = Object.keys(meshRef.current?.morphTargetDictionary || {});
    onModelReady?.(scene, keys);
  }, [scene, onModelReady]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!isPlaying || !mesh || !audio) {
      mesh?.morphTargetInfluences?.fill(0);
      onViseme?.("sil");
      onMorphDebug?.({ morphName: null, morphIndex: -1, influence: 0 });
      return;
    }

    const t = audio.currentTime + (offsetMs || 0) / 1000;
    while (idxRef.current < visemeData.length && visemeData[idxRef.current].time <= t) {
      vRef.current = visemeData[idxRef.current].viseme;
      idxRef.current++;
    }

    const canonical = vRef.current;
    onViseme?.(canonical);

    mesh.morphTargetInfluences.fill(0);
    if (canonical === "sil") {
      onMorphDebug?.({ morphName: "viseme_sil", morphIndex: -1, influence: 0 });
      return;
    }

    const { index, usedKey } = resolveMorphIndex(mesh.morphTargetDictionary, canonical);
    if (index !== undefined) {
      const amp = energyAmp ? Math.max(0, (level - threshold) / Math.max(1e-6, 1 - threshold)) : 1;
      const infl = Math.min(1, Math.max(0, amp));
      mesh.morphTargetInfluences[index] = infl;
      onMorphDebug?.({ morphName: usedKey, morphIndex: index, influence: infl });
    } else {
      onMorphDebug?.({ morphName: `viseme_${canonical} (unmapped)`, morphIndex: -1, influence: 0 });
    }
  });

  return <primitive object={scene} />;
}

/* -------------------- MAIN (RESPONSIVE) -------------------- */
export default function VisemePlayer() {
  const { isMobile, isTablet, vw } = useViewport();
  const headroom = isMobile ? HEADROOM_MOBILE : HEADROOM_DESKTOP;

  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [qaOpen, setQaOpen] = useState(false);
  const [currentViseme, setCurrentViseme] = useState("sil");
  const [recentVisemes, setRecentVisemes] = useState([]);

  const [morphInfo, setMorphInfo] = useState({ morphName: null, morphIndex: -1, influence: 0 });
  const [availableKeys, setAvailableKeys] = useState([]);

  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState(0);
  const [threshold, setThreshold] = useState(0.035);
  const [offsetMs, setOffsetMs] = useState(0);
  const [energyAmp, setEnergyAmp] = useState(false);

  const availableCanonicals = useMemo(() => {
    const set = new Set(availableKeys.map(canonicalFromRaw));
    return set;
  }, [availableKeys]);
  const missingCanonicals = CANONICALS_USED.filter((c) => !availableCanonicals.has(c));
  const morphOK = morphInfo.morphIndex >= 0;

  /* audio */
  useEffect(() => {
    const el = new Audio(AUDIO_PATH);
    el.preload = "auto";
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => { setIsPlaying(false); el.currentTime = 0; };
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    setAudio(el);
    return () => {
      el.pause();
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.src = "";
    };
  }, []);

  /* analyser */
  const ctxRef = useRef(null), anRef = useRef(null), rafRef = useRef(null);
  const ensureAnalyser = () => {
    if (!audio || ctxRef.current) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx(); const src = ctx.createMediaElementSource(audio); const an = ctx.createAnalyser();
    an.fftSize = 2048; src.connect(an); an.connect(ctx.destination);
    ctxRef.current = ctx; anRef.current = an;
  };
  useEffect(() => {
    const tick = () => {
      if (audio && anRef.current) {
        const an = anRef.current, td = new Uint8Array(an.fftSize);
        an.getByteTimeDomainData(td);
        let s = 0; for (let i = 0; i < td.length; i++) { const v = (td[i] - 128) / 128; s += v * v; }
        const rms = Math.sqrt(s / td.length);
        setLevel((p) => p * 0.8 + rms * 0.2);
        const dur = audio.duration || 0, cur = audio.currentTime || 0;
        setProgress(dur > 0 ? cur / dur : 0);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [audio]);

  const togglePlay = async () => {
    if (!audio) return;
    ensureAnalyser();
    if (ctxRef.current?.state === "suspended") await ctxRef.current.resume();
    isPlaying ? audio.pause() : audio.play();
  };

  /* export */
  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      audio: AUDIO_PATH,
      model: MODEL_PATH,
      progressPct: Math.round(progress * 100),
      audioLevel: Number(level.toFixed(3)),
      threshold, offsetMs, energyAmp,
      currentViseme,
      recent: recentVisemes.slice(-12),
      morphTarget: morphInfo,
      visemeCoverage: {
        expectedCount: CANONICALS_USED.length,
        availableCount: availableCanonicals.size,
        missing: missingCanonicals
      },
      hints: [
        missingCanonicals.length
          ? `Missing morph targets: ${missingCanonicals.map((m) => `viseme_${m}`).join(", ")}. Ensure the model includes Oculus Visemes.`
          : "All required viseme morphs are present.",
        morphOK ? "Active morph maps correctly." : "Current viseme not found on model; check morph target naming.",
        `If timing feels early/late, adjust offset by ±80–120 ms (currently ${offsetMs}ms).`
      ]
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = `lip_sync_report_${Date.now()}.json`; a.click(); URL.revokeObjectURL(url);
  };

  /* keyboard */
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space") { e.preventDefault(); togglePlay(); }
      if (e.key.toLowerCase() === "q") setQaOpen((s) => !s);
      if (e.key.toLowerCase() === "f") window.__fitAvatar?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPlaying, audio]);

  const rootRef = useRef(null);

  /* --------- LAYOUT VALUES (responsive) --------- */
  const toolbarPad = isMobile ? "calc(8px + env(safe-area-inset-top))" : "12px";
  const sidePad = isMobile ? "calc(10px + env(safe-area-inset-left))" : "12px";
  const qaWidth = isMobile ? "auto" : isTablet ? 360 : 380;
  const qaMaxH = isMobile ? "46vh" : "auto";
  const btnCompact = isMobile;
  const font12 = { fontSize: isMobile ? 12 : 12 };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        background: "#0b0e14",
        color: "#eaeef2",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Toolbar: wraps on mobile, large tap targets */}
      <div
        style={{
          position: "absolute",
          top: toolbarPad,
          left: sidePad,
          right: sidePad,
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 2,
          pointerEvents: "auto",
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Pill compact={btnCompact} onClick={togglePlay} disabled={!audio}>
            {isPlaying ? "Pause" : "Play"}
          </Pill>
          <Pill compact={btnCompact} onClick={() => window.__fitAvatar?.()} title="Fit (F)">
            Fit
          </Pill>
          <Pill compact={btnCompact} onClick={exportReport} background="#0f766e">
            Export Report
          </Pill>
        </div>

        {/* Summary strip */}
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            padding: isMobile ? "8px 10px" : "8px 12px",
            borderRadius: 12,
            background: "#111827",
            border: "1px solid #243244",
            minWidth: isMobile ? Math.min(320, vw - 24) : 0,
          }}
        >
          {!isMobile && (
            <div style={{ minWidth: 160 }}>
              <div style={{ ...font12, opacity: 0.8, marginBottom: 4 }}>QA Summary — {Math.round(progress * 100)}%</div>
              <Bar value={progress} color="#3b82f6" />
            </div>
          )}
          {!isMobile && <div style={{ width: 1, height: 28, background: "#243244", margin: "0 6px" }} />}
          <div style={{ fontSize: isMobile ? 12 : 12, width: "200px" }}>
            Viseme: <b>{currentViseme}</b> | Level: <b>{(Math.min(1, level * 3) * 100).toFixed(0)}%</b> | Morph: {morphOK ? "✅" : "⚠️"}
          </div>
          <Pill compact={btnCompact} onClick={() => setQaOpen((s) => !s)} style={{ minWidth: 96, }} isShowHideStyle={true}>
            {qaOpen ? "Hide QA" : "Show QA"}
          </Pill>
        </div>
      </div>

      {/* QA panel: desktop top-right, mobile bottom-sheet */}
      {qaOpen && (
        <div
          style={{
            position: "absolute",
            ...(isMobile
              ? {
                left: sidePad,
                right: sidePad,
                bottom: "calc(8px + env(safe-area-inset-bottom))",
              }
              : { top: 80, right: sidePad }),
            width: isMobile ? "auto" : qaWidth,
            maxHeight: qaMaxH,
            padding: 12,
            borderRadius: isMobile ? 14 : 12,
            background: "#111827",
            border: "1px solid #243244",
            zIndex: 2,
            overflowY: isMobile ? "auto" : "visible",
            boxShadow: isMobile ? "0 8px 28px rgba(0,0,0,0.45)" : "none",
          }}
        >
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b>QA: Lip-Sync Sanity</b>
              <span style={{ fontSize: 12, opacity: 0.75 }}>{Math.round(progress * 100)}%</span>
            </div>

            {/* On mobile, show progress bar here */}
            {isMobile && (
              <div>
                <div style={{ ...font12, opacity: 0.8, marginBottom: 4 }}>Progress</div>
                <Bar value={progress} color="#3b82f6" />
              </div>
            )}

            <div>
              <div style={{ ...font12, opacity: 0.8, marginBottom: 4 }}>Audio Level</div>
              <Bar value={Math.min(1, level * 3)} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "92px 1fr" : "120px 1fr", gap: 6, alignItems: "center" }}>
              <div style={{ ...font12, opacity: 0.8 }}>Viseme</div>
              <div><b>{currentViseme}</b></div>

              <div style={{ ...font12, opacity: 0.8 }}>Recent</div>
              <div style={{ fontFamily: "monospace", fontSize: 12, opacity: 0.9 }}>{recentVisemes.slice(-12).join(" ")}</div>

              <div style={{ ...font12, opacity: 0.8 }}>Morph Target</div>
              <div style={{ fontSize: 12 }}>
                {morphOK ? "✅" : "⚠️"} {morphInfo.morphName || "(none)"}{" "}
                {morphOK && <span style={{ opacity: 0.8 }}>— idx {morphInfo.morphIndex}, infl {morphInfo.influence?.toFixed(2)}</span>}
              </div>

              <div style={{ ...font12, opacity: 0.8 }}>Coverage</div>
              <div style={{ fontSize: 12 }}>
                {availableCanonicals.size}/{CANONICALS_USED.length} visemes mapped {missingCanonicals.length ? "⚠️" : "✅"}
                {missingCanonicals.length > 0 && (
                  <div style={{ opacity: 0.8, fontSize: 12, marginTop: 2 }}>
                    Missing: {missingCanonicals.map((m) => `viseme_${m}`).join(", ")}
                  </div>
                )}
              </div>

              <div style={{ ...font12, opacity: 0.8 }}>Offset (ms)</div>
              <div>
                <input
                  type="range"
                  min={-250}
                  max={250}
                  step={5}
                  value={offsetMs}
                  onChange={(e) => setOffsetMs(parseInt(e.target.value, 10))}
                  style={{ width: "100%" }}
                />
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
                  Global sync offset: <b>{offsetMs}ms</b>
                </div>
              </div>

              <div style={{ ...font12, opacity: 0.8 }}>Energy Amp</div>
              <div>
                <label style={{ fontSize: 12 }}>
                  <input type="checkbox" checked={energyAmp} onChange={(e) => setEnergyAmp(e.target.checked)} />&nbsp; Multiply mouth by audio loudness
                </label>
                {energyAmp && (
                  <div style={{ marginTop: 6 }}>
                    <div
                      style={{
                        fontSize: 12,
                        opacity: 0.8,
                        marginBottom: 4,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Threshold</span>
                      <span style={{ fontVariantNumeric: "tabular-nums" }}>{threshold.toFixed(3)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.005"
                      max="0.1"
                      step="0.001"
                      value={threshold}
                      onChange={(e) => setThreshold(parseFloat(e.target.value))}
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
              </div>

              <div style={{ gridColumn: "1 / span 2", fontSize: 12, opacity: 0.85, marginTop: 6 }}>
                <b>Fix hints:</b> {missingCanonicals.length ? "Model is missing some viseme morphs; re-export with Oculus Visemes." : "All viseme morphs present."} If timing looks off, nudge the offset slider.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D VIEW */}
      <Canvas
        camera={{
          position: [0, isMobile ? 1.5 : 1.6, isMobile ? 3.4 : 3],
          fov: isMobile ? 50 : 45,
        }}
      >
        <color attach="background" args={["#0b0e14"]} />
        <ambientLight intensity={1.4} />
        <directionalLight position={[3, 6, 8]} intensity={2.0} />

        <Suspense fallback={null}>
          {audio && (
            <group ref={rootRef}>
              <Avatar
                audio={audio}
                isPlaying={isPlaying}
                onViseme={(v) => {
                  setCurrentViseme(v);
                  setRecentVisemes((prev) => {
                    const n = [...prev, v]; if (n.length > 14) n.shift(); return n;
                  });
                }}
                onMorphDebug={setMorphInfo}
                onModelReady={(_, keys) => { setAvailableKeys(keys || []); setTimeout(() => window.__fitAvatar?.(), 0); }}
                offsetMs={offsetMs}
                level={level}
                threshold={threshold}
                energyAmp={energyAmp}
              />
            </group>
          )}
        </Suspense>

        <FitRig
          targetRef={rootRef}
          headroom={headroom}
          /* trigger refit if layout changed (e.g., orientation) */
          trigger={`${isMobile ? "m" : isTablet ? "t" : "d"}:${Math.round(window.devicePixelRatio * 100)}`}
        />

        <OrbitControls
          makeDefault
          enablePan={false}
          /* wider zoom window on phones for pinch comfort */
          minDistance={isMobile ? 1.4 : 1.6}
          maxDistance={isMobile ? 5.5 : 4.5}
          zoomSpeed={isMobile ? 0.9 : 1.2}
          /* keep head + torso framed; allow modest tilt */
          minPolarAngle={Math.PI * 0.12}
          maxPolarAngle={Math.PI * 0.5}
        />
        <Preload all />
      </Canvas>
    </div>
  );
}
