"use client";
import styles from "@/styles/StarRating.module.css";
import { useEffect, useRef, useState, MutableRefObject } from "react";
import STAR from "../../../public/assets/svg/star.svg";

type PropsType = {
  evaluations?: string[];
  partials?: boolean;
  max?: number;
};

export default function StarRating({
  evaluations = "Terrible Bad Average Good Great".split(" "),
  partials = false,
  max = 5,
}: PropsType) {
  const [rating, setRating] = useState<number>();
  const [hovering, setHovering] = useState<number>();

  const drawStars = () => {
    let stars = [];
    for (let i = 0; i < max; i++) {
      const value = i + 1;
      stars.push(
        <div
          key={i}
          className={`${styles.star} ${
            (rating && value <= rating) || (hovering && value <= hovering)
              ? "shine"
              : "no-shine"
          } ${
            value === hovering || value === rating ? "selected" : "not-selected"
          }`}
          onClick={() => setRating(rating === value ? undefined : value)}
          onMouseEnter={() => setHovering(value)}
        >
          <STAR />
        </div>
      );
    }
    return stars;
  };

  return (
    <div className={`${styles.wrap} flex col middle`}>
      <div
        className={`${styles.cache} flex middle"`}
        onMouseLeave={() => setHovering(undefined)}
      >
        {drawStars()}
      </div>
      <div
        className={`${styles.eval} ${
          hovering || !!rating ? "rated" : "not-rated"
        }`}
      >
        {hovering
          ? evaluations[hovering - 1]
          : !!rating
          ? evaluations[rating - 1]
          : "Not Rated"}
      </div>
    </div>
  );
}
