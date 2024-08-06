export function jwtDecode(token) {
  const base64Url = token.split(".")[1];
  const base64 = decodeURIComponent(
    atob(base64Url)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  const decodedToken = JSON.parse(base64);

  // Extract relevant fields and structure the response
  const EmployeeCode = decodedToken.EmployeeCode;
  const FirstName = decodedToken.FirstName;
  const UERMEmail = decodedToken.UERMEmail;
  const DeptCode = decodedToken.DeptCode;
  const FullName = decodedToken.FullName;
  const Department_Description = decodedToken.Department_Description;

  return { EmployeeCode, DeptCode, UERMEmail, FirstName, FullName, Department_Description};
}
