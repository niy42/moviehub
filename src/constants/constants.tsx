// navItems.tsx
import HomeIcon from "@/assets/svg/Home.svg?react";
import PopularIcon from "../assets/svg/Popular.svg?react";
import TopRatedIcon from "../assets/svg/TopRated.svg?react";
import UpcomingIcon from "../assets/svg/Upcoming.svg?react";

export const NAV_ITEMS = [
  {
    to: "/",
    label: "Home",
    icon: <HomeIcon className="w-5 h-5" />,
  },
  {
    to: "/search?sort=popularity.desc",
    label: "Popular",
    icon: <PopularIcon className="w-5 h-5" />,
  },
  {
    to: "/search?sort=vote_average.desc",
    label: "Top Rated",
    icon: <TopRatedIcon className="w-5 h-5" />,
  },
  {
    to: "/search?sort=primary_release_date.desc",
    label: "Upcoming",
    icon: <UpcomingIcon className="w-5 h-5" />,
  },
] as const;
