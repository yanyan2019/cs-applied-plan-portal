import url from "url";

// check if the current user is logged in
export function loggedIn() {

  return true;
}

// log the current user out
export function logout() {

  // redirect to the CAS logout page
  window.location.href = url.format({
    protocol: "https",
    hostname: "login.oregonstate.edu",
    pathname: "/idp-dev/profile/cas/logout",
  });

}

// get info about the current user
export function getProfile() {

  // set the default user
  const user = {
    userId: 0,
    role: 0
  };

  // get user info from cookies
  const userId = "userId=";
  const role = "role=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {

    let cookie = cookieArray[i];

    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }

    // if we find a cookie that we are looking for, then update the user object
    if (cookie.indexOf(userId) === 0) {
      user.userId = cookie.substring(userId.length, cookie.length);
    }
    if (cookie.indexOf(role) === 0) {
      user.role = cookie.substring(role.length, cookie.length);
    }
  }

  return user;

}
