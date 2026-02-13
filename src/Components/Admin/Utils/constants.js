import {
  faTachometerAlt,
  faCalendarAlt,
  faLightbulb,
  faNewspaper,
  faImages,
  faUsers,
  faUserPlus,
  faCalendarCheck ,
  faChartLine,
  faDonate,
  faUsersCog,
  faClipboardList,
  faCog,
  faSignOutAlt,
  faBell,
  faSearch,
  faEdit,
  faTrash,
  faPlus,
  faEye,
  faDownload,
  faFilter,
  faSort,
  faChevronDown,
  faBars,
  faTimes,
  faHome,
  faProjectDiagram,
  faCamera,
  faUserFriends,
  faHeart,
  faChartBar,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";

export const APP_CONFIG = {
  name: "Empathy Foundation",
  description: "Mental Health Awareness & Support",
  instagram: {
    manoday: "https://www.instagram.com/manoday_hospital/",
    sunshine: "https://www.instagram.com/sunshinecounsellingnashik/",
  },
  theme: {
    primary: "#2d365b", // Dark Blue
    secondary: "#f47058", // Coral Orange
    accent: "#7883ae", // Light Blue
    background: "#f8fafc",
    text: {
      primary: "#2d365b",
      secondary: "#64748b",
      light: "#94a3b8",
    },
  },
};

export const SIDEBAR_MENU = [
  {
    title: "Dashboard",
    icon: faTachometerAlt,
    path: "/admin",
  },
  {
    title: "Appointment",
    icon: faCalendarCheck ,
    path: "/admin/appointment",
  },
  {
    title: "Events",
    icon: faCalendarAlt,
    path: "/admin/events",
  },
  {
    title: "Initiatives",
    icon: faLightbulb,
    path: "/admin/initiatives",
  },
  {
    title: "Content",
    icon: faNewspaper,
    path: "/admin/blogs",
  },
  {
    title: "Media",
    icon: faImages,
    path: "/admin/gallery",
  },
  {
    title: "Team",
    icon: faUsersCog,
    path: "/admin/team",
  },
  {
    title: "Donations",
    icon: faDonate,
    path: "/admin/donations",
  },
  {
    title: "Volunteers",
    icon: faUserPlus,
    path: "/admin/volunteers",
  },
  {
    title: "User Management",
    icon: faUsers ,
    path: "/admin/user_management",
  },
];


