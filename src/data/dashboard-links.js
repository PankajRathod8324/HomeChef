import { ACCOUNT_TYPE } from "../utils/constants";
export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/cook",
    type: ACCOUNT_TYPE.COOK,
    icon: "VscDashboard",
  },
  {
    id: 3,
    name: "My Recipes",
    path: "/dashboard/my-recipes",
    type: ACCOUNT_TYPE.COOK,
    icon: "VscVm",
  },
  {
    id: 4,
    name: "Add Recipe",
    path: "/dashboard/add-recipe",
    type: ACCOUNT_TYPE.COOK,
    icon: "VscAdd",
  },
  {
    id: 5,
    name: "Enrolled Recipes",
    path: "/dashboard/enrolled-recipes",
    type: ACCOUNT_TYPE.CUSTOMER,
    icon: "VscMortarBoard",
  },
  // {
  //   id: 6,
  //   name: "Purchase History",
  //   path: "/dashboard/purchase-history",
  //   type: ACCOUNT_TYPE.CUSTOMER,
  //   icon: "VscHistory",
  // },
  {
    id: 7,
    name: "Cart",
    path: "/dashboard/cart",
    type: ACCOUNT_TYPE.CUSTOMER,
    icon: "VscArchive",
  },
];
