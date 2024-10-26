import { jwtDecode } from "jwt-decode";
import { getAuthToken } from "@/lib/auth";

export const useAuth = () => {
  const token = getAuthToken();

  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    // console.log("isAdmin: ", decodedToken.isAdmin);
    // console.log("username: ", decodedToken.username);
    // console.log("userId: ", decodedToken.userId);
    const isExpired = decodedToken.exp * 1000 < Date.now();
    return !isExpired;
  } catch (error) {
    console.error("Invalid token", error);
    return false;
  }
};
